#!/bin/bash

# ARSO Water Monitor - Deployment Script
# This script prepares the project for deployment

echo "🌊 ARSO Water Monitor - Deployment Preparation"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Run this script from the project root directory."
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run the scraper to get fresh data
echo "🔄 Fetching fresh ARSO data..."
node arso-scraper.js

# Create optimized build (optional - can be enhanced)
echo "🏗️ Preparing build files..."

# Check if data files exist
if [ ! -f "arso-latest.json" ]; then
    echo "❌ Error: arso-latest.json not found. Data scraping may have failed."
    exit 1
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "🚀 Next Steps:"
echo "1. Commit and push your changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Deploy ARSO Water Monitor'"
echo "   git push origin main"
echo ""
echo "2. Enable GitHub Pages in repository settings"
echo "3. Your app will be live at: https://yourusername.github.io/repository-name"
echo ""
echo "📱 Alternative Deployment Options:"
echo "   • Vercel: vercel --prod"
echo "   • Netlify: netlify deploy --prod --dir ."
echo "   • Surge: npx surge . your-domain.surge.sh"

# Show file sizes for optimization reference
echo ""
echo "📊 File Sizes:"
ls -lh *.html *.js *.json | awk '{print $9 "\t" $5}'
