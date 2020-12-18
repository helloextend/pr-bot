#!/usr/bin/env node

const util = require('util')
const { Octokit } = require("@octokit/rest");

async function main () {
    const context = JSON.parse(process.env.GITHUB_CONTEXT)
    const token = process.env.GITHUB_TOKEN
    const debug = process.env.DEBUG
    const pullRequest = context.event.pull_request
    const {
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

    // if (!check_labels(pullRequest)) {
    //     return false
    // }

    const { status, data } = await octokit.pulls.merge({
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        pull_number: pullRequest.number,
        commit_title: "Merged via bot",
        commit_message: "",
        sha,
        merge_method: 'squash'
    })
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
