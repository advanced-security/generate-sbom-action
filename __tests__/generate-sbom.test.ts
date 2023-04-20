import { generateSBOM } from '../src/generate-sbom';
import { Octokit } from '@octokit/core';
import {describe, expect } from '@jest/globals';

// create a partial mock of the @octokit/core module with methods for constructor and request
jest.mock('@octokit/core', () => {
    const originalModule = jest.requireActual('@octokit/core');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => 'mocked baz'),
        request: jest.fn()
    };
});


describe('generateSBOM', () => {
  it('should retrieve the SBOM for a repository', async () => {
    const token = "test-token";
    const owner = 'octocat';
    const repo = 'hello-world';
    const sbom = [
      {
        name: 'lodash',
        version: '4.17.21',
        dependencies: [
          {
            name: 'chalk',
            version: '4.1.2'
          }
        ]
      }
    ];
    const octokit = new Octokit();
    octokit.request.mockResolvedValue({ data: sbom });

    await generateSBOM(token, owner, repo);

    expect(octokit.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/dependency-graph/sbom', {
      owner,
      repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
  });
});