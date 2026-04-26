function initMiniPlayer() {
    const trackTitle = document.getElementById('mini-track-title');
    const playPauseBtn = document.getElementById('mini-play-pause-btn');
    const prevBtn = document.getElementById('mini-prev-btn');
    const nextBtn = document.getElementById('mini-next-btn');
    const playlistContainer = document.getElementById('mini-playlist');
    
    // Ensure the mini player elements exist on the page
    if (!trackTitle || !playPauseBtn || !prevBtn || !nextBtn) return;

    let tracks = [];
    let currentTrackIndex = 0;
    let isPlaying = false;
    const audio = new Audio();

    async function loadTracks() {
        try {
            const response = await fetch('/assets/music/tracks.json');
            tracks = await response.json();
            if(tracks.length > 0) {
                renderPlaylist();
                loadTrack(0);
            } else {
                trackTitle.textContent = "No tracks found.";
            }
        } catch (error) {
            console.error('Error loading tracks:', error);
            trackTitle.textContent = "Error loading tracks.";
        }
    }

    function renderPlaylist() {
        if (!playlistContainer) return;
        playlistContainer.innerHTML = '';
        tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = 'mini-playlist-item';
            item.textContent = `${index + 1}. ${track.metaData.artist} - ${track.metaData.title}`;
            item.addEventListener('click', () => {
                playTrack(index);
            });
            playlistContainer.appendChild(item);
        });
        updatePlaylistUI();
    }

    function updatePlaylistUI() {
        if (!playlistContainer) return;
        const items = playlistContainer.querySelectorAll('.mini-playlist-item');
        items.forEach((item, index) => {
            if (index === currentTrackIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function loadTrack(index) {
        currentTrackIndex = index;
        const track = tracks[index];
        trackTitle.textContent = `${track.metaData.artist} - ${track.metaData.title}`;
        audio.src = track.url;
        updatePlaylistUI();
        
        if (isPlaying) {
            audio.play();
        }
    }

    function togglePlay() {
        if(tracks.length === 0) return;
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playPauseBtn.textContent = '▶';
        } else {
            audio.play();
            isPlaying = true;
            playPauseBtn.textContent = '⏸';
        }
    }

    playPauseBtn.addEventListener('click', togglePlay);

    prevBtn.addEventListener('click', () => {
        if(tracks.length === 0) return;
        playTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
    });

    nextBtn.addEventListener('click', () => {
        if(tracks.length === 0) return;
        playTrack((currentTrackIndex + 1) % tracks.length);
    });

    function playTrack(index) {
        currentTrackIndex = index;
        const track = tracks[index];
        trackTitle.textContent = `${track.metaData.artist} - ${track.metaData.title}`;
        audio.src = track.url;
        audio.play();
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
        updatePlaylistUI();
    }

    audio.addEventListener('ended', () => {
        nextBtn.click();
    });

    loadTracks();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMiniPlayer);
} else {
    initMiniPlayer();
}
