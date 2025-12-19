import { scrapeARSOData } from '../arso-scraper.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting ARSO data scrape...');
    const stations = await scrapeARSOData();

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      stationCount: stations.length,
      message: 'ARSO data updated successfully'
    });
  } catch (error) {
    console.error('Error updating ARSO data:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
