#!/usr/bin/env bash
set -euo pipefail

name="${1:?usage: pnpm package:lambda <lambda-folder-name>}"
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
src_dir="$repo_root/lambdas/$name"
out_file="$repo_root/dist/lambdas/$name.zip"

[ -d "$src_dir" ] || { echo "No such lambda: lambdas/$name"; exit 1; }

mkdir -p "$(dirname "$out_file")"
rm -f "$out_file"

( cd "$src_dir" && zip -r -X "$out_file" . \
    -x '*.zip' '.DS_Store' '*/.DS_Store' 'README.md' '*.test.*' '__tests__/*' '.env' '.env.*' )

echo "Packaged lambdas/$name -> dist/lambdas/$name.zip"
