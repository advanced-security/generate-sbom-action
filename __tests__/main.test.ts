import {generateSBOM} from '../src/generate-sbom'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

// set to a real token to test
const token = '<token>'

// test('generates SBOM', async () => {
//   await generateSBOM(
//     token,
//     'octodemo',
//     'colind-bookstore-v4',
//     '123afebc898342123ccda234cdw3434'
//   )
// })

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['GITHUB_SHA'] = '123afebc898342123ccda234cdw3434'
  process.env['GITHUB_OWNER'] = 'octodemo/colind-bookstore-v4'
  process.env['GITHUB_TOKEN'] = token
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
