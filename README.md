# Tool without a name 

`.github/workflows/pr.yml` is the GitHub action that will currently run on:

```yaml
  pull_request:
    types: [labeled, unlabeled, opened, edited, reopened, sychronize, ready_for_review]
```

It calls `script.js` which will complete the merge

Example JSON payload object is in `payload.json`

## ToDo
- Determine what credentials are being used by the action (Currently looks like it's whoever triggered the event) 
  - Depending on who this is weshould decide how to handle the commit author(`Bot on behalf of <PR Initiator>`, Person who triggered the event, `Person who triggered the event on behalf of PR Initiator`?)
- Do we want the bot to remove its label on failure so a user has to reapply it?
- Confirm that the Jira action is properly failing the action if there isn't a valid ticket in the branch 
- Work out event types to invoke on for questions like:
  - Should we allow a user to apply the label ahead of time and when the proper approvals are in place then merge.
- We should confirm that not having the approvals will cause this action to fail or not run
- Find the best way to surface action errors(Merge failure, not enough approvals, missing jira title, etc) to users. Slack? PR Comment? Email?
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
