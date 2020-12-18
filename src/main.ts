import * as core from '@actions/core'
const { Octokit } = require("@octokit/rest");
import { inspect } from 'util'

async function run(): Promise<void> {
  try {
    const context = JSON.parse(core.getInput('context'))
    const debug = core.getInput('debug')
    if (debug) {
      log(context.event)
      log(context.event.pull_request.lables)
    }
    const token = process.env.GITHUB_TOKEN
    const jiraIssue = process.env.JIRA_ISSUE
    const pullRequest = context.event.pull_request
    const {
      head: { sha }
    } = pullRequest;

    const octokit = new Octokit()({
      auth: `token ${token}`,
      userAgent: '@extend/mergebot'
    })

    if (!checkLabels(pullRequest.labels)) {
        console.log("No labels on PR, nothing to do...")
        // return false
    }

    const commit = `[${jiraIssue}] - ${pullRequest.title} #${pullRequest.number}`

    const { status: reviewsStatus, data: reviewsData} = await octokit.pulls.listReviews({
      owner: pullRequest.base.repo.owner.login,
      repo: pullRequest.base.repo.name,
      pull_number: pullRequest.number
    }).catch((error: any) => {
      log(error)
      core.setFailed(error.message)
    })
    log(reviewsData)
    const { status: labelStatus, data: labelData } = await octokit.issues.addLabels({
      owner: pullRequest.base.repo.owner.login,
      repo: pullRequest.base.repo.name,
      issue_number: pullRequest.number,
      labels: ['MergeMe'],
    }).catch((error: any) => {
      log(error)
      core.setFailed(error.message)
    })
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
