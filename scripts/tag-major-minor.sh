#!/bin/bash
set -e

echo $RELEASE_OUTPUTS
# git config user.name github-actions[bot]
#           git config user.email 41898282+github-actions[bot]@users.noreply.github.com
#           git remote add gh-token "https://${{ secrets.GITHUB_TOKEN }}@github.com/google-github-actions/release-please-action.git"
#           git tag -d v${{ steps.release.outputs.major }} || true
#           git tag -d v${{ steps.release.outputs.major }}.${{ steps.release.outputs.minor }} || true
#           git push origin :v${{ steps.release.outputs.major }} || true
#           git push origin :v${{ steps.release.outputs.major }}.${{ steps.release.outputs.minor }} || true
#           git tag -a v${{ steps.release.outputs.major }} -m "Release v${{ steps.release.outputs.major }}"
#           git tag -a v${{ steps.release.outputs.major }}.${{ steps.release.outputs.minor }} -m "Release v${{ steps.release.outputs.major }}.${{ steps.release.outputs.minor }}"
#           git push origin v${{ steps.release.outputs.major }}
#           git push origin v${{ steps.release.outputs.major }}.${{ steps.release.outputs.minor }}
