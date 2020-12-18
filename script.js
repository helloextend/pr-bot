#!/usr/bin/env node

const util = require('util')
const { Octokit } = require("@octokit/rest")
const core = require('@actions/core')

async function main () {
    const context = JSON.parse(process.env.GITHUB_CONTEXT)
    const debug = process.env.DEBUG
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

    const octokit = new Octokit({
        auth: `token ${token}`,
        userAgent: '@extend/mergebot'
    })

    if (!checkLabels(pullRequest.labels)) {
        console.log("No labels on PR, nothing to do...")
        return false
    }

    const commit = `[${jiraIssue}] - ${pullRequest.title} #${pullRequest.number}`

    const { status, data } = await mergePr(octokit, pullRequest, commit, sha)
        .catch(error => {
            log(error)
            core.setFailed(error.message)
        })
    log(data)
    return status === 200
}

main()

async function mergePr(octokit, pullRequest, commit_title, sha) {
    const mergeParams = {
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        pull_number: pullRequest.number,
        commit_title,
        commit_message: "",
        sha,
        merge_method: 'squash'
    }
    const { status, data } = await octokit.pulls.merge(mergeParams)
    return { status, data }
}

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
