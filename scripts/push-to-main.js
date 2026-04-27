import { execSync } from 'child_process';

try {
  console.log('[v0] Starting git operations...');
  
  // Check git status
  const status = execSync('git status', { cwd: process.cwd(), encoding: 'utf-8' });
  console.log('[v0] Git status:', status);
  
  // Add changes
  console.log('[v0] Adding changes...');
  execSync('git add .', { cwd: process.cwd() });
  
  // Commit with descriptive message
  console.log('[v0] Committing changes...');
  execSync('git commit -m "chore: add vercel.json configuration for SPA deployment\n\n- Configure Vercel buildCommand and outputDirectory\n- Set up rewrites for client-side routing\n- Enable proper SPA handling with index.html fallback"', { cwd: process.cwd() });
  
  // Push to main
  console.log('[v0] Pushing to main branch...');
  execSync('git push origin main', { cwd: process.cwd() });
  
  console.log('[v0] ✓ Successfully pushed to main!');
} catch (error) {
  console.error('[v0] Error:', error.message);
  process.exit(1);
}
