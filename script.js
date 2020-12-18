const context = JSON.parse(process.env.GITHUB_CONTEXT)

console.log('Event: ' + context.event)
console.log('PR: ' + context.event.pull_request)
