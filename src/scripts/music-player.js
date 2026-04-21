document.addEventListener('DOMContentLoaded', async () => {
    const playlistContainer = document.getElementById('playlist');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    const timeDisplay = document.getElementById('time-display');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');

    let tracks = [];
    let currentTrackIndex = 0;
    const audio = new Audio();

    async function loadTracks() {
        try {
            const response = await fetch('/assets/music/tracks.json');
            tracks = await response.json();
            renderPlaylist();
            loadTrack(0);
        } catch (error) {
            console.error('Error loading tracks:', error);
        }
    }

    function renderPlaylist() {
        playlistContainer.innerHTML = '';
        tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.textContent = `${index + 1}. ${track.metaData.artist} - ${track.metaData.title}`;
            item.addEventListener('click', () => {
                playTrack(index);
            });
            playlistContainer.appendChild(item);
        });
    }

    function loadTrack(index) {
        currentTrackIndex = index;
        const track = tracks[index];
        trackTitle.textContent = track.metaData.title;
        trackArtist.textContent = track.metaData.artist;
        audio.src = track.url;
        updatePlaylistUI();
    }

    function playTrack(index) {
        loadTrack(index);
        audio.play();
    }

    function updatePlaylistUI() {
        const items = playlistContainer.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentTrackIndex);
        });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    playBtn.addEventListener('click', () => {
        audio.play();
    });

    pauseBtn.addEventListener('click', () => {
        audio.pause();
    });

    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
    });

    prevBtn.addEventListener('click', () => {
        playTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
    });

    nextBtn.addEventListener('click', () => {
        playTrack((currentTrackIndex + 1) % tracks.length);
    });

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    audio.addEventListener('timeupdate', () => {
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percentage}%`;
        timeDisplay.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
        nextBtn.click();
    });

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    });

    loadTracks();
});
