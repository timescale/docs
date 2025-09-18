#!/bin/bash

set -e

python3 .helper-scripts/llms/generate_llms_full.py

if [ -f llms-full.txt ]; then
  git add llms-full.txt

  if ! git diff --cached --quiet; then
    git commit -m "chore: auto-update llms-full.txt"
    git push
  else
    echo "⚠️ No updates detected on file"
  fi
else
  echo "❌ llms-full.txt not found. Aborting push."
  exit 1
fi
