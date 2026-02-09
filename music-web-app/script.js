// ==================== CONFIGURATION ====================
const CONFIG = {
    JAMENDO_CLIENT_ID: 'YOUR_JAMENDO_CLIENT_ID_HERE', // Get from https://developer.jamendo.com/
    STORAGE_KEY: 'musicHubData',
    AUTO_PLAY_NEXT: true,
    SHOW_VISUALIZER: false
};

// ==================== STATE MANAGEMENT ====================
const state = {
    currentTrackIndex: 0,
    isPlaying: false,
    playlist: [],
    playlists: [],
    queue: [],
    repeat: 'off', // 'off', 'one', 'all'
    shuffle: false,
    searchResults: [],
    currentSection: 'home'
};

// ==================== DOM ELEMENTS ====================
const dom = {
    audioPlayer: document.getElementById('audioPlayer'),
    playBtn: document.getElementById('playBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    progressSlider: document.getElementById('progressSlider'),
    volumeSlider: document.getElementById('volumeSlider'),
    currentTime: document.getElementById('currentTime'),
    duration: document.getElementById('duration'),
    
    playerTrackTitle: document.getElementById('playerTrackTitle'),
    playerArtistName: document.getElementById('playerArtistName'),
    playerAlbumArt: document.getElementById('playerAlbumArt'),
    
    themeToggle: document.getElementById('themeToggle'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    genreFilter: document.getElementById('genreFilter'),
    searchResults: document.getElementById('searchResults'),
    
    createPlaylistBtn: document.getElementById('createPlaylistBtn'),
    playlistsList: document.getElementById('playlistsList'),
    playlistToggleBtn: document.getElementById('playlistToggleBtn'),
    queuePanel: document.getElementById('queuePanel'),
    queueList: document.getElementById('queueList'),
    closeQueueBtn: document.getElementById('closeQueueBtn'),
    
    repeatBtn: document.getElementById('repeatBtn'),
    shuffleBtn: document.getElementById('shuffleBtn'),
    
    featuredTracks: document.getElementById('featuredTracks'),
    
    playlistModal: document.getElementById('playlistModal'),
    playlistNameInput: document.getElementById('playlistNameInput'),
    confirmPlaylistBtn: document.getElementById('confirmPlaylistBtn'),
    closeModal: document.querySelector('.close-modal'),
    
    sectionTitle: document.getElementById('sectionTitle'),
    
    autoPlayNext: document.getElementById('autoPlayNext'),
    showVisualizerCheckbox: document.getElementById('showVisualizerCheckbox'),
    qualitySelect: document.getElementById('qualitySelect'),
    clearDataBtn: document.getElementById('clearDataBtn'),
    
    visualizer: document.getElementById('visualizer'),
    visualizerCanvas: document.getElementById('visualizerCanvas')
};

// ==================== INITIALIZATION ====================
function init() {
    loadFromLocalStorage();
    initializeEventListeners();
    loadFeaturedTracks();
    updateQueueDisplay();
    applyTheme();
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage() {
    const data = {
        playlists: state.playlists,
        autoPlayNext: dom.autoPlayNext.checked,
        showVisualizer: dom.showVisualizerCheckbox.checked,
        quality: dom.qualitySelect.value,
        theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    };
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (data) {
        const parsed = JSON.parse(data);
        state.playlists = parsed.playlists || [];
        dom.autoPlayNext.checked = parsed.autoPlayNext !== false;
        dom.showVisualizerCheckbox.checked = parsed.showVisualizer || false;
        dom.qualitySelect.value = parsed.quality || 'medium';
        if (parsed.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// ==================== JAMENDO API INTEGRATION ====================
async function searchJamendoAPI(query, genre = '') {
    try {
        let url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CONFIG.JAMENDO_CLIENT_ID}&format=json&limit=20&search=${encodeURIComponent(query)}`;
        
        if (genre) {
            url += `&tags=${encodeURIComponent(genre)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            return data.results.map(track => ({
                title: track.name,
                artist: track.artist_name,
                src: track.audiodownload,
                cover: track.image || 'https://via.placeholder.com/300',
                id: track.id,
                duration: track.duration
            }));
        }
        return [];
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

async function loadFeaturedTracks() {
    // Load some sample tracks from Jamendo
    const genres = ['jazz', 'electronic', 'rock'];
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    
    const tracks = await searchJamendoAPI('featured', randomGenre);
    state.playlist = tracks.slice(0, 6);
    displayFeaturedTracks();
}

function displayFeaturedTracks() {
    dom.featuredTracks.innerHTML = '';
    state.playlist.forEach((track, index) => {
        const trackCard = createTrackCard(track, index);
        dom.featuredTracks.appendChild(trackCard);
    });
}

function createTrackCard(track, index) {
    const card = document.createElement('div');
    card.className = 'track-card';
    card.innerHTML = `
        <img src="${track.cover}" alt="${track.title}" onerror="this.src='https://via.placeholder.com/300'">
        <h3 title="${track.title}">${track.title}</h3>
        <p title="${track.artist}">${track.artist}</p>
    `;
    card.addEventListener('click', () => {
        state.currentTrackIndex = index;
        loadTrack(index);
        play();
    });
    return card;
}

// ==================== PLAYBACK CONTROL ====================
function loadTrack(index) {
    const track = state.playlist[index];
    if (!track) return;

    dom.playerTrackTitle.textContent = track.title;
    dom.playerArtistName.textContent = track.artist;
    dom.playerAlbumArt.src = track.cover;
    dom.audioPlayer.src = track.src;
    updateQueueDisplay();
}

function play() {
    dom.audioPlayer.play();
    state.isPlaying = true;
    updatePlayButton();
}

function pause() {
    dom.audioPlayer.pause();
    state.isPlaying = false;
    updatePlayButton();
}

function togglePlayPause() {
    if (state.isPlaying) {
        pause();
    } else {
        play();
    }
}

function updatePlayButton() {
    dom.playBtn.innerHTML = state.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function nextTrack() {
    if (state.shuffle) {
        state.currentTrackIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
        state.currentTrackIndex = (state.currentTrackIndex + 1) % state.playlist.length;
    }
    loadTrack(state.currentTrackIndex);
    if (state.isPlaying) play();
}

function prevTrack() {
    state.currentTrackIndex = (state.currentTrackIndex - 1 + state.playlist.length) % state.playlist.length;
    loadTrack(state.currentTrackIndex);
    if (state.isPlaying) play();
}

// ==================== REPEAT & SHUFFLE ====================
function toggleRepeat() {
    const modes = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(state.repeat);
    state.repeat = modes[(currentIndex + 1) % modes.length];
    
    dom.repeatBtn.classList.toggle('active', state.repeat !== 'off');
    dom.repeatBtn.title = `Repeat: ${state.repeat}`;
}

function toggleShuffle() {
    state.shuffle = !state.shuffle;
    dom.shuffleBtn.classList.toggle('active', state.shuffle);
}

// ==================== PROGRESS & VOLUME ====================
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateProgress() {
    if (dom.audioPlayer.duration) {
        const percentage = (dom.audioPlayer.currentTime / dom.audioPlayer.duration) * 100;
        dom.progressSlider.value = percentage;
        dom.currentTime.textContent = formatTime(dom.audioPlayer.currentTime);
        dom.duration.textContent = formatTime(dom.audioPlayer.duration);
    }
}

// ==================== SEARCH FUNCTIONALITY ====================
async function performSearch() {
    const query = dom.searchInput.value.trim();
    const genre = dom.genreFilter.value;

    if (!query) {
        dom.searchResults.innerHTML = '<p>Enter a search term...</p>';
        return;
    }

    dom.searchResults.innerHTML = '<p>Searching...</p>';
    const results = await searchJamendoAPI(query, genre);
    state.searchResults = results;

    dom.searchResults.innerHTML = '';
    if (results.length === 0) {
        dom.searchResults.innerHTML = '<p>No results found. Try another search!</p>';
        return;
    }

    results.forEach((track, index) => {
        const trackCard = createTrackCard(track, index);
        trackCard.addEventListener('click', () => {
            state.playlist = results;
            state.currentTrackIndex = index;
            loadTrack(index);
            play();
        });
        dom.searchResults.appendChild(trackCard);
    });
}

// ==================== PLAYLISTS ====================
function createPlaylist(name) {
    const playlist = {
        id: Date.now(),
        name: name,
        tracks: [],
        createdAt: new Date().toLocaleString()
    };
    state.playlists.push(playlist);
    saveToLocalStorage();
    renderPlaylists();
}

function renderPlaylists() {
    dom.playlistsList.innerHTML = '';
    
    state.playlists.forEach(playlist => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.innerHTML = `
            <h3>${playlist.name}</h3>
            <p>${playlist.tracks.length} songs • ${playlist.createdAt}</p>
        `;
        item.addEventListener('click', () => {
            state.playlist = playlist.tracks;
            state.currentTrackIndex = 0;
            if (state.playlist.length > 0) {
                loadTrack(0);
                play();
            }
        });
        dom.playlistsList.appendChild(item);
    });
}

function addToPlaylist(playlistId, track) {
    const playlist = state.playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.tracks.find(t => t.id === track.id)) {
        playlist.tracks.push(track);
        saveToLocalStorage();
    }
}

// ==================== QUEUE ====================
function updateQueueDisplay() {
    dom.queueList.innerHTML = '';
    state.playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${track.title} - ${track.artist}`;
        li.classList.toggle('active', index === state.currentTrackIndex);
        li.addEventListener('click', () => {
            state.currentTrackIndex = index;
            loadTrack(index);
            play();
        });
        dom.queueList.appendChild(li);
    });
}

// ==================== VISUALIZER ====================
let audioContext;
let analyser;
let dataArray;

function initVisualizer() {
    if (audioContext) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const source = audioContext.createMediaElementAudioSource(dom.audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    drawVisualizer();
}

function drawVisualizer() {
    const canvas = dom.visualizerCanvas;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            ctx.fillStyle = `hsl(${i * 360 / dataArray.length}, 100%, 50%)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    };

    draw();
}

// ==================== THEME TOGGLE ====================
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    saveToLocalStorage();
}

function applyTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    dom.themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// ==================== NAVIGATION ====================
function switchSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('active');
    });

    const section = document.getElementById(sectionName);
    const btn = document.querySelector(`[data-section="${sectionName}"]`);
    
    if (section) section.classList.add('active');
    if (btn) btn.classList.add('active');

    const titles = {
        'home': '🎵 Welcome to MusicHub',
        'search': '🔍 Search Music',
        'playlists': '📋 My Playlists',
        'settings': '⚙️ Settings'
    };
    dom.sectionTitle.textContent = titles[sectionName];
    state.currentSection = sectionName;
}

// ==================== MODAL HANDLING ====================
function openPlaylistModal() {
    dom.playlistModal.classList.add('show');
    dom.playlistNameInput.focus();
}

function closePlaylistModal() {
    dom.playlistModal.classList.remove('show');
    dom.playlistNameInput.value = '';
}

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Playback controls
    dom.playBtn.addEventListener('click', togglePlayPause);
    dom.prevBtn.addEventListener('click', prevTrack);
    dom.nextBtn.addEventListener('click', nextTrack);
    dom.repeatBtn.addEventListener('click', toggleRepeat);
    dom.shuffleBtn.addEventListener('click', toggleShuffle);

    // Progress and volume
    dom.audioPlayer.addEventListener('timeupdate', updateProgress);
    dom.audioPlayer.addEventListener('ended', () => {
        if (state.repeat === 'one') {
            dom.audioPlayer.currentTime = 0;
            play();
        } else {
            nextTrack();
        }
    });

    dom.progressSlider.addEventListener('change', () => {
        dom.audioPlayer.currentTime = (dom.progressSlider.value / 100) * dom.audioPlayer.duration;
    });

    dom.volumeSlider.addEventListener('input', () => {
        dom.audioPlayer.volume = dom.volumeSlider.value / 100;
    });

    // Theme
    dom.themeToggle.addEventListener('click', () => {
        toggleTheme();
        applyTheme();
    });

    // Search
    dom.searchBtn.addEventListener('click', performSearch);
    dom.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Playlists
    dom.createPlaylistBtn.addEventListener('click', openPlaylistModal);
    dom.closeModal.addEventListener('click', closePlaylistModal);
    dom.confirmPlaylistBtn.addEventListener('click', () => {
        const name = dom.playlistNameInput.value.trim();
        if (name) {
            createPlaylist(name);
            closePlaylistModal();
        }
    });

    // Queue panel
    dom.playlistToggleBtn.addEventListener('click', () => {
        dom.queuePanel.classList.toggle('open');
    });
    dom.closeQueueBtn.addEventListener('click', () => {
        dom.queuePanel.classList.remove('open');
    });

    // Visualizer
    dom.showVisualizerCheckbox.addEventListener('change', () => {
        if (dom.showVisualizerCheckbox.checked) {
            dom.visualizer.style.display = 'block';
            initVisualizer();
        } else {
            dom.visualizer.style.display = 'none';
        }
        saveToLocalStorage();
    });

    // Settings
    dom.autoPlayNext.addEventListener('change', saveToLocalStorage);
    dom.qualitySelect.addEventListener('change', saveToLocalStorage);
    dom.clearDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure? This will delete all playlists and settings.')) {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            state.playlists = [];
            renderPlaylists();
            location.reload();
        }
    });

    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section');
            switchSection(section);
        });
    });

    // Modal close on outside click
    dom.playlistModal.addEventListener('click', (e) => {
        if (e.target === dom.playlistModal) {
            closePlaylistModal();
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);