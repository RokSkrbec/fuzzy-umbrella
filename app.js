// Initialize the map centered on Slovenia
const map = L.map('map').setView([46.1512, 14.9955], 8);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

// River basin classification and colors
const riverBasins = {
  'Mura': { color: '#FF6B6B', name: 'Mura Basin' },
  'Drava': { color: '#4ECDC4', name: 'Drava Basin' },
  'Sava': { color: '#45B7D1', name: 'Sava Basin' },
  'Sava Dolinka': { color: '#45B7D1', name: 'Sava Basin' },
  'Sava Bohinjka': { color: '#45B7D1', name: 'Sava Basin' },
  'Soča': { color: '#96CEB4', name: 'Soča Basin' },
  'Krka': { color: '#FFEAA7', name: 'Krka Basin' },
  'Savinja': { color: '#DDA0DD', name: 'Savinja Basin' },
  'Kolpa': { color: '#F39C12', name: 'Kolpa Basin' },
  'Ljubljanica': { color: '#A8E6CF', name: 'Ljubljanica Basin' },
  'Gradaščica': { color: '#A8E6CF', name: 'Ljubljanica Basin' },
  'Kamniška Bistrica': { color: '#A8E6CF', name: 'Ljubljanica Basin' },
  'Vipava': { color: '#FFB6C1', name: 'Coastal Rivers' },
  'Rižana': { color: '#FFB6C1', name: 'Coastal Rivers' },
  'Reka': { color: '#FFB6C1', name: 'Coastal Rivers' },
  'Jadransko morje': { color: '#1E90FF', name: 'Adriatic Sea' },
  'default': { color: '#95A5A6', name: 'Other' }
};

// Function to determine basin from river name
function getRiverBasin(riverName) {
  if (!riverName) return riverBasins.default;

  // Direct matches
  if (riverBasins[riverName]) {
    return riverBasins[riverName];
  }

  // Partial matches for tributaries
  const river = riverName.toLowerCase();

  if (river.includes('mura') || river.includes('ledava') || river.includes('krka')) {
    return riverBasins['Mura'];
  }
  if (river.includes('drava') || river.includes('meža') || river.includes('mislinja') || river.includes('pesnica')) {
    return riverBasins['Drava'];
  }
  if (river.includes('sava') || river.includes('kokra') || river.includes('sora') || river.includes('bistrica') ||
    river.includes('kamniška') || river.includes('nevljica') || river.includes('pšata')) {
    return riverBasins['Sava'];
  }
  if (river.includes('soča') || river.includes('tolminka') || river.includes('idrijca') || river.includes('koritnica')) {
    return riverBasins['Soča'];
  }
  if (river.includes('krka') || river.includes('temenica') || river.includes('radulja')) {
    return riverBasins['Krka'];
  }
  if (river.includes('savinja') || river.includes('paka') || river.includes('voglajna') || river.includes('hudinja')) {
    return riverBasins['Savinja'];
  }
  if (river.includes('kolpa') || river.includes('lahinja')) {
    return riverBasins['Kolpa'];
  }
  if (river.includes('ljubljanica') || river.includes('gradaščica') || river.includes('iška') ||
    river.includes('ižica') || river.includes('borovniščica')) {
    return riverBasins['Ljubljanica'];
  }
  if (river.includes('vipava') || river.includes('hubelj') || river.includes('branica') ||
    river.includes('rižana') || river.includes('badaševica') || river.includes('drnica')) {
    return riverBasins['Vipava'];
  }
  if (river.includes('morje') || river.includes('jadransko')) {
    return riverBasins['Jadransko morje'];
  }

  return riverBasins.default;
}

// Function to create colored icon based on river basin
function createBasinIcon(riverName) {
  const basin = getRiverBasin(riverName);

  return L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
              <path d="M20 3C20 3 8 14 8 23C8 31.28 13.37 37 20 37C26.63 37 32 31.28 32 23C32 14 20 3 20 3Z" 
                    fill="${basin.color}" stroke="#2C3E50" stroke-width="2"/>
              <ellipse cx="20" cy="26" rx="5" ry="3" fill="#ffffff" opacity="0.4"/>
              <circle cx="20" cy="20" r="2" fill="#ffffff" opacity="0.9"/>
          </svg>
      `),
    iconSize: [40, 40],
    iconAnchor: [20, 37],
    popupAnchor: [0, -37]
  });
}

// Custom icon for water stations (mobile-friendly size)
const waterIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <path d="M20 3C20 3 8 14 8 23C8 31.28 13.37 37 20 37C26.63 37 32 31.28 32 23C32 14 20 3 20 3Z" 
                  fill="#3498db" stroke="#2980b9" stroke-width="2"/>
            <ellipse cx="20" cy="26" rx="5" ry="3" fill="#5dade2" opacity="0.6"/>
            <circle cx="20" cy="20" r="2" fill="#ffffff" opacity="0.8"/>
        </svg>
    `),
  iconSize: [40, 40],
  iconAnchor: [20, 37],
  popupAnchor: [0, -37]
});

// Load geocoded coordinates for fallback data (all stations)
function loadGeocodedCoordinates() {
  // This data matches the geocoded coordinates from geocode-coordinates.js
  return {
    'Ajdovščina': [45.8885557, 13.9048561],
    'Bača pri Modreju': [46.1450366, 13.7668255],
    'Bistra': [45.9478239, 14.333887],
    'Bišče': [46.1030124, 14.6129642],
    'Blate': [45.6984468, 14.7446514],
    'Bodešče': [46.3485633, 14.1360842],
    'Bohinjska Bistrica': [46.274266, 13.9591646],
    'Bokalce': [46.052233, 14.4461642],
    'Borl': [46.3747623, 16.002785],
    'Borovnica': [45.9194745, 14.3637139],
    'Branik': [45.8558901, 13.7842277],
    'Cankova': [46.7184838, 16.018699],
    'Celje': [46.2293889, 15.2616828],
    'Cerknica': [45.7936578, 14.361883],
    'Cerkno': [46.1279639, 13.9881168],
    'Debeli Rtič': [45.5905438, 13.7071679],
    'Dekani': [45.5483275, 13.8103444],
    'Dolenja Trebuša': [46.0932003, 13.8389364],
    'Dolenja vas': [45.8301813, 15.2199932],
    'Dolenje': [45.9246554, 13.7619066],
    'Dolenje Jezero': [45.776853, 14.3595602],
    'Dovže': [46.4604545, 15.1645773],
    'Dvor': [46.1053735, 14.4421322],
    'Fužina': [45.8623902, 14.8313965],
    'Gaberke': [46.3995693, 15.0798653],
    'Globočice pri Kostanjevici': [45.8402187, 15.428918],
    'Golo Brdo': [45.5656317, 13.8507722],
    'Gorenja Gomila': [45.8642048, 15.2868552],
    'Gorenje Jezero': [45.72963, 14.4114853],
    'Gornja Radgona': [46.6769963, 15.9913176],
    'Gočova': [46.5468615, 15.8681864],
    'Gradac': [45.6143709, 15.2447945],
    'Gradiček': [45.8884945, 14.7691995],
    'Hodoš': [46.8259935, 16.3261154],
    'Hrastnik': [46.1456196, 15.0817358],
    'Hrušica': [45.851087, 14.160466],
    'Ig': [45.9592409, 14.5276014],
    'Ilirska Bistrica': [45.5636618, 14.2453318],
    'Ivančna Gorica': [45.9389896, 14.8050459],
    'Iška vas': [45.9403653, 14.5111952],
    'Jelovec': [45.9892522, 15.2398499],
    'Jesenice': [46.4323705, 14.0623942],
    'Jesenice na Dolenjskem': [45.859364, 15.6890816],
    'Kal-Koritnica': [46.3367328, 13.5797432],
    'Kamin': [46.1632734, 14.5715685],
    'Kamnik': [46.2257358, 14.6118936],
    'Kamniška Bistrica': [46.2062811, 14.6036813],
    'Kobarid': [46.2455462, 13.57917],
    'Kobilje': [46.6849477, 16.3922898],
    'Kokra': [46.2659149, 14.3981134],
    'Kranj': [46.2432913, 14.3549353],
    'Kranjska Gora': [46.485132, 13.7843957],
    'Kraše': [46.2868189, 14.9068889],
    'Kršovec': [45.870468, 13.7244719],
    'Kubed': [45.521536, 13.8689334],
    'Lajb': [46.4152726, 14.2707291],
    'Laško': [46.1537984, 15.2354706],
    'Letuš': [46.3168558, 15.0210325],
    'Levec': [46.2407484, 15.217976],
    'Litija': [46.0575677, 14.8314192],
    'Livold': [45.612285, 14.8913762],
    'Log Čezsoški': [46.3109073, 13.489501],
    'Logatec': [45.9178067, 14.2233802],
    'Loka': [46.0535988, 15.2054717],
    'Loče': [46.2842778, 15.2589807],
    'Luče': [46.3553576, 14.7451413],
    'Makole': [46.3169639, 15.6668625],
    'Mali Otok': [45.7788068, 14.178927],
    'Malni': [45.817249, 14.4736468],
    'Martinja vas': [45.9346077, 14.9377108],
    'Martjanci': [46.684924, 16.1896103],
    'Medlog': [46.2388291, 15.2350734],
    'Medno': [46.1222004, 14.4390741],
    'Medvode': [46.1402285, 14.4130728],
    'Meniška vas': [45.7603297, 15.0382665],
    'Metlika': [45.6501029, 15.3174483],
    'Metni Vrh': [46.0440563, 15.3120748],
    'Miren': [45.894339, 13.6089235],
    'Mlačevo': [45.9403614, 14.6851212],
    'Mlino': [46.3577798, 14.0993695],
    'Moste': [46.0567523, 14.5467033],
    'Muta': [46.6093522, 15.1655099],
    'Nazarje': [46.3205865, 14.9487121],
    'Neblo': [46.0065915, 13.5000009],
    'Nevlje': [46.2315507, 14.6241335],
    'Nova Gorica': [45.9580549, 13.6474706],
    'Nuskova': [46.8100667, 16.0222857],
    'OB Piran': [45.4807793, 13.6204783],
    'Okroglo': [46.2584594, 14.3204865],
    'Otiški Vrh': [46.5747778, 15.0293451],
    'Ovsiše': [46.2872421, 14.2543486],
    'Petanjci': [46.651483, 16.0645597],
    'Petrina': [45.4650725, 14.8530801],
    'Pišine': [45.4653711, 13.6496741],
    'Podbočje': [45.8641442, 15.4666945],
    'Podbukovje': [45.8756838, 14.7815286],
    'Podhom': [46.3874907, 14.094283],
    'Podlehnik': [46.3351048, 15.8795227],
    'Podnanos': [45.7972852, 13.9724055],
    'Podrečje': [46.1440044, 14.6105031],
    'Podroteja': [45.9877629, 14.0324278],
    'Polana': [46.485683, 15.6091331],
    'Polže': [46.3194013, 15.2740194],
    'Postojnska jama': [45.7827107, 14.2038553],
    'Potoki': [46.4156749, 14.1199591],
    'Preska': [45.710302, 14.1595496],
    'Prestranek': [45.7285348, 14.1855972],
    'Prečna': [45.8124417, 15.122856],
    'Pri žagi': [46.5611421, 16.4482461],
    'Prigorica': [45.7132694, 14.7495234],
    'Pristava': [45.6307268, 14.0125465],
    'Ptuj': [46.4198096, 15.8717378],
    'Radovljica': [46.343509, 14.1720227],
    'Rakovec': [46.2071721, 15.4703647],
    'Ranca': [45.8045976, 14.3678301],
    'Razori': [46.0491144, 14.4376408],
    'Rašica': [46.1357719, 14.510431],
    'Rečica': [45.5728329, 14.2247924],
    'Rogatec': [46.2273681, 15.6995714],
    'Rožni Vrh': [46.0441159, 14.885687],
    'Ruta': [46.2239021, 13.7456167],
    'Sodevci': [45.4865882, 15.0797072],
    'Sodna vas': [46.1753183, 15.5967358],
    'Sodražica': [45.7619709, 14.6346442],
    'Solkan': [45.9678211, 13.6455643],
    'Solčava': [46.4195569, 14.6920242],
    'Soteska': [46.232711, 14.6504588],
    'Spodnja Bilpa': [45.511287, 14.9651118],
    'Spodnja Ložnica': [46.3821226, 15.5286299],
    'Središče': [46.3891124, 16.277099],
    'Stara Fužina': [46.2879339, 13.8936598],
    'Stopiče': [45.769873, 15.2091416],
    'Suha': [46.1647549, 14.3243793],
    'Sveti Duh': [46.2348418, 13.7197586],
    'Sveti Janez': [46.5797484, 15.1317132],
    'Tolmin': [46.1829212, 13.7333382],
    'Topole': [45.8196259, 14.2695484],
    'Trnovo': [46.041719, 14.5038838],
    'Trpčane': [45.5271926, 14.3173784],
    'Tržec': [46.3639839, 15.8774548],
    'Ukanc': [46.2792903, 13.8299754],
    'Velenje': [46.3592869, 15.1150301],
    'Veliko Širje': [46.1018608, 15.1942901],
    'Verd': [45.9479373, 14.3039444],
    'Vešter': [46.1751053, 14.2903138],
    'Videm': [46.3429502, 15.9322379],
    'Vipava': [45.8466286, 13.961222],
    'Vir': [46.1513496, 14.6055232],
    'Volčja Draga': [45.9058429, 13.6756428],
    'Vrhnika': [45.9663607, 14.2980772],
    'Vrhnika pri Ložu': [45.7048778, 14.5056502],
    'Zagaj': [45.9426539, 15.1027807],
    'Zagorje': [46.1205975, 14.9912364],
    'Zalošče': [45.8873596, 13.747656],
    'Zamušani': [46.4225055, 16.0322338],
    'Zarečica': [45.5586047, 14.2239795],
    'Zavrč': [46.3860221, 16.0459879],
    'Zminec': [46.1480273, 14.284405],
    'Zreče': [46.3716354, 15.3900185],
    'Čatež': [45.9705365, 14.9588038],
    'Čentiba': [46.5523727, 16.4826518],
    'Črna': [46.2618343, 14.6440056],
    'Črneče': [46.5879722, 14.9997275],
    'Črnolica': [46.2031869, 15.4189111],
    'Šalara': [45.5305301, 13.7398344],
    'Šentjakob': [46.0901236, 14.5806172],
    'Škocjan': [45.907782, 15.2906185],
    'Škofja vas': [46.2690814, 15.2907989],
    'Šoštanj': [46.3773929, 15.0459505],
    'Žaga': [46.05367, 15.5269523],
    'Žebnik': [46.1372185, 14.3520936],
    'Železniki': [46.2257913, 14.1693085],
    'Žiri': [46.0510703, 14.1106226]
  };
}

// Coordinates for ARSO water measurement stations based on geocoded data (all stations)
const stationCoordinates = loadGeocodedCoordinates();// Function to create popup content
function createPopupContent(station) {
  const content = document.createElement('div');
  content.className = 'popup-content';

  const basin = getRiverBasin(station.data.river);

  let html = `<h3>${station.name}</h3>`;

  if (station.data) {
    html += '<div class="data-section">';

    if (station.data.river) {
      html += `
        <div class="data-row">
          <span class="label" data-icon="🏞️">Reka</span>
          <span class="value">${station.data.river}</span>
        </div>
      `;
    }

    // Add basin information
    html += `
      <div class="data-row">
        <span class="label" data-icon="🗺️">Porečje</span>
        <span class="value" style="color: ${basin.color}; font-weight: bold;">${basin.name}</span>
      </div>
    `;

    if (station.data.temperature !== undefined && station.data.temperature !== null) {
      html += `
        <div class="data-row">
          <span class="label" data-icon="🌡️">Temperatura</span>
          <span class="value">${station.data.temperature} °C</span>
        </div>
      `;
    }

    if (station.data.waterLevel !== undefined && station.data.waterLevel !== null) {
      html += `
        <div class="data-row">
          <span class="label" data-icon="📊">Vodostaj</span>
          <span class="value">${station.data.waterLevel} cm</span>
        </div>
      `;
    }

    if (station.data.flow !== undefined && station.data.flow !== null) {
      html += `
        <div class="data-row">
          <span class="label" data-icon="💧">Pretok</span>
          <span class="value">${station.data.flow} m³/s</span>
        </div>
      `;
    }

    if (station.data.trend) {
      const trendIcon = station.data.trend === 'narašča' ? '📈' : station.data.trend === 'pada' ? '📉' : '➡️';
      html += `
        <div class="data-row">
          <span class="label" data-icon="${trendIcon}">Trend</span>
          <span class="value">${station.data.trend}</span>
        </div>
      `;
    }

    html += '</div>'; // Close data-section

    if (station.data.timestamp) {
      html += `<div class="timestamp">Zadnja meritev: ${station.data.timestamp}</div>`;
    }
  } else {
    html += '<div class="no-data">Ni razpoložljivih podatkov</div>';
  }

  content.innerHTML = html;
  return content;
}

// Function to fetch and parse ARSO data
async function fetchARSOData() {
  try {
    // Load scraped data from JSON file
    const response = await fetch('./arso-latest.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    // Transform the scraped data format to match the expected format
    const stations = jsonData.stations.map(station => ({
      name: station.name,
      coords: station.coordinates,
      data: {
        river: station.river,
        temperature: station.data.temperature,
        waterLevel: station.data.waterLevel,
        flow: station.data.flow,
        trend: station.data.trend,
        timestamp: new Date(station.data.timestamp).toLocaleString('sl-SI')
      }
    }));

    console.log(`Loaded ${stations.length} stations from JSON data`);
    console.log(`Last updated: ${new Date(jsonData.lastUpdated).toLocaleString('sl-SI')}`);

    return stations;

  } catch (error) {
    console.error('Error loading ARSO JSON data:', error);
    throw new Error(`Ni mogoče naložiti podatkov: ${error.message}`);
  }
}

// Function to show error message over the map
function showErrorMessage(message) {
  // Remove any existing error message
  const existingError = document.getElementById('error-message');
  if (existingError) {
    existingError.remove();
  }

  // Create error overlay
  const errorOverlay = document.createElement('div');
  errorOverlay.id = 'error-message';
  errorOverlay.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #e74c3c, #c0392b);
    color: white;
    padding: 30px 40px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    z-index: 2000;
    text-align: center;
    max-width: 400px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border: 2px solid rgba(255, 255, 255, 0.2);
  `;

  errorOverlay.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 10px;">⚠️</div>
    <h3 style="margin: 0 0 15px 0; font-size: 18px;">Napaka pri nalaganju</h3>
    <p style="margin: 0; font-size: 14px; line-height: 1.4;">${message}</p>
    <button onclick="location.reload()" style="
      margin-top: 20px;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s ease;
    " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
      Poskusi znova
    </button>
  `;

  document.body.appendChild(errorOverlay);
}

// Function to add markers to the map
function addStationsToMap(stations) {
  stations.forEach(station => {
    // Create basin-colored icon based on river name
    const icon = createBasinIcon(station.data.river);
    const marker = L.marker(station.coords, { icon: icon }).addTo(map);

    marker.bindPopup(() => createPopupContent(station), {
      maxWidth: 300,
      className: 'station-popup'
    });

    // Add hover effect
    marker.on('mouseover', function () {
      this.openPopup();
    });
  });

  // Update station count
  document.getElementById('station-count').textContent = stations.length;
}

// Initialize the application
async function init() {
  const loadingEl = document.getElementById('loading');

  try {
    console.log('Initializing application...');
    const stations = await fetchARSOData();
    addStationsToMap(stations);

    // Remove loading indicator
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }

    console.log(`✅ Successfully loaded ${stations.length} stations`);
    console.log(`📊 Stations with temperature: ${stations.filter(s => s.data.temperature !== null && s.data.temperature !== undefined).length}`);
    console.log(`💧 Stations with water level: ${stations.filter(s => s.data.waterLevel !== null && s.data.waterLevel !== undefined).length}`);
    console.log(`🌊 Stations with flow: ${stations.filter(s => s.data.flow !== null && s.data.flow !== undefined).length}`);

  } catch (error) {
    console.error('❌ Initialization error:', error);
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }

    // Display error message over the map
    showErrorMessage(error.message);
  }
}

// Start the application
init();

// Refresh data every 2 minutes (to catch 30-minute server updates quickly)
setInterval(async () => {
  console.log('🔄 Refreshing station data...');
  try {
    const stations = await fetchARSOData();
    // Update existing markers with new data
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    addStationsToMap(stations);
    console.log('✅ Data refreshed successfully');
  } catch (error) {
    console.error('❌ Failed to refresh data:', error);
    showErrorMessage(`Napaka pri osveževanju podatkov: ${error.message}`);
  }
}, 2 * 60 * 1000); // 2 minutes

// Check for data updates more frequently (every 30 seconds)
// This just checks if the data timestamp has changed without reloading
let lastUpdateTime = null;

setInterval(async () => {
  try {
    const response = await fetch('./arso-latest.json');
    if (response.ok) {
      const jsonData = await response.json();
      const currentUpdateTime = jsonData.lastUpdated;

      if (lastUpdateTime && lastUpdateTime !== currentUpdateTime) {
        console.log('🔄 New data detected, refreshing...');
        // Trigger a full refresh
        const stations = await fetchARSOData();
        map.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });
        addStationsToMap(stations);
        console.log('✅ Data updated with new information');
      }

      lastUpdateTime = currentUpdateTime;
    }
  } catch (error) {
    // Silently fail timestamp checks to avoid spam
    console.debug('Timestamp check failed:', error.message);
  }
}, 30 * 1000); // 30 seconds