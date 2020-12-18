import * as core from '@actions/core'
import { Octokit } from "@octokit/rest"
import { inspect } from 'util'

async function run(): Promise<void> {
  try {
    const context = JSON.parse(core.getInput('context'))
    const debug = core.getInput('debug')
    if (debug) {
      log(context.event)
      log(context.event.pull_request.labels)
    }
    const token = core.getInput('token')
    const jiraIssue = process.env.JIRA_ISSUE
    const pullRequest = context.event.pull_request
    const {
      head: { sha }
    } = pullRequest

    log('1')
    const octokit = new Octokit({
      auth: `token ${token}`,
      userAgent: '@extend/mergebot'
    })

    if (!checkLabels(pullRequest.labels)) {
        console.log("No labels on PR, nothing to do...")
        // return false
    }
    log('2')
    const commit = `[${jiraIssue}] - ${pullRequest.title} #${pullRequest.number}`

    const listResponse = await octokit.pulls.listReviews({
      owner: pullRequest.base.repo.owner.login,
      repo: pullRequest.base.repo.name,
      pull_number: pullRequest.number
    }).catch((error: any) => {
      log(error)
      core.setFailed(error.message)
    })
    log(listResponse)
    const labelResponse = await octokit.issues.addLabels({
      owner: pullRequest.base.repo.owner.login,
      repo: pullRequest.base.repo.name,
      issue_number: pullRequest.number,
      labels: ['MergeMe'],
    }).catch((error: any) => {
      log(error)
      core.setFailed(error.message)
    })
    log(labelResponse)
    // const { status, data } = await mergePr(octokit, pullRequest, commit, sha)
    //     .catch(error => {
    //         log(error)
    //         core.setFailed(error.message)
    //     })
    // log(data)
    // return status === 200
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()


// async function mergePr(octokit, pullRequest, commit_title, sha) {
//   const mergeParams = {
//     owner: pullRequest.base.repo.owner.login,
//     repo: pullRequest.base.repo.name,
//     pull_number: pullRequest.number,
//     commit_title,
//     commit_message: "",
//     sha,
//     merge_method: 'squash'
//   }
//   const { status, data } = await octokit.pulls.merge(mergeParams)
//   return { status, data }
// }

function log(toLog: any) {
  console.log(inspect(toLog, {showHidden: false, depth: null}))
}


function getVar(varName: string): string {
  const envVar = process.env[varName]
  let returnVar: string = ""
  if (envVar === undefined) {
    core.setFailed(`${varName} is not available`)
  } else {
    returnVar = envVar
  }
  return returnVar
}

export function checkLabels(labels: any) {
  let flag = false
  if (labels.length > 0) {
    labels.forEach((label: any) => {
      if (label.name === 'MergeMe') {
        flag = true
      }
    })
  }
  return flag
}
