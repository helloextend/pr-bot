const util = require('util')
const { Octokit } = require("@octokit/rest");

async function main () {
    const octokit = new Octokit()
    const context = JSON.parse(process.env.GITHUB_CONTEXT)
    const debug = process.env.DEBUG
    const pullRequest = context.event.pull_request
    const {
        head: { sha }
    } = pullRequest;

    if (debug) {
        console.log(util.inspect(context.event.pull_request.labels, {showHidden: false, depth: null}))
        //console.log(util.inspect(context.event.pull_request, {showHidden: false, depth: null}))
    }

    if (!check_labels(pullRequest)) {
        return false
    }

    await octokit.pulls.merge({
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        pull_number: pullRequest.number,
        commit_title: "Merged via bot",
        commit_message: "",
        sha,
        merge_method: 'squash'
    })
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
