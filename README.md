# Tool without a name 

`.github/workflows/pr.yml` is the GitHub action that will currently run on:

```yaml
  pull_request:
    types: [labeled, unlabeled, opened, edited, reopened, sychronize, ready_for_review]
```

It calls `script.js` which will complete the merge

Example JSON payload object is in `payload.json`

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
