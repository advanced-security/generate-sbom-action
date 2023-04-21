import { Octokit } from '@octokit/core';
import {describe, expect } from '@jest/globals';
import { generateSBOM } from '../src/generate-sbom';
import fs from 'fs';

const mockSBOM = fs.readFileSync("./__tests__/mock-sbom.json", "utf-8");

jest.spyOn(fs, 'writeFile').mockImplementation((f, d, callback) => {
  console.log("[mock] writing file");
  callback(null);
});

describe('generateSBOM', () => {
  it('should retrieve the SBOM for a repository', async () => {
    const token = "test-token";
    const owner = 'octocat';
    const repo = 'hello-world';
    const sha = "fe43fdf"

    const octokit = new Octokit();
    (<any>octokit).request = jest.fn().mockResolvedValue({
      data: {
        sbom: mockSBOM
      } 
    });

    await generateSBOM(token, owner, repo, sha, <any>octokit);

    expect(octokit.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/dependency-graph/sbom', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    expect(fs.writeFile).toHaveBeenCalledWith(
      `sbom-${owner}-${repo}-${sha}.json`, JSON.stringify(mockSBOM), expect.any(Function));
  });
});