const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all blog MDX files
const blogFiles = glob.sync('app/blog/**/page.mdx');

console.log(`Found ${blogFiles.length} blog files to update`);

let updatedCount = 0;
let errorCount = 0;

blogFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Update "Malti Tool Platform" to "DvTools"
    if (content.includes('Malti Tool Platform')) {
      content = content.replace(/Malti Tool Platform/g, 'DvTools');
      modified = true;
    }

    // Update URLs from maltitoolplatform.com to dvtools.in
    if (content.includes('maltitoolplatform.com')) {
      content = content.replace(/maltitoolplatform\.com/g, 'dvtools.in');
      modified = true;
    }

    // Update author to "DvTools Team"
    if (content.includes('author: "Malti Tool Platform Team"')) {
      content = content.replace(/author: "Malti Tool Platform Team"/g, 'author: "DvTools Team"');
      modified = true;
    }

    // Save if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
      console.log(`✓ Updated: ${filePath}`);
    }
  } catch (error) {
    errorCount++;
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
});

console.log(`\nUpdate complete!`);
console.log(`Updated: ${updatedCount} files`);
console.log(`Errors: ${errorCount} files`);
console.log(`Total: ${blogFiles.length} files`);
