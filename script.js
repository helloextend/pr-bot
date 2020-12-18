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
    });

    if (debug) {
        console.log(util.inspect(context.event.pull_request.labels, {showHidden: false, depth: null}))
        //console.log(util.inspect(context.event.pull_request, {showHidden: false, depth: null}))
    }

    if (!check_labels(pullRequest)) {
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
    // const { status, data } = await octokit.pulls.merge(mergeParams)
    console.log(util.inspect(data, {showHidden: false, depth: null}))
    if ( status === 200 ) {
        return true
    } else {
        return false
    }
}

main()

function check_labels(labels) {
    if (labels.length > 0) {
        labels.forEach(label => {
            if (label.name === 'MergeMe') {
                return true
            }
        })
    }
    return false
}

function parseJira(pullRequest) {
    var s = "BF-18 abc-123 X-88 ABCDEFGHIJKL-999 abc XY-Z-333 abcDEF-33 ABC-1"
    s = reverse(s)
    var m = s.match(jira_matcher);

// Also need to reverse all the results!
    for (var i = 0; i < m.length; i++) {
        m[i] = reverse(m[i])
    }
    m.reverse()
    console.log(m)
}
