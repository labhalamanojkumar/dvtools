const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all MDX blog files
const blogFiles = glob.sync('app/blog/**/page.mdx');

console.log(`Found ${blogFiles.length} blog posts to update`);

blogFiles.forEach((filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace branding
    content = content.replace(/Malti Tool Platform/g, 'DvTools');
    content = content.replace(/malti-tool-platform/g, 'dvtools');
    content = content.replace(/maltitoolplatform\.com/g, 'dvtools.in');
    
    // Update author names to DvTools Team
    content = content.replace(/name: "Malti Tool Platform Team"/g, 'name: "DvTools Team"');
    content = content.replace(/url: "https:\/\/maltitoolplatform\.com"/g, 'url: "https://dvtools.in"');
    
    // Update structured data URLs
    content = content.replace(/"name": "Malti Tool Platform"/g, '"name": "DvTools"');
    content = content.replace(/"url": "https:\/\/maltitoolplatform\.com/g, '"url": "https://dvtools.in');
    content = content.replace(/@id": "https:\/\/maltitoolplatform\.com/g, '@id": "https://dvtools.in');
    
    // Write back the updated content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log('\n🎉 All blog posts updated successfully!');
