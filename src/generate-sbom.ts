import * as core from '@actions/core'
import {Octokit} from 'octokit'
import * as fs from 'fs'
import {wrapError} from './utils'

type ThrottleOptions = {
  method: string
  url: string
  request: {retryCount: number}
}

export async function createRepoList(
  token: string,
  owner: string,
  repo: string,
  octokit?: Octokit
): Promise<void> {
  const kit =
    octokit ||
    new Octokit({
      auth: token,
      throttle: {
        onRateLimit: (retryAfter: number, options: ThrottleOptions) => {
          core.setFailed(
            `Request quota exhausted for request ${options.method} ${options.url}. Retry after: ${retryAfter} seconds.`
          )
          process.exit(1)
        },
        onSecondaryRateLimit: (
          _retryAfter: number,
          options: ThrottleOptions
        ) => {
          core.setFailed(
            `SecondaryRateLimit detected for request ${options.method} ${options.url}`
          )
          process.exit(1)
        }
      }
    })

  if (typeof repo !== 'undefined') {
    core.info(`repo name: ${owner}/${repo}`)
    await generateSBOM(owner, repo, kit, 'repo')
  } else {
    core.info(`org name: ${owner}`)
    const repos = await kit.paginate('GET /orgs/{owner}/repos', {
      owner,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    core.info(`Found ${repos.length} repos`)

    for (const orgRepo of repos as {name: string}[]) {
      core.info(`repo name: ${orgRepo.name}`)
      await generateSBOM(owner, orgRepo.name, kit, 'org')
    }
  }
}

export async function generateSBOM(
  owner: string,
  repo: string,
  kit: Octokit,
  type?: string
): Promise<void> {
  try {
    const res = await kit.request(
      'GET /repos/{owner}/{repo}/dependency-graph/sbom',
      {
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    const fileName = `sbom-${owner}-${repo}.json`
    fs.writeFile(fileName, JSON.stringify(res.data.sbom), err => {
      if (err) {
        const e = wrapError(err)
        core.setFailed(e.message)
      } else {
        if (type === 'repo') {
          core.setOutput('fileName', fileName)
        } else if (type === 'org') {
          core.setOutput('fileName', `sbom-${owner}-*.json`)
        }
        core.info(`SBOM written to ${fileName}`)
      }
    })
  } catch (error) {
    core.warning(
      `Failed to export SBOM for: ${repo} (is Dependency Graph enabled?)`
    )
  }
}
