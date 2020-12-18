const util = require('util')

async function main () {
    const context = JSON.parse(process.env.GITHUB_CONTEXT)

    console.log('Event: ' + context.event)
    console.log('PR Labels?: ' + context.event.pull_request.labels)
    console.log(util.inspect(context.event.pull_request.labels, {showHidden: false, depth: null}))

    if (check_labels(context.event.pull_request.labels)) {
        console.log('Merging!')
    } else {
        console.log("No labels, nothign to do...")
    }
}

main()

function check_labels(context) {
    if (context.event.pull_request.labels) {
        // Do some checks on if it has the right labels
        return true
    } else {
        return false
    }
}
