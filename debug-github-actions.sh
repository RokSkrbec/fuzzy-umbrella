#!/bin/bash
# GitHub Actions Diagnostic Script

echo "🔍 GitHub Actions Diagnostics"
echo "=============================="
echo ""

echo "📋 Repository Information:"
echo "- Owner: RokSkrbec"
echo "- Repository: fuzzy-umbrella"
echo "- Branch: master"
echo ""

echo "📁 Required Files Check:"
files=(".github/workflows/deploy.yml" "arso-scraper.js" "package.json" "index.html")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done
echo ""

echo "🔧 Dependencies Check:"
if [ -f "package.json" ]; then
    echo "📦 package.json dependencies:"
    node -e "const pkg = require('./package.json'); console.log('Dependencies:', Object.keys(pkg.dependencies || {}).join(', ') || 'none'); console.log('DevDependencies:', Object.keys(pkg.devDependencies || {}).join(', ') || 'none');"
else
    echo "❌ package.json not found"
fi
echo ""

echo "🧪 Test Scraper:"
echo "Testing ARSO scraper..."
if node arso-scraper.js; then
    echo "✅ Scraper runs successfully"
    if [ -f "arso-latest.json" ]; then
        echo "✅ arso-latest.json created"
        echo "📊 Data size: $(wc -c < arso-latest.json) bytes"
    else
        echo "❌ arso-latest.json not created"
    fi
else
    echo "❌ Scraper failed"
fi
echo ""

echo "📊 GitHub Actions Status:"
echo "To check your workflow status:"
echo "1. Go to: https://github.com/RokSkrbec/fuzzy-umbrella/actions"
echo "2. Look for 'Deploy and Update ARSO Data' workflow"
echo "3. Check the latest run for detailed logs"
echo ""

echo "🚀 Manual Trigger:"
echo "To manually trigger the workflow:"
echo "1. Go to Actions tab in GitHub"
echo "2. Click 'Deploy and Update ARSO Data'"
echo "3. Click 'Run workflow' button"
echo "4. Select 'master' branch"
echo "5. Click 'Run workflow'"
echo ""

echo "🔧 Common Issues & Solutions:"
echo ""
echo "❓ Issue: 'No changes to commit'"
echo "✅ Solution: This is normal - means data hasn't changed"
echo ""
echo "❓ Issue: 'Permission denied'"
echo "✅ Solution: Check repository permissions in GitHub settings"
echo ""
echo "❓ Issue: 'npm install fails'"
echo "✅ Solution: Check package.json syntax"
echo ""
echo "❓ Issue: 'Node.js not found'"
echo "✅ Solution: Check Node.js version in workflow (currently 18)"
echo ""

echo "🎯 Next Steps:"
echo "1. Check GitHub Actions tab for detailed error logs"
echo "2. If workflow runs but Pages doesn't update, enable GitHub Pages:"
echo "   - Repository Settings → Pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: master"
echo "3. Wait up to 10 minutes for Pages deployment"
echo ""

echo "✨ Your site will be available at:"
echo "https://rokskrbec.github.io/fuzzy-umbrella/"
echo ""

echo "Done! 🎉"
