const util = require('util')

const context = JSON.parse(process.env.GITHUB_CONTEXT)

console.log('Event: ' + context.event)
console.log('PR Labels?: ' + context.event.pull_request.labels)
console.log(util.inspect(context.event.pull_request.labels, {showHidden: false, depth: null}))

