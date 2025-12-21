#!/bin/bash

# ARSO Data Update Script - Runs every 30 minutes
# Add to crontab with: 0,30 * * * * /path/to/update-data.sh

# Configuration
PROJECT_DIR="/path/to/your/arso-water-monitor"
LOG_FILE="$PROJECT_DIR/logs/update.log"
NODE_PATH="/usr/bin/node"

# Create log directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Change to project directory
cd "$PROJECT_DIR" || {
    log "ERROR: Could not change to project directory: $PROJECT_DIR"
    exit 1
}

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    log "ERROR: Node.js not found at $NODE_PATH"
    exit 1
fi

# Run the scraper
log "Starting ARSO data update..."

if "$NODE_PATH" arso-scraper.js >> "$LOG_FILE" 2>&1; then
    log "SUCCESS: ARSO data updated successfully"
    
    # Optional: Commit to git if this is a git repository
    if [ -d .git ]; then
        git add arso-latest.json data-index.json 2>/dev/null
        git commit -m "Auto-update ARSO data - $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null
        log "INFO: Changes committed to git"
    fi
    
else
    log "ERROR: ARSO data update failed"
    exit 1
fi

log "Update completed successfully"

log "Update cycle completed"
