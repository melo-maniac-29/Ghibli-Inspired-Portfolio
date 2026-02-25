const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to clean
const DIRECTORIES_TO_CLEAN = [
  '.next',
  'node_modules/.cache'
];

console.log('🧹 Cleaning Next.js cache...');

// Delete cache directories
DIRECTORIES_TO_CLEAN.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  
  try {
    if (fs.existsSync(dirPath)) {
      console.log(`Removing ${dir}...`);
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ ${dir} removed successfully`);
    } else {
      console.log(`⏭️ ${dir} doesn't exist, skipping`);
    }
  } catch (error) {
    console.error(`❌ Error removing ${dir}:`, error.message);
  }
});

// Run npm commands
try {
  console.log('🔄 Installing dependencies...');
  execSync('bun install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
}

console.log('🚀 Cache cleared successfully. You can now run:');
console.log('   bun dev');
