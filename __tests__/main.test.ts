import { generateSBOM } from '../src/generateSBOM';
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['GITHUB_SHA'] = '123afebc898342123ccda234cdw3434';
  process.env['GITHUB_OWNER'] = 'octodemo/colind-bookstore-v4';
  const np = process.execPath;
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  };
  console.log(cp.execFileSync(np, [ip], options).toString())
});
