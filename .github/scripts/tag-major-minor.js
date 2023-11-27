/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// core
const { execSync } = require("child_process");

/* -----------------------------------------------------------------------------
 * tag-major-minor.js
 *
 * This is a supplemental step for release-please to tag major and minor
 * versions helpful for github actions workflows/actions.
 *
 * NOTE: Right now this is hardcoded for the usage with the manifest command
 * as that is the requirement of this repository. It should be trivial to
 * support the more common one-to-one mapping of repo -> release but would
 * require inspection of the RELEASE_OUTPUTS for that scenario.
 *
 * Ref: https://github.com/google-github-actions/release-please-action#creating-majorminor-tags
 * -------------------------------------------------------------------------- */

const tempReleaseOutputs = {
  releases_created: "true",
  "workflows/renovate--release_created": "true",
  "workflows/renovate--id": "131783800",
  "workflows/renovate--name": "renovate: v1.0.0",
  "workflows/renovate--tag_name": "renovate-v1.0.0",
  "workflows/renovate--sha": "90337befdb45be646b8f35ddb179d31aef070258",
  "workflows/renovate--body":
    "## 1.0.0 (2023-11-28)\n\n\n### Features\n\n* initial commit ([cb535c0](https://github.com/devtemplates/github/commit/cb535c004a573cc39e00d823dc0b9cf7d24e14dc))",
  "workflows/renovate--html_url":
    "https://github.com/devtemplates/github/releases/tag/renovate-v1.0.0",
  "workflows/renovate--draft": "false",
  "workflows/renovate--upload_url":
    "https://uploads.github.com/repos/devtemplates/github/releases/131783800/assets{?name,label}",
  "workflows/renovate--path": "workflows/renovate",
  "workflows/renovate--version": "1.0.0",
  "workflows/renovate--major": "1",
  "workflows/renovate--minor": "0",
  "workflows/renovate--patch": "0",
  "workflows/test--release_created": "true",
  "workflows/test--id": "131783805",
  "workflows/test--name": "test: v1.0.0",
  "workflows/test--tag_name": "test-v1.0.0",
  "workflows/test--sha": "90337befdb45be646b8f35ddb179d31aef070258",
  "workflows/test--body":
    "## 1.0.0 (2023-11-28)\n\n\n### Features\n\n* initial commit ([cb535c0](https://github.com/devtemplates/github/commit/cb535c004a573cc39e00d823dc0b9cf7d24e14dc))",
  "workflows/test--html_url":
    "https://github.com/devtemplates/github/releases/tag/test-v1.0.0",
  "workflows/test--draft": "false",
  "workflows/test--upload_url":
    "https://uploads.github.com/repos/devtemplates/github/releases/131783805/assets{?name,label}",
  "workflows/test--path": "workflows/test",
  "workflows/test--version": "1.0.0",
  "workflows/test--major": "1",
  "workflows/test--minor": "0",
  "workflows/test--patch": "0",
  paths_released: '["workflows/renovate","workflows/test"]',
};

module.exports = function run() {
  const outputs = parseReleaseOutputs(JSON.stringify(tempReleaseOutputs));
  // const outputs = parseReleaseOutputs(process.env.RELEASE_OUTPUTS);
  const pathTags = outputs.paths_released.map((path) => ({
    major: getPathMajorTag(path, outputs),
    minor: getPathMinorTag(path, outputs),
  }));

  configureGit;
  for (let tags of pathTags) {
    replaceTag(tags.major);
    replaceTag(tags.minor);
  }

  return pathTags;
};

/* -----------------------------------------------------------------------------
 * release-please utils
 * -------------------------------------------------------------------------- */

const RELEASE_OUTPUTS_ERROR = [
  "Ensure that you have correctly set the env var RELEASE_OUTPUTS for this step. Note that you need to convert the object to JSON while setting the value:",
  "",
  "env:",
  "  RELEASE_OUTPUTS: ${{ toJson(steps.release.outputs) }}",
].join("\n");

function parseReleaseOutputs(outputsStr) {
  let outputs;
  try {
    outputs = JSON.parse(outputsStr);
    outputs.paths_released = JSON.parse(outputs.paths_released);
    return outputs;
  } catch (error) {
    throw new Error(RELEASE_OUTPUTS_ERROR, { cause: error });
  }
}

function getPathParsedVersion(path, outputs) {
  const major = outputs[`${path}--major`];
  const minor = outputs[`${path}--minor`];
  const patch = outputs[`${path}--patch`];
  const version = `${major}.${minor}.${patch}`;

  return { major, minor, patch, version };
}

function getPathTagPrefix(path, outputs) {
  const { major, minor, patch } = getPathParsedVersion(path, outputs);
  const version = `${major}.${minor}.${patch}`;
  const tagName = outputs[`${path}--tag_name`];

  return tagName.replace(`${version}`, "");
}

function getPathMajorTag(path, outputs) {
  const { major } = getPathParsedVersion(path, outputs);
  return `${getPathTagPrefix(path, outputs)}${major}`;
}

function getPathMinorTag(path, outputs) {
  const { major, minor } = getPathParsedVersion(path, outputs);
  return `${getPathTagPrefix(path, outputs)}${major}.${minor}`;
}

/* -----------------------------------------------------------------------------
 * git commands
 * -------------------------------------------------------------------------- */

function configureGit() {
  const GIT_USERNAME = "github-actions[bot]";
  const GIT_EMAIL = "41898282+github-actions[bot]@users.noreply.github.com";

  execCommand(`git config user.name ${GIT_USERNAME}`);
  execCommand(`git config user.email ${GIT_EMAIL}`);
}

function replaceTag(tag) {
  try {
    execCommand(`git tag -d ${tag}`);
    execCommand(`git push origin :${tag}`);
  } catch (error) {
    // these commands error if the tag doesn't exist
  }

  execCommand(`git tag -a ${tag} -m "Release ${tag}"`);
  execCommand(`git push origin ${tag}`);
}

function execCommand(cmd) {
  execSync(cmd, { stdio: "inherit" });
}
