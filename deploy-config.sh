#!/bin/bash

cd /vercel/share/v0-project

# Configure git
git config user.email "v0[bot]@users.noreply.github.com"
git config user.name "v0[bot]"

# Commit the vercel.json configuration
git add vercel.json

git commit -m "Configure Vercel deployment settings

- Add vercel.json with build and output directory configuration
- Set up rewrites for SPA routing to index.html
- Configure environment variable support for production deployment"

# Push to main branch
git push origin main

echo "Successfully committed and pushed to main branch!"
