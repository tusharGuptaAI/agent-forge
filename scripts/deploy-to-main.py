#!/usr/bin/env python3
import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    # Stage the vercel.json file
    subprocess.run(['git', 'add', 'vercel.json'], check=True)
    print("[v0] Staged vercel.json")
    
    # Commit with descriptive message
    subprocess.run([
        'git', 'commit', '-m', 
        'Configure Vercel deployment settings\n\nAdd vercel.json to configure:\n- Build command for Vite project\n- Output directory (dist/)\n- SPA routing configuration for React Router\n- Automatic deployment from main branch'
    ], check=True)
    print("[v0] Committed changes")
    
    # Push to main branch
    subprocess.run(['git', 'push', 'origin', 'main'], check=True)
    print("[v0] Pushed to main branch successfully!")
    
except subprocess.CalledProcessError as e:
    print(f"[v0] Error: {e}")
    exit(1)
