# Detailed Timestamp ARSO Data Scraping Setup

## Overview
The scraper has been updated to include detailed timestamps (hours, minutes, seconds) in standard HH:MM:SS format in both filenames and JSON data structure.

## Detailed Timestamp Features

### Filename Format
- **Pattern:** `arso-data-YYYY-MM-DD-HH:MM:SS.json`
- **Example:** `arso-data-2025-12-19-15:10:04.json`

### JSON Data Structure
```json
{
  "lastUpdated": "2025-12-19T14:10:04.572Z",
  "scrapeTimestamp": "2025-12-19T14:10:04.572Z",
  "hour": 15,
  "minute": 10,
  "second": 4,
  "date": "2025-12-19",
  "time": "15:10:04",
  "stationCount": 173,
  "stations": [...]
}
```

## Manual Execution
```bash
# Run the scraper manually
npm run scrape:hourly

# Or directly
node arso-scraper.js
```

## Setting Up Hourly Cron Job

### 1. Edit crontab
```bash
crontab -e
```

### 2. Add hourly job (runs at the start of every hour)
```bash
# ARSO Water Data Scraper - runs every hour at minute 0
0 * * * * cd /Users/rokskrbec/development/test_water_temp && /usr/local/bin/node arso-scraper.js >> /Users/rokskrbec/development/test_water_temp/scraper.log 2>&1
```

### 3. Alternative: Run every hour at minute 5 (to avoid peak server load)
```bash
# ARSO Water Data Scraper - runs every hour at minute 5
5 * * * * cd /Users/rokskrbec/development/test_water_temp && /usr/local/bin/node arso-scraper.js >> /Users/rokskrbec/development/test_water_temp/scraper.log 2>&1
```

### 4. Check Node.js path
```bash
# Find your Node.js path
which node
# Use the full path in crontab
```

## File Management

### Automatic Cleanup (Optional)
Add this to clean up files older than 7 days:
```bash
# Clean up old detailed timestamp files (run daily at 3 AM)
0 3 * * * find /Users/rokskrbec/development/test_water_temp -name "arso-data-*.json" -mtime +7 -delete
```

### Monitor Log File
```bash
# Check scraper logs
tail -f /Users/rokskrbec/development/test_water_temp/scraper.log
```

## Data Structure Benefits

1. **Precise Tracking:** Each execution creates a unique file with exact timestamp
2. **Easy Filtering:** Hour, minute, and second fields for precise data access
3. **Debugging:** Detailed timestamps help track data freshness and execution timing
4. **Analytics:** Precise timing data perfect for detailed trend analysis
5. **No Collisions:** Unique filenames even for multiple runs per hour

## Example Detailed Timestamp Files
```
arso-data-2025-12-19-00:00:15.json  # Midnight + 15 seconds
arso-data-2025-12-19-01:30:42.json  # 1:30 AM + 42 seconds
arso-data-2025-12-19-15:10:04.json  # 3:10 PM + 4 seconds
arso-data-2025-12-19-23:59:59.json  # 11:59 PM + 59 seconds
```

## Notes
- The `arso-latest.json` file is always updated with the most recent data
- Each hourly file is preserved for historical analysis
- The scraper includes duplicate prevention and error handling
- All timestamps are in ISO format with timezone information
