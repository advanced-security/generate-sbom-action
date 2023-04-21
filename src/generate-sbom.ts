import * as core from '@actions/core'
import {Octokit} from 'octokit'
import fs from 'fs'
import {wrapError} from './utils'

export async function generateSBOM(
  token: string,
  owner: string,
  repo: string,
  sha: string,
  octokit?: Octokit
): Promise<void> {
  const kit = octokit || new Octokit({auth: token})

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

  const fileName = `sbom-${owner}-${repo}-${sha}.json`
  fs.writeFile(fileName, JSON.stringify(res.data.sbom), err => {
    if (err) {
      const e = wrapError(err)
      core.setFailed(e.message)
    } else {
      core.setOutput('fileName', fileName)
      core.info(`SBOM written to ${fileName}`)
    }
  })
}
