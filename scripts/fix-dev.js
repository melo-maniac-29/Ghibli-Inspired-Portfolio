/**
 * This script cleans the Next.js cache and reinstalls dependencies to fix common build issues
 */

const { execSync } = require('child_process');

// Print message
console.log('🔧 Fixing Next.js development environment...');

try {
  // Clear Next.js cache
  console.log('📂 Clearing Next.js cache...');
  execSync('rm -rf .next', { stdio: 'inherit' });
  
  // Reinstall dependencies
  console.log('📦 Reinstalling dependencies...');
  execSync('bun install', { stdio: 'inherit' });
  
  // Restart dev server with clean slate
  console.log('🚀 Starting development server with clean environment...');
  console.log('✅ If you still see errors, try the manual steps in the comments at the top of this file');
  execSync('bun dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error during fix process:', error.message);
  console.log('\nManual fix steps:');
  console.log('1. Delete the .next folder: rm -rf .next');
  console.log('2. Clear NPM cache: bun cache clean -g');
  console.log('3. Reinstall dependencies: bun install');
  console.log('4. Start dev server: bun dev');
}
