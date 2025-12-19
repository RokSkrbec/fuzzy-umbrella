# ⏰ 30-Minute Auto-Update Setup Guide

This guide shows you how to automatically update your ARSO Water Monitor data every 30 minutes across different hosting platforms.

## 📋 Update Methods Overview

| Method | Platform | Difficulty | Cost | Reliability |
|--------|----------|------------|------|------------|
| GitHub Actions | GitHub Pages | Easy | Free | High |
| Vercel Cron | Vercel | Medium | Free* | High |
| Server Cron | VPS/Dedicated | Hard | Paid | Very High |
| Client-Side | Any | Easy | Free | Low |

*Free tier has limitations

## 🚀 Method 1: GitHub Actions (Recommended)

**Best for**: GitHub Pages hosting, automatic deployment

### Setup Steps:

1. **Files are already configured** - The workflow in `.github/workflows/deploy.yml` runs every 30 minutes:
   ```yaml
   schedule:
     - cron: '0,30 * * * *'  # Runs at :00 and :30 every hour
   ```

2. **Enable GitHub Pages**:
   - Repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main`
   - ✅ Done!

3. **The workflow will**:
   - Run every 30 minutes automatically
   - Fetch fresh ARSO data
   - Commit new data files
   - Deploy updated site

### Monitoring:
- Check Actions tab in GitHub repository
- View deployment logs
- Get email notifications on failures

---

## ⚡ Method 2: Vercel Serverless Cron

**Best for**: Vercel hosting with Hobby/Pro plan

### Setup Steps:

1. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Files already configured**:
   - `vercel.json` - Cron configuration
   - `api/update-data.js` - Serverless function

3. **Upgrade to Pro plan** (required for cron):
   - Hobby plan: No cron support
   - Pro plan: $20/month, includes cron

4. **Verify setup**:
   - Check Vercel dashboard → Functions
   - Monitor cron execution logs

---

## 🖥️ Method 3: Server Cron Job (Most Reliable)

**Best for**: VPS, dedicated servers, production environments

### Setup Steps:

1. **Edit crontab**:
   ```bash
   # Edit your cron jobs
   crontab -e
   
   # Add this line:
   0,30 * * * * /path/to/your/arso-water-monitor/update-data.sh
   ```

2. **Configure the script**:
   ```bash
   # Edit update-data.sh
   nano update-data.sh
   
   # Update PROJECT_DIR path:
   PROJECT_DIR="/home/user/arso-water-monitor"
   ```

3. **Make executable**:
   ```bash
   chmod +x update-data.sh
   ```

4. **Test manually**:
   ```bash
   ./update-data.sh
   ```

### Cron Schedule Examples:
```bash
# Every 30 minutes
0,30 * * * * /path/to/update-data.sh

# Every 15 minutes (more frequent)
*/15 * * * * /path/to/update-data.sh

# Every hour (less frequent)
0 * * * * /path/to/update-data.sh

# Only during business hours (9 AM - 6 PM)
0,30 9-18 * * * /path/to/update-data.sh
```

---

## 🌐 Method 4: Client-Side Updates (Fallback)

**Best for**: Static hosting without server-side capabilities

The app already includes intelligent client-side updates:

### Current Configuration:
- **Full refresh**: Every 2 minutes
- **Timestamp check**: Every 30 seconds
- **Smart detection**: Only updates when new data is available

### How it works:
```javascript
// Checks for new data every 30 seconds
// Only triggers refresh if timestamp changed
setInterval(checkForUpdates, 30 * 1000);
```

---

## ⚙️ Configuration Options

### Customizing Update Frequency:

#### GitHub Actions:
```yaml
# Every 15 minutes
schedule:
  - cron: '*/15 * * * *'

# Every hour
schedule:
  - cron: '0 * * * *'

# Only weekdays, business hours
schedule:
  - cron: '0,30 9-18 * * 1-5'
```

#### Cron Job:
```bash
# Every 20 minutes
*/20 * * * * /path/to/update-data.sh

# Every 10 minutes (very frequent)
*/10 * * * * /path/to/update-data.sh
```

#### Client-Side:
```javascript
// Check every 1 minute instead of 2
setInterval(refreshData, 1 * 60 * 1000);

// Check timestamp every 15 seconds
setInterval(checkTimestamp, 15 * 1000);
```

---

## 📊 Monitoring & Troubleshooting

### Check Update Status:

1. **GitHub Actions**:
   - Repository → Actions tab
   - View workflow runs and logs

2. **Vercel**:
   - Dashboard → Functions → View logs
   - Real-time function monitoring

3. **Server Cron**:
   ```bash
   # Check cron logs
   tail -f /var/log/cron.log
   
   # Check update logs
   tail -f logs/update.log
   
   # Test cron job manually
   ./update-data.sh
   ```

4. **Client-Side**:
   - Browser DevTools → Console
   - Look for refresh messages

### Common Issues:

#### "Cron not running":
```bash
# Check if cron service is running
systemctl status cron

# Restart cron service
sudo systemctl restart cron

# Check cron jobs
crontab -l
```

#### "Permission denied":
```bash
# Make script executable
chmod +x update-data.sh

# Check file permissions
ls -la update-data.sh
```

#### "Node.js not found":
```bash
# Find Node.js path
which node

# Update script with correct path
NODE_PATH="/usr/bin/node"
```

---

## 🎯 Recommended Setup by Hosting Type

### GitHub Pages:
✅ **Use GitHub Actions** (Method 1)
- Free, automatic, reliable
- No additional setup needed

### Vercel:
🔄 **Depends on plan**:
- **Free plan**: Use client-side updates (Method 4)
- **Pro plan**: Use Vercel Cron (Method 2)

### Netlify:
✅ **Use GitHub Actions** + Netlify
- Deploy from GitHub with Actions

### VPS/Dedicated Server:
✅ **Use Server Cron** (Method 3)
- Most reliable for production
- Full control over timing

### Static Hosting (Surge, etc.):
✅ **Use Client-Side** (Method 4)
- Already configured and working

---

## 📈 Performance Tips

### Optimize Update Frequency:
- **High traffic**: Every 15 minutes
- **Normal usage**: Every 30 minutes
- **Low traffic**: Every hour

### Data Management:
```bash
# Keep only last 48 files (24 hours of 30-min updates)
find . -name "arso-data-*.json" | sort | head -n -48 | xargs rm -f
```

### Client-Side Efficiency:
- Checks timestamps before full reload
- Uses minimal bandwidth
- Graceful error handling

---

## 🔒 Security Considerations

### GitHub Secrets:
If you need API keys:
```bash
# Add to repository secrets
ARSO_API_KEY=your_secret_key
```

### Server Security:
```bash
# Restrict script permissions
chmod 750 update-data.sh

# Run as specific user
# In crontab: 0,30 * * * * /home/arso/update-data.sh
```

---

## 📞 Support

### Need Help?
- 📖 Check the main README.md
- 🐛 Create GitHub issue
- 💬 GitHub Discussions
- 📧 Direct contact

**Happy Auto-Updating! ⏰🌊**
