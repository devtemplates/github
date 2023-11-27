# devtemplates/github/workflows/test

> Reusable test workflow used by devtemplates

## Usage

Right now, the test workflow is hardcoded to use a nodejs installation and test
against node v18, and v20. Subsequent releases will add support for explicitly,
defining your environment using nix, as well as detecting the supported node
versions using the package.json engines field.

Currently, no options can be overridden. Subsequent versions will allow more
fine grain control over test runs.

### Add Scripts

- `scripts/install.sh`: If your tests require additional dependencies to be
  installed, you can add a `scripts/install.sh` file which will be executed as a
  step prior to your test run.
- `scripts/test.sh`: This script is required and should contain the commands
  to run your tests.

### Add Workflow

Within your repository add a new workflow at `.github/workflows/run_test.yml`
and add the following contents:

```
name: test
on:
  pull_request:
    branches:
      - "**"
jobs:
  test:
    uses: devtemplates/github/workflows/test/workflow.yml@test-v1

```
