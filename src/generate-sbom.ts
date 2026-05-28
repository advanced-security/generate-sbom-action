import * as core from '@actions/core'
import {Octokit} from 'octokit'
import fs from 'fs/promises'
import path from 'path'
import {wrapError} from './utils'

const safeFileNameCharacters = /^[A-Za-z0-9._-]+$/

function safeFileNameSegment(value: string, name: string): string {
  const baseName = path.basename(value)
  if (
    baseName !== value ||
    baseName === '.' ||
    baseName === '..' ||
    !safeFileNameCharacters.test(baseName)
  ) {
    throw new Error(`${name} contains unsupported characters`)
  }

  return baseName
}

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

  const fileName = `sbom-${safeFileNameSegment(owner, 'owner')}-${safeFileNameSegment(repo, 'repo')}-${safeFileNameSegment(sha, 'sha')}.json`

  try {
    await fs.writeFile(fileName, JSON.stringify(res.data.sbom))
    core.setOutput('fileName', fileName)
    core.info(`SBOM written to ${fileName}`)
  } catch (error) {
    const e = wrapError(error)
    core.setFailed(e.message)
  }
}
