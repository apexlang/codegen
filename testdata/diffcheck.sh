#!/bin/bash

set -e

FAILED=false

for dir in */; do
    echo "Checking $dir for diffs"
    (
        cd "$dir"
        if ! diff -r ./expected ./actual ; then
            FAILED=true
        fi
    )
    echo "------------------------------------"
done

if [ FAILED ] ; then
    echo "Exiting with code -1 due to differences"
    exit -1
fi
