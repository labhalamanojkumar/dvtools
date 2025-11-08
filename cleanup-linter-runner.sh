#!/bin/bash

# Remove linter-runner tool and all related files

echo "Removing linter-runner tool..."

# Remove page
rm -rf "app/tools/linter-runner"

# Remove API routes
rm -rf "app/api/tools/linter-runner"
rm -rf "app/api/tools/formatters"
rm -rf "app/api/tools/snippets"
rm -rf "app/api/tools/deps"
rm -rf "app/api/tools/tunnel"

# Remove client component
rm -f "components/tools/linter-runner-client.tsx"

# Remove data file
rm -f "data/snippets.json"

# Remove ambient type declaration
rm -f "types/ambient-eslint.d.ts"

echo "Cleanup complete!"
