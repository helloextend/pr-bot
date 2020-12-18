#!/usr/bin/env node

const util = require('util')
const { Octokit } = require("@octokit/rest");

async function main () {
    const context = JSON.parse(process.env.GITHUB_CONTEXT)
    const token = process.env.GITHUB_TOKEN
    const debug = process.env.DEBUG
    const jiraIssue = process.env.JIRA_ISSUE
    const pullRequest = context.event.pull_request
    const {
        number: pullRequestNumber,
        title: pullRequestTitle,
        head: { sha }
    } = pullRequest;

    const octokit = new Octokit({
        auth: `token ${token}`,
        userAgent: '@extend/mergebot'
    })

    if (debug) {
        log(context.event.pull_request.lables)
    }

    if (!checkLabels(pullRequest.labels)) {
        console.log("No labels on PR, nothing to do...")
        return false
    }

    const commit = `[${jiraIssue}] - ${pullRequestTitle} #${pullRequestNumber}`

    const mergeParams = {
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        pull_number: pullRequest.number,
        commit_title: commit,
        commit_message: "",
        sha,
        merge_method: 'squash'
    }
    const { status, data } = await octokit.pulls.merge(mergeParams)
    log(data)
    return status === 200;
}

main()

function log(toLog) {
    console.log(util.inspect(toLog, {showHidden: false, depth: null}))
}

function checkLabels(labels) {
    let flag = false
    if (labels.length > 0) {
        labels.forEach(label => {
            if (label.name === 'MergeMe') {
                flag = true
            }
        })
    }
    return flag
}
