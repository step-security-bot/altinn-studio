#!/usr/bin/env bash

set -e
set -u

PRE_RELEASE=no
COMMIT=no
SYNC_AZURE_CDN=no

while [[ $# -gt 0 ]]; do
  case $1 in
    --cdn)
      PATH_TO_CDN=$(realpath "$2")
      shift # pop option
      shift # pop value
      ;;
    --frontend)
      PATH_TO_FRONTEND=$(realpath "$2")
      shift # pop option
      shift # pop value
      ;;
    --pre-release)
      PRE_RELEASE=yes
      shift # pop option
      ;;
    --commit)
      COMMIT=yes
      shift # pop option
      ;;
    --azure-sa-name)
      AZURE_STORAGE_ACCOUNT_NAME="$2"
      shift # pop option
      shift # pop option
      ;;
    --azure-sa-token)
      AZURE_STORAGE_ACCOUNT_TOKEN="$2"
      shift # pop option
      shift # pop option
      ;;
    --azure-sync-cdn )
      SYNC_AZURE_CDN=yes
      shift #pop option
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
    *)
      echo "Unknown argument $1"
      exit 1
      ;;
  esac
done

SOURCE=dist
TARGET=studio/designer/frontend
# AZURE_TARGET_URI="https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/app-frontend"

if ! test -d "$PATH_TO_CDN" || ! test -d "$PATH_TO_CDN/$TARGET"; then
  echo "Unable to find $PATH_TO_CDN/$TARGET"
  echo "Make sure path to CDN has been passed with --cdn <path>"
  exit 1
fi
if ! test -d "$PATH_TO_FRONTEND" || ! test -d "$PATH_TO_FRONTEND/$SOURCE"; then
  echo "Unable to find $PATH_TO_FRONTEND/$SOURCE (did you run yarn build first?)"
  echo "Make sure path to frontend files has been passed with --frontend <path>"
  exit 1
fi

SOURCE="$PATH_TO_FRONTEND/$SOURCE"
TARGET="$PATH_TO_CDN/$TARGET"

echo "-------------------------------------"
echo "Source:        $SOURCE"
echo "Target:        $TARGET"
echo "Commit:        $COMMIT (toggle with --commit)"
echo "-------------------------------------"

AUTHOR_FULL=$(git log -1 | grep Author | sed 's/^Author: //')
AUTHOR_NAME="$(echo "$AUTHOR_FULL" | sed -r 's/<.*//')"
AUTHOR_EMAIL="$(echo "$AUTHOR_FULL" | sed -r 's/^.*?<//' | sed 's/>//')"
COMMIT_ID=$(git rev-parse HEAD~0)

echo "Latest author: $AUTHOR_FULL"
echo "Author name:   $AUTHOR_NAME"
echo "Author email:  $AUTHOR_EMAIL"
echo "Commit ID:     $COMMIT_ID"
echo "-------------------------------------"

COMMIT_FILE=$(mktemp --suffix=-cdn-commit)
{
  echo "$AUTHOR_FULL updated altinn-studio to latest version"
  echo "based on commit https://github.com/Altinn/altinn-studio/commit/$COMMIT_ID"
  git log -1 | grep -Ev "commit|Author|Date"
} >> "$COMMIT_FILE"

echo "CDN commit message:"
echo
cat "$COMMIT_FILE"
echo "-------------------------------------"
echo "Files to be copied:"
echo
ls -1 $SOURCE/*
echo "-------------------------------------"
echo "Log:"
echo

# Needed in order for git commands to work
cd "$TARGET"

echo " * Copying to latest"
test -e "$TARGET/latest" && git rm -r "$TARGET/latest"
mkdir -p "$TARGET/latest"
cp -fr $SOURCE/* "$TARGET/latest/"

# echo " * Updating index.json"
# ls -1 | \
#   grep --perl-regexp "$VERSION_REGEX" | \
#   sort --version-sort | \
#   jq --raw-input --slurp 'split("\n") | map(select(. != ""))' > index.json

cd ../..

echo " * Staged for commit:"
git add .
git status --short

if [[ "$COMMIT" == "yes" ]]; then
  echo " * Committing changes"
  git -c user.email="$AUTHOR_EMAIL" -c user.name="$AUTHOR_NAME" commit -F "$COMMIT_FILE"
else
    echo " * Skipping commit (toggle with --commit)"
fi

echo "-------------------------------------"
# if [[ -z "$AZURE_STORAGE_ACCOUNT_NAME" ]]; then
#   echo "Skipping publish to azure cdn. As --azure-sa-name flag not defined"
# else
#   if [[ -d "$AZURE_STORAGE_ACCOUNT_NAME" ]]; then
#     echo
#     echo "azure-sa-name seems to be a local directory. Simulating azcopy sync with rsync to folder"
#     echo
#     toolkits_rsync_opts=( -am --include='*/' --include="${APP_FULL}/*" --include="index.json" )
#     if [[ "$PRE_RELEASE" == "no" ]]; then
#       toolkits_rsync_opts+=( --include="${APP_MAJOR}/*" --include="${APP_MAJOR_MINOR}/*" )
#     fi
#     toolkits_rsync_opts+=( --exclude='*' )
#     schemas_rsync_opts=( -am --include='*/' --include="component/*" --include="layout/*"  --exclude='*' )
#     set -x
#     rsync "${toolkits_rsync_opts[@]}" $TARGET $AZURE_STORAGE_ACCOUNT_NAME
#     if [[ "$PRE_RELEASE" == "no" ]]; then
#       rsync "${schemas_rsync_opts[@]}" $TARGET_SCHEMAS/json $AZURE_STORAGE_ACCOUNT_NAME -v
#     fi
#     set +x
#     echo "-------------------------------------"
#   else
#     AZCOPY_INCLUDE_REGEX="^index\.json$|^$APP_FULL/*"
#     if [[ "$PRE_RELEASE" == "no" ]]; then
#       AZCOPY_INCLUDE_REGEX+="|^$APP_MAJOR/.*|^$APP_MAJOR_MINOR/.*"
#     fi
#     AZCOPY_TOOLKITS_OPTS=( --include-regex="${AZCOPY_INCLUDE_REGEX}" )
#     AZCOPY_SCHEMAS_OPTS=( --include-regex="^component/.*|^layout/.*" )
#     AZCOPY_ADDITIONAL_OPTS=( --put-md5 --compare-hash=MD5 --delete-destination=true )
#     if [[ "$SYNC_AZURE_CDN" == "no" ]]; then
#       echo "Publish to azure cdn will run with --dry-run (toggle with --azure-sync-cdn). No files will actually be synced"
#       AZCOPY_ADDITIONAL_OPTS+=( --dry-run )
#     else
#       echo "Publishing files to azure cdn"
#     fi
#     azcopy sync "$TARGET" "$AZURE_TARGET_URI/toolkits${AZURE_STORAGE_ACCOUNT_TOKEN}" "${AZCOPY_TOOLKITS_OPTS[@]}" "${AZCOPY_ADDITIONAL_OPTS[@]}"
#     if [[ "$PRE_RELEASE" == "no" ]]; then
#       azcopy sync "${TARGET_SCHEMAS}/json" "$AZURE_TARGET_URI/${AZURE_STORAGE_ACCOUNT_TOKEN}" "${AZCOPY_SCHEMAS_OPTS[@]}" "${AZCOPY_ADDITIONAL_OPTS[@]}"
#     fi
#     echo "-------------------------------------"
#   fi
# fi
