import * as core from '@actions/core';
import { generateSBOM } from './generateSBOM';
import { getRequiredEnvParam, wrapError } from './utils';

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token');
    const repo_owner: string = getRequiredEnvParam('GITHUB_REPOSITORY');
    const [owner, repo] = repo_owner.split('/');
    const sha = getRequiredEnvParam('GITHUB_SHA');
    
    core.debug(new Date().toTimeString());
    await generateSBOM(token, owner, repo, sha);
    core.debug(new Date().toTimeString());
  } catch (error) {
    core.setFailed(wrapError(error).message);
  }
}

run();