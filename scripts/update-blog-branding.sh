#!/bin/bash

# Script to update all blog posts with DvTools branding and professional Indian English

echo "Starting blog post updates..."

# Find all MDX files in the blog directory
find app/blog -name "page.mdx" | while read -r file; do
    echo "Processing: $file"
    
    # Create a backup
    cp "$file" "${file}.backup"
    
    # Replace Malti Tool Platform with DvTools
    sed -i '' 's/Malti Tool Platform/DvTools/g' "$file"
    sed -i '' 's/malti-tool-platform/dvtools/g' "$file"
    sed -i '' 's/maltitoolplatform\.com/dvtools\.in/g' "$file"
    
    # Remove metadata that looks unprofessional when displayed
    # This is a placeholder - we'll do this in a more sophisticated way
    
done

echo "Blog post updates completed!"
echo "Backups created with .backup extension"
