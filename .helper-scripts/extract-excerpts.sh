#!/bin/bash

set -e

output="extracted_excerpts.md"

for file in ../api/*.md; do
    awk '/excerpt/ {print FILENAME " | " $0}' "$file" >> "_temp.md"
done

column -t -s "|" > "$output" < "_temp.md"
rm -f "_temp.md"
