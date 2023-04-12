import * as core from '@actions/core';
import { Octokit } from "octokit";
import fs from 'fs';
import { wrapError } from './utils';

export async function generateSBOM(token: string, owner: string, repo: string, sha: string): Promise<void> {
  const octokit = new Octokit({
    auth: token
  });

  const res = await octokit.request('GET /repos/{owner}/{repo}/dependency-graph/sbom', {
    owner: owner,
    repo: repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const fileName = `sbom-${owner}-${repo}-${sha}.json`;
  await fs.writeFile(fileName, JSON.stringify((<any>res).data.sbom), (err) => {
    if (err) {
      const e = wrapError(err);
      core.setFailed(e.message);
    } else {
      core.setOutput('fileName', fileName);
      core.info(`SBOM written to ${fileName}`);
    }
  });
}