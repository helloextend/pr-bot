# Tool Details

This is a github action that can be used in any repo that enforces a JIRA ticket in the title of the PR and uses that to standardize the squash commit message on merge

## ToDo
- Get testing setup and tests written
    
## Bonus
- Trigger circle ci test workflow
- Try getting this working as a consumable action from node-core. Much like `uses: helloextend/pr-bot@master`

## Tooling used so far

###Jira Actions
https://github.com/atlassian/gajira-login
https://github.com/atlassian/gajira-find-issue-key

###GitHub API
https://github.com/octokit
