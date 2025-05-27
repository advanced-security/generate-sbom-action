import {describe, expect, jest, it, beforeEach} from '@jest/globals'
import {generateSBOM} from '../src/generate-sbom'
import fs from 'fs'

// Mock the Octokit import
jest.mock('octokit', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    request: jest.fn()
  }))
}))

const mockSBOM = fs.readFileSync('./__tests__/mock-sbom.json', 'utf-8')

// Mock fs.writeFile
const mockWriteFile = jest.spyOn(fs, 'writeFile').mockImplementation((f, d, callback: any) => {
  console.log('[mock] writing file')
  callback(null)
})

describe('generateSBOM', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should retrieve the SBOM for a repository', async () => {
    const token = 'test-token'
    const owner = 'octocat'
    const repo = 'hello-world'
    const sha = 'fe43fdf'

    // Create a mock Octokit instance
    const mockRequest = (jest.fn() as any).mockResolvedValue({
      data: {
        sbom: JSON.parse(mockSBOM)
      }
    })

    const mockOctokit = {
      request: mockRequest
    }

    await generateSBOM(token, owner, repo, sha, mockOctokit as any)

    expect(mockRequest).toHaveBeenCalledWith(
      'GET /repos/{owner}/{repo}/dependency-graph/sbom',
      {
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    )

    expect(mockWriteFile).toHaveBeenCalledWith(
      `sbom-${owner}-${repo}-${sha}.json`,
      JSON.stringify(JSON.parse(mockSBOM)),
      expect.any(Function)
    )
  })
})
