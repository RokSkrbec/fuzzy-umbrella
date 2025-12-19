# 🌊 ARSO Water Monitor Slovenia

A modern, responsive web application for real-time monitoring of water temperatures, levels, and flow rates across Slovenia's water measurement stations, powered by ARSO data.

![Water Monitor Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=ARSO+Water+Monitor)

## ✨ Features

- 🌡️ **Real-time Data**: Live water temperature, water levels, and flow data
- 🗺️ **Interactive Map**: 173 monitoring stations across Slovenia  
- 📱 **Mobile Responsive**: Optimized for all devices
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations
- 🔄 **Auto-refresh**: Data updates every 5 minutes automatically
- 📊 **Historic Charts**: 24-hour trending data visualization
- ⚡ **Fast Loading**: Optimized performance and caching

## 🚀 Live Demo

**[View Live Application →](https://rokskrbec.github.io/arso-water-monitor)**

## 📊 Data Coverage

| Metric | Stations | Coverage |
|--------|----------|----------|
| 🌡️ Temperature | 149 | 86% |
| 📊 Water Level | 151 | 87% |
| 💧 Flow Rate | 135 | 78% |
| **Total Stations** | **173** | **100%** |

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js with OpenStreetMap
- **Charts**: Chart.js for data visualization
- **Styling**: CSS Grid, Flexbox, Glassmorphism
- **Data**: ARSO Web Scraping with JSDOM
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🎨 Design Features

- **Glassmorphism UI** with backdrop blur effects
- **Responsive design** for desktop, tablet, and mobile
- **Smooth animations** and micro-interactions
- **Dark/light adaptive** color scheme
- **Accessibility optimized** for screen readers

## 📱 Screenshots

<table>
<tr>
<td width="50%">

**Desktop View**
![Desktop](https://via.placeholder.com/600x400/667eea/ffffff?text=Desktop+View)

</td>
<td width="50%">

**Mobile View**  
![Mobile](https://via.placeholder.com/300x500/764ba2/ffffff?text=Mobile+View)

</td>
</tr>
</table>

## 🚀 Quick Start

### Option 1: View Online
Simply visit the **[live application](https://rokskrbec.github.io/arso-water-monitor)**

### Option 2: Local Development

1. **Clone the repository**
```bash
git clone https://github.com/rokskrbec/arso-water-monitor.git
cd arso-water-monitor
```

2. **Install dependencies**
```bash
npm install
```

3. **Generate fresh data**
```bash
node arso-scraper.js
```

4. **Start local server**
```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx serve .

# Option 3: PHP
php -S localhost:8000
```

5. **Open browser** → `http://localhost:8000`

## 📁 Project Structure

```
arso-water-monitor/
├── 📄 index.html              # Main application page
├── 🎨 app.js                   # Frontend logic & map
├── 🤖 arso-scraper.js         # ARSO data scraper
├── 📦 package.json            # Dependencies
├── 🗺️ geocoded-coordinates.json # Station coordinates  
├── 📊 data-index.json         # Historic data index
├── 🌊 arso-latest.json        # Current water data
├── 📈 arso-data-*.json        # Historic data files
└── 🚀 .github/workflows/      # Auto-deployment
```

## ⚙️ Configuration

### Automated Data Updates

The app includes a GitHub Actions workflow for automatic deployment and data updates:

```yaml
# Triggers: Push to main branch
# Actions: Install deps → Run scraper → Deploy to GitHub Pages
# Schedule: Can be configured for periodic updates
```

### Manual Data Refresh

```bash
# Update data manually
npm run scrape

# Or run the scraper directly
node arso-scraper.js
```

### Environment Setup

```bash
# Install all dependencies
npm install

# Available scripts
npm run scrape          # Update ARSO data
npm run start           # Start local development server
```

## 🌐 Deployment Options

### 1. 🆓 GitHub Pages (Recommended)

1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Choose source: "GitHub Actions"
4. Push to main branch → Auto-deploy! 🚀

### 2. 🔺 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rokskrbec/arso-water-monitor)

### 3. 🟢 Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/rokskrbec/arso-water-monitor)

### 4. 🌊 Other Options

- **Surge.sh**: `npx surge . your-domain.surge.sh`
- **Firebase**: `firebase deploy`
- **AWS S3**: Static website hosting
- **Any web server**: Upload files to public directory

## 🔗 API & Data Sources

### Primary Data Source
- **ARSO**: [Slovenian Environment Agency](https://www.arso.gov.si/vode/podatki/stanje_voda_samodejne.html)
- **Update Frequency**: Hourly scraping
- **Data Types**: Temperature, Water Level, Flow Rate, Trends

### Geocoding Services
- **Nominatim API**: OpenStreetMap geocoding for station coordinates
- **Fallback**: Pre-geocoded coordinates included

### Map Services  
- **Leaflet.js**: Interactive mapping library
- **OpenStreetMap**: Free map tiles

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **🍴 Fork** the repository
2. **🌿 Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **💻 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔀 Open** a Pull Request

### Development Guidelines

- Follow existing code style and structure
- Test on multiple devices and browsers  
- Update documentation for new features
- Ensure mobile responsiveness
- Optimize for performance

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[ARSO](https://www.arso.gov.si/)** - For providing public water monitoring data
- **[Leaflet.js](https://leafletjs.com/)** - Excellent mapping library
- **[Chart.js](https://www.chartjs.org/)** - Beautiful data visualization
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Free map data and tiles

## 📞 Contact & Support

- 🐛 **Report Issues**: [GitHub Issues](https://github.com/rokskrbec/arso-water-monitor/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/rokskrbec/arso-water-monitor/discussions)
- 📧 **Email**: [your.email@example.com](mailto:your.email@example.com)

---

<div align="center">

**🌊 Made with ❤️ for Slovenia's water monitoring community**

⭐ **Star this repository if you find it useful!**

[Live Demo](https://rokskrbec.github.io/arso-water-monitor) • [Report Bug](https://github.com/rokskrbec/arso-water-monitor/issues) • [Request Feature](https://github.com/rokskrbec/arso-water-monitor/discussions)

</div>
