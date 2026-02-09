# 🎵 MusicHub - Free Music Web Application

A modern, fully-featured music web application built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- 🎶 **Music Player** - Play/pause, skip, repeat, shuffle functionality
- 🔍 **Search** - Search music from Jamendo API (free music database)
- 📋 **Playlists** - Create and manage your custom playlists
- 🎨 **Dark/Light Theme** - Toggle between dark and light modes
- 📊 **Audio Visualizer** - Beautiful real-time audio visualization
- 💾 **Local Storage** - Save playlists and preferences locally
- 📱 **Responsive** - Works on desktop, tablet, and mobile devices
- 🔊 **Volume Control** - Adjust volume with slider
- ⏱️ **Progress Bar** - Seek through tracks easily
- 🎯 **Queue Management** - View and manage current playing queue

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A Jamendo API key (free from https://developer.jamendo.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishnuvsvijay/music-web-app.git
   cd music-web-app
   ```

2. **Get a Jamendo API Key**
   - Visit https://developer.jamendo.com/
   - Sign up for a free account
   - Generate your Client ID

3. **Update the API Key**
   - Open `script.js`
   - Replace `YOUR_JAMENDO_CLIENT_ID_HERE` with your actual Client ID
   ```javascript
   const CONFIG = {
       JAMENDO_CLIENT_ID: 'your_actual_client_id_here',
       // ... rest of config
   };
   ```

4. **Open in Browser**
   - Simply open `index.html` in your favorite web browser
   - Or serve locally with Python:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 📦 Deployment

### GitHub Pages
1. Push your code to GitHub
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your app is live at `https://yourusername.github.io/music-web-app/`

### Netlify
1. Go to https://netlify.com
2. Drag and drop your project folder
3. Deploy instantly with a free URL

### Vercel
1. Go to https://vercel.com
2. Import your GitHub repository
3. Deploy with one click

## 🔧 Configuration

Edit `CONFIG` object in `script.js`:

```javascript
const CONFIG = {
    JAMENDO_CLIENT_ID: 'your_client_id',
    STORAGE_KEY: 'musicHubData',
    AUTO_PLAY_NEXT: true,
    SHOW_VISUALIZER: false
};
```

## 🎨 Customization

### Change Colors
Edit CSS variables in `style.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --bg-light: #f5f5f5;
    --text-light: #333;
}
```

### Add Your Own Music
Replace the Jamendo API calls with your own music sources. Modify `searchJamendoAPI()` function in `script.js`.

## 🌐 Supported Music APIs

- **Jamendo** - Royalty-free music streaming (Free tier available)
- **Free Music Archive** - Public domain and creative commons music
- **Local Files** - Add your own MP3 files (browser-based, no upload to server)

## ���� Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🛠️ Technologies Used

- **HTML5** - Structure and audio element
- **CSS3** - Styling and animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **Web Audio API** - Audio visualization
- **Fetch API** - API requests
- **LocalStorage** - Data persistence
- **Font Awesome** - Icons

## 📝 Features in Detail

### Music Playback
- Play, pause, next, previous controls
- Progress bar with seek functionality
- Volume control
- Duration display

### Search & Discovery
- Search tracks by name, artist, or genre
- Filter by genre
- Real-time search results
- Powered by Jamendo API

### Playlists
- Create custom playlists
- Add tracks to playlists
- Persistent storage (saved locally)
- View playlist details

### Visualizer
- Real-time audio frequency visualization
- Toggle on/off in settings
- Beautiful gradient colors
- Uses Web Audio API

### Theme Switching
- Dark and Light modes
- Persistent preference storage
- Easy toggle button

## 🐛 Troubleshooting

**No sound playing?**
- Check browser console for errors (F12)
- Ensure API key is valid
- Check browser's autoplay policy

**API not working?**
- Verify your Jamendo Client ID
- Check internet connection
- API calls might be rate-limited (free tier)

**Playlists not saving?**
- Check if LocalStorage is enabled
- Check browser storage limits
- Try clearing cache and reloading

## 🤝 Contributing

Feel free to fork and submit pull requests!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Jamendo** - Music API and royalty-free tracks
- **Font Awesome** - Beautiful icons
- Inspired by Spotify, Apple Music, and YouTube Music

## 📧 Support

For issues, questions, or suggestions:
- Open an GitHub issue
- Contact: vishnuvsvijay@example.com

---

**Made with ❤️ by Vishnu SV**

**⭐ If you find this helpful, please give it a star!**