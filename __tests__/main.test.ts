import { Octokit } from '@octokit/core';
import { generateSBOM } from '../src/generate-sbom';
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import fs from 'fs';

const mockSBOM = fs.readFileSync("./__tests__/mock-sbom.json", "utf-8");

jest.spyOn(fs, 'writeFile').mockImplementation((f, d, callback) => {
  console.log("[mock] writing file");
  callback(null);
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['GITHUB_SHA'] = '123afebc898342123ccda234cdw3434'
  process.env['GITHUB_OWNER'] = 'octodemo/colind-bookstore-v4'
  process.env['GITHUB_TOKEN'] = 'test-token'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
