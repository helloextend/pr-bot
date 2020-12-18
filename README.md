# Tool Info

This is a github action that can be used in any repo to allow merges of a PR via addition of a label and standadized the final squash merge commit message.

It currently requires a user to have a valid JIRA ticket in their title

   
## Bonus
- Trigger circle ci test workflow
- Try getting this working as a consumable action from node-core. Much like `uses: helloextend/pr-bot@master`

## Tooling used so far

###Jira Actions
https://github.com/atlassian/gajira-login
https://github.com/atlassian/gajira-find-issue-key

###GitHub API
https://github.com/octokit
