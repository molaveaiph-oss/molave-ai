#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only run on TypeScript files
if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

# Run type checking (project-wide, not per-file)
npx tsc --noEmit 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "TypeScript errors detected after editing $FILE_PATH" >&2
  exit 2
fi

exit 0
