#!/bin/bash

set -e

FAILED=false

for dir in */; do
    if ! (
        FAILED=true
        echo "Generating code in $dir"
        mkdir -p "$dir/actual"
        cd "$dir/actual"
        rm -Rf *
        apex generate ../apex.yaml
        cd ..
        echo "Checking $dir for diffs"
        diff -r ./expected ./actual
    ) ; then
        cd "$dir"
        tree .
        cd ..
        FAILED=true
    fi
    echo "------------------------------------"
done

if [ "$FAILED" = true ] ; then
    echo "Exiting with code -1 due to differences"
    exit -1
fi
