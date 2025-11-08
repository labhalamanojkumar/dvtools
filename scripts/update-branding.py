#!/usr/bin/env python3
import os
import glob

# Find all blog MDX files
blog_files = glob.glob('app/blog/**/page.mdx', recursive=True)

print(f"Found {len(blog_files)} blog files")

updated = 0
errors = 0

for filepath in blog_files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Update branding
        content = content.replace('Malti Tool Platform', 'DvTools')
        content = content.replace('maltitoolplatform.com', 'dvtools.in')
        
        # Only write if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            updated += 1
            print(f"✓ Updated: {filepath}")
    
    except Exception as e:
        errors += 1
        print(f"✗ Error with {filepath}: {e}")

print(f"\nComplete!")
print(f"Updated: {updated} files")
print(f"Errors: {errors} files")
print(f"Total: {len(blog_files)} files")
