const util = require('util')
const { Octokit } = require("@octokit/rest");

async function main () {
    const context = JSON.parse(process.env.GITHUB_CONTEXT)

    console.log(util.inspect(context.event.pull_request.labels, {showHidden: false, depth: null}))
    console.log(util.inspect(context.event.pull_request, {showHidden: false, depth: null}))

    const pullRequest = context.event.pull_request
    const {
        head: { sha }
    } = pullRequest;

    const octokit = new Octokit()
    await octokit.pulls.merge({
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        pull_number: pullRequest.number,
        commit_title: "Merged via bot",
        commit_message: "",
        sha,
        merge_method: 'squash'
    })

    if (check_labels(context.event.pull_request.labels)) {
        console.log('Merging!')
    } else {
        console.log("No labels, nothign to do...")
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
