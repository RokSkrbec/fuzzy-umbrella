# ARSO Water Data Scraper

A standalone Node.js web scraper that fetches real-time water temperature, level, and flow data from the ARSO (Slovenian Environment Agency) website and saves it to JSON format.

## Features

- Scrapes data from https://www.arso.gov.si/vode/podatki/stanje_voda_samodejne.html
- Extracts water temperature, water level, flow rate, and trend data
- Maps station names to geographic coordinates
- Saves data in structured JSON format
- Handles Slovenian decimal separators and missing data gracefully
- Successfully processes ~193 monitoring stations across Slovenia

## Installation

1. Make sure you have Node.js installed
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Run the scraper manually:
```bash
npm run scrape
```
or
```bash
node arso-scraper.js
```

### Run with automation script:
```bash
./run-scraper.sh
```

### Output

The scraper creates two files:
- `arso-data-YYYY-MM-DD.json` - Dated backup
- `arso-latest.json` - Latest data (overwrites previous)

### Sample Output Statistics
- **193 total stations processed**
- **162 stations with temperature data**
- **166 stations with water level data** 
- **149 stations with flow data**

### JSON Structure

```json
{
  "lastUpdated": "2025-12-19T12:55:50.425Z",
  "stationCount": 193,
  "stations": [
    {
      "name": "Gornja Radgona",
      "river": "Mura", 
      "coordinates": [46.6761, 15.9931],
      "data": {
        "waterLevel": 74,
        "flow": 83.6,
        "temperature": 5.4,
        "trend": null,
        "timestamp": "2025-12-19T12:55:50.162Z"
      }
    }
  ]
}
```

## Data Fields

- `waterLevel` - Water level in centimeters (cm)
- `flow` - Water flow rate in cubic meters per second (m³/s) 
- `temperature` - Water temperature in Celsius (°C)
- `trend` - Water level trend ("narašča" = rising, "pada" = falling)
- `coordinates` - [latitude, longitude] for mapping

## Integration with Map Application

To use the scraped data in your map application, modify the `fetchARSOData()` function in `app.js`:

```javascript
async function fetchARSOData() {
  try {
    // Load scraped data from JSON file
    const response = await fetch('./arso-latest.json');
    const jsonData = await response.json();
    
    return jsonData.stations.map(station => ({
      name: station.name,
      coords: station.coordinates,
      data: {
        river: station.river,
        temperature: station.data.temperature,
        waterLevel: station.data.waterLevel,
        flow: station.data.flow,
        trend: station.data.trend,
        timestamp: station.data.timestamp
      }
    }));
  } catch (error) {
    console.error('Error loading ARSO data:', error);
    return getRealARSOData(); // fallback to static data
  }
}
```

## Automation

### Using cron (Linux/macOS):
```bash
# Update every hour
0 * * * * /path/to/your/project/run-scraper.sh

# Update every 30 minutes
*/30 * * * * /path/to/your/project/run-scraper.sh
```

### Manual periodic updates:
```bash
# Run scraper every hour in background
while true; do
  ./run-scraper.sh
  sleep 3600  # Wait 1 hour
done
```

## Files

- `arso-scraper.js` - Main scraper script
- `run-scraper.sh` - Automation wrapper with logging
- `package.json` - Node.js dependencies
- `arso-latest.json` - Latest scraped data
- `arso-data-YYYY-MM-DD.json` - Daily backups
- `logs/scraper-YYYYMMDD.log` - Daily log files

## Technical Notes

- Uses JSDOM for HTML parsing
- Handles SSL certificate variations for arso.gov.si
- Parses Slovenian decimal format (comma to dot conversion)
- Includes coordinates for 200+ known ARSO monitoring stations
- Gracefully handles missing or malformed data
- Automatic cleanup of old logs (7 days) and data files (30 days)

## River Basins Covered

- **Mura basin** - 11 stations
- **Drava basin** - 21 stations  
- **Sava basin** - 50+ stations
- **Soča basin** - 15 stations
- **Krka basin** - 20 stations
- **Savinja basin** - 25 stations
- **Kolpa basin** - 7 stations
- **Ljubljanica basin** - 25 stations
- **Coastal rivers** - 15 stations
- **Adriatic Sea** - 4 stations
# Last updated: Fri Dec 19 22:43:32 CET 2025
