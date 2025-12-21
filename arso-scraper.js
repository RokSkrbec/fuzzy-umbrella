#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const { JSDOM } = require('jsdom');

// ARSO water data URL (updated to use gov.si domain)
const ARSO_URL = 'https://www.arso.gov.si/vode/podatki/stanje_voda_samodejne.html';

// Load geocoded coordinates
function loadGeocodedCoordinates() {
  try {
    const data = JSON.parse(fs.readFileSync('geocoded-coordinates.json', 'utf8'));
    return data.coordinates;
  } catch (error) {
    console.warn('Warning: Could not load geocoded coordinates, using fallback coordinates');
    // Return empty object - stations without coordinates will be skipped
    return {};
  }
}

// Station coordinates - loaded from geocoded data
const stationCoordinates = loadGeocodedCoordinates();

/**
 * Fetch HTML content from ARSO website
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      // Handle SSL certificate issues
      rejectUnauthorized: false
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });

    }).on('error', (err) => {
      console.error('HTTPS request error:', err.message);
      reject(err);
    });
  });
}

/**
 * Parse numeric value from string, handling Slovenian decimal separator
 */
function parseNumericValue(value) {
  if (!value || value.trim() === '' || value.trim() === ' ') {
    return null;
  }

  // Replace comma with dot for decimal separator
  const cleaned = value.trim().replace(',', '.');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse the ARSO HTML and extract water station data
 */
function parseARSOData(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const stations = [];
  const processedStations = new Set(); // Track processed station names to prevent duplicates

  // Find the main data table - look for the one with the right structure
  const tables = document.querySelectorAll('table');
  let dataTable = null;

  // Look for table with water level data and proper structure
  for (const table of tables) {
    const rows = table.querySelectorAll('tr');
    if (rows.length > 10) { // Should have many data rows
      // Check if this has the right header structure
      const headerCells = table.querySelectorAll('tr:nth-child(1) td, tr:nth-child(1) th');
      const headerText = Array.from(headerCells).map(cell => cell.textContent).join(' ');
      if (headerText.includes('Vodostaj') && headerText.includes('Temperatura')) {
        // Also check a sample data row
        const sampleRow = table.querySelector('tr:nth-child(3)'); // Skip header rows
        const sampleCells = sampleRow?.querySelectorAll('td');
        if (sampleCells && sampleCells.length >= 6) {
          dataTable = table;
          break;
        }
      }
    }
  }

  if (!dataTable) {
    console.log('Could not find data table. Available tables:');
    tables.forEach((table, i) => {
      const headerText = table.querySelector('tr')?.textContent || '';
      console.log(`Table ${i}: ${headerText.slice(0, 100)}...`);
    });
    throw new Error('Could not find the main data table');
  }

  const rows = dataTable.querySelectorAll('tr');
  console.log(`Found ${rows.length} rows in data table`);

  // Skip header rows - use TABLE 2 which has the cleanest structure
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll('td');

    if (cells.length >= 6) {
      const riverName = cells[0]?.textContent?.trim();
      const stationName = cells[1]?.textContent?.trim();
      const waterLevel = cells[2]?.textContent?.trim();
      const flow = cells[3]?.textContent?.trim();
      // Cell 4 is often empty (trend info might be here sometimes)
      const temperature = cells[5]?.textContent?.trim();

      // Look for trend indicator (usually in cell 4 or in the text)
      let trend = null;
      const trendText = cells[4]?.textContent?.trim();
      if (trendText && (trendText.includes('narašča') || trendText.includes('pada'))) {
        trend = trendText;
      }

      // Check if station has coordinates and hasn't been processed yet
      const coords = stationCoordinates[stationName];

      if (stationName && coords) {
        // Check for duplicates
        if (processedStations.has(stationName)) {
          console.log(`⚠️  Skipping duplicate station: ${stationName}`);
          continue;
        }

        // Add to processed set
        processedStations.add(stationName);

        const station = {
          name: stationName,
          river: riverName || null,
          coordinates: coords,
          data: {
            waterLevel: parseNumericValue(waterLevel),
            flow: parseNumericValue(flow),
            temperature: parseNumericValue(temperature),
            trend: trend,
            timestamp: new Date().toISOString()
          }
        };

        stations.push(station);
        console.log(`✅ Processed: ${stationName} (${riverName}) - Temp: ${station.data.temperature}°C, Level: ${station.data.waterLevel}cm, Flow: ${station.data.flow}m³/s`);
      } else if (stationName) {
        console.log(`❌ Skipping station without coordinates: ${stationName}`);
      }
    }
  }

  return stations;
}

/**
 * Save data to JSON file with detailed timestamp
 */
function saveToJSON(data, filename) {
  const now = new Date();
  const jsonData = {
    lastUpdated: now.toISOString(),
    scrapeTimestamp: now.toISOString(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
    date: now.toISOString().split('T')[0],
    time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
    stationCount: data.length,
    stations: data
  };

  fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`📄 Data saved to ${filename} (${jsonData.stationCount} stations, time: ${jsonData.time})`);
}

/**
 * Main scraping function
 */
async function scrapeARSOData() {
  try {
    console.log('Fetching data from ARSO website...');
    const html = await fetchHTML(ARSO_URL);

    console.log(`Received ${html.length} characters of HTML`);

    console.log('Parsing water station data...');
    const stations = parseARSOData(html);

    console.log(`Successfully parsed ${stations.length} stations`);

    // Save only to arso-latest.json (no more timestamped files)
    saveToJSON(stations, 'arso-latest.json');

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    console.log(`\n⏰ Scraping completed at ${now.toLocaleString('sl-SI')} (${timeStr})`);
    console.log(`Found stations with temperature data: ${stations.filter(s => s.data.temperature !== null).length}`);
    console.log(`Found stations with water level data: ${stations.filter(s => s.data.waterLevel !== null).length}`);
    console.log(`Found stations with flow data: ${stations.filter(s => s.data.flow !== null).length}`);

    return stations;

  } catch (error) {
    console.error('Error scraping ARSO data:', error.message);
    process.exit(1);
  }
}

// Run the scraper if this file is executed directly
if (require.main === module) {
  scrapeARSOData();
}

module.exports = { scrapeARSOData, parseARSOData, stationCoordinates };
