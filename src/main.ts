import * as core from '@actions/core'
import {createRepoList} from './generate-sbom'
import {wrapError} from './utils'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token')
    const resource: string = core.getInput('resource')
    const [owner, repo] = resource.split('/')

    core.debug(new Date().toTimeString())
    await createRepoList(token, owner, repo)
    core.debug(new Date().toTimeString())
  } catch (error) {
    core.setFailed(wrapError(error).message)
  }
}

run()
