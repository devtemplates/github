# devtemplates/github/workflows/renovate

> Reusable workflow to keep dependencies up to date using renovate

## Usage

### Create Github Token

Renovate cannot run with the default github action permissions and will require
you to pass a token with repo permissions.

See the [renovate documentation](https://github.com/renovatebot/github-action#token)
for more details.

### Add Renovate Configuration

The renovate workflow is currently hardcoded to reference configuration
specified in the file `.github/renovate.json5`. Note that the extension here
is `json5`. This is done so that configuration can include comments where
relevant.

While you may include any valid renovate configuration, devtemplates also
manages an opinionated default configuration that can be utilized:

```json5
{
  baseBranches: ["main"],
  extends: ["github>devtemplates/renovate-config"],
  // Allows testing config against branches other than the default ("main")
  useBaseBranchConfig: "merge",
}
```

### Add Workflow

Within your repository add a new workflow at `.github/workflows/run_renovate.yml`
and add the following contents:

```
name: renovate
on:
  schedule:
    - cron: "0/15 * * * *" # every 15 minutes
jobs:
  renovate:
    uses: devtemplates/github/workflows/renovate/workflow.yml@renovate-v1
    secrets:
      RENOVATE_TOKEN: ${{ secrets.RENOVATE_TOKEN }}
```
