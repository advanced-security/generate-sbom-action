import {Octokit} from 'octokit'
import {describe, expect} from '@jest/globals'
import {createRepoList, generateSBOM} from '../src/generate-sbom'
import fs from 'fs'

const mockSBOM = fs.readFileSync('./__tests__/mock-sbom.json', 'utf-8')
const mockRepos = fs.readFileSync('./__tests__/mock-repos.json', 'utf-8')

jest.spyOn(fs, 'writeFile').mockImplementation((f, d, callback) => {
  console.log('[mock] writing file')
  callback(null)
})

describe('generateSBOMForRepo', () => {
  it('should retrieve the SBOM for a repository', async () => {
    const token = 'test-token'
    const resource = 'octocat/hello-world'
    const [owner, repo] = resource.split('/')

    const octokit = new Octokit()
    ;(<any>octokit).request = jest.fn().mockResolvedValue({
      data: {
        sbom: mockSBOM
      }
    })

    await generateSBOM(owner, repo, <any>octokit, 'repo')

    expect(octokit.request).toHaveBeenCalledWith(
      'GET /repos/{owner}/{repo}/dependency-graph/sbom',
      {
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    expect(fs.writeFile).toHaveBeenCalledWith(
      `sbom-${owner}-${repo}.json`,
      JSON.stringify(mockSBOM),
      expect.any(Function)
    )
  })
})

describe('generateSBOMForOrg', () => {
  it('should retrieve the SBOMs for an organization', async () => {
    const token = 'test-token'
    const resource = 'actions'
    const [owner, repo] = resource.split('/')

    const octokit = new Octokit()
    ;(<any>octokit).paginate = jest.fn().mockResolvedValue({
      data: {
        repos: mockRepos
      }
    })

    console.log(`this is org: ${owner}`)

    // repo is supposed to be undefined
    await createRepoList(token, owner, repo, <any>octokit)

    expect(octokit.paginate).toHaveBeenCalledWith(
      'GET /orgs/{owner}/repos',
      {
        owner,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )
    
    // TODO: this fails b/c no repos are returned in the above mock
    expect(fs.writeFile).toHaveBeenCalledWith(
      `sbom-${owner}-*.json`,
      JSON.stringify(mockSBOM),
      expect.any(Function)
    )
  })
})
