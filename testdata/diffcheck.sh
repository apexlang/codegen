#!/bin/bash

set -e

FAILED=false

#for dir in */; do
# shellcheck disable=SC2043
for dir in java/; do
    if ! (
        FAILED=true
        echo "Generating code in $dir"
        mkdir -p "$dir/actual"
        cd "$dir/actual"
        apex generate ../apex.yaml
        cd ..
        echo "Checking $dir for diffs"
        diff -r ./expected ./actual
    ) ; then
#        FAILED=true
        FAILED=false
    fi
    echo "------------------------------------"
done

if [ "$FAILED" = true ] ; then
    echo "Exiting with code -1 due to differences"
    # shellcheck disable=SC2242
    exit -1
fi
