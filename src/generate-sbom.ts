import * as core from '@actions/core'
import { Octokit } from 'octokit'
const { throttling } = require("@octokit/plugin-throttling");
import * as fs from 'fs'
import { wrapError } from './utils'

export async function createRepoList(
  token: string,
  owner: string,
  repo: string,
  octokit?: Octokit
): Promise<void> {
  const kit = octokit || new Octokit({ 
    auth: token,
    throttle: {
      onRateLimit: (
        retryAfter: number,
        options: any,
        _o: Octokit,
      ) => {
        core.setFailed(
          `Request quota exhausted for request ${options.method} ${options.url}. Retry after: ${retryAfter} seconds.`
        )
        process.exit(1);
      },
      onSecondaryRateLimit: (_retryAfter: number, options: any) => {
        core.setFailed(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`
        )
      }
    }
  })

  if (typeof repo !== 'undefined') {
    core.info(`repo name: ${owner}/${repo}`)
    await generateSBOM(kit, owner, repo)
  } else {
    core.info(`org name: ${owner}`)
    const repos = await kit.paginate(kit.rest.repos.listForOrg, {
      org: owner
    })
    core.info(`Found ${repos.length} repos`)
    for (const repo of repos) {
      core.info(`repo name: ${repo.name}`)
      await generateSBOM(kit, owner, repo.name)
    }
  }
}

export async function generateSBOM(
  kit: Octokit,
  owner: string,
  repo?: string,
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
        core.info(`SBOM written to ${fileName}`)
      }
    })
  } catch (error) {
    core.warning(`Failed to export SBOM for: ${repo} (is Dependency Graph enabled?)`)
  }
}
