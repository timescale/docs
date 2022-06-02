#!/bin/bash

set -e

file="extracted_excerpts.md"

while read filename excerpt; do
    sed -i .bak "/excerpt/c\\
$excerpt
    " "$filename"
done <"$file"
