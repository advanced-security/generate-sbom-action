import {describe, expect, vi, it, beforeEach} from 'vitest'
import {generateSBOM} from '../src/generate-sbom'
import fs from 'fs'
import fsPromises from 'fs/promises'

// Mock the Octokit import
vi.mock('octokit', () => ({
  Octokit: vi.fn().mockImplementation(() => ({
    request: vi.fn()
  }))
}))

const mockSBOM = fs.readFileSync('./__tests__/mock-sbom.json', 'utf-8')

// Mock fs.writeFile
const mockWriteFile = vi
  .spyOn(fsPromises, 'writeFile')
  .mockImplementation((async () => {
    console.log('[mock] writing file')
  }) as any)

describe('generateSBOM', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should retrieve the SBOM for a repository', async () => {
    const token = 'test-token'
    const owner = 'octocat'
    const repo = 'hello-world'
    const sha = 'fe43fdf'

    // Create a mock Octokit instance
    const mockRequest = (vi.fn() as any).mockResolvedValue({
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
      JSON.stringify(JSON.parse(mockSBOM))
    )
  })

  it('should reject unsafe file name characters', async () => {
    const mockRequest = (vi.fn() as any).mockResolvedValue({
      data: {
        sbom: JSON.parse(mockSBOM)
      }
    })

    const mockOctokit = {
      request: mockRequest
    }

    await expect(
      generateSBOM(
        'test-token',
        'octocat',
        '../hello-world',
        'fe43fdf',
        mockOctokit as any
      )
    ).rejects.toThrow('repo contains unsupported characters')

    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})
