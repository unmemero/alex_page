function initMiniPlayer() {
    const trackTitle = document.getElementById('mini-track-title');
    const playPauseBtn = document.getElementById('mini-play-pause-btn');
    const prevBtn = document.getElementById('mini-prev-btn');
    const nextBtn = document.getElementById('mini-next-btn');
    const playlistContainer = document.getElementById('mini-playlist');
    const volumeSlider = document.getElementById('mini-volume-slider');
    
    // Ensure the mini player elements exist on the page
    if (!trackTitle || !playPauseBtn || !prevBtn || !nextBtn) return;

    let tracks = [];
    let currentTrackIndex = 0;
    let isPlaying = false;
    const audio = new Audio();
    if (volumeSlider) {
        audio.volume = volumeSlider.value;
    }

    function getTrackIndexForPage() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('about')) return 2;
        if (path.includes('sitemap') || path.includes('contact')) return 3;
        if (path.includes('journal')) return 4;
        if (path.includes('blog')) return 5;
        if (path.includes('gallery')) return 6;
        return 0;
    }

    async function loadTracks() {
        try {
            const response = await fetch('/assets/music/tracks.json');
            tracks = await response.json();
            if(tracks.length > 0) {
                renderPlaylist();
                let trackIndex = getTrackIndexForPage();
                if (trackIndex >= tracks.length) trackIndex = 0;
                
                currentTrackIndex = trackIndex;
                const track = tracks[trackIndex];
                const trackName = `${track.metaData.title}`;
                trackTitle.textContent = trackName;
                trackTitle.title = trackName;
                audio.src = track.url;
                updatePlaylistUI();
                
                const path = window.location.pathname.toLowerCase();
                if (!path.includes('music')) {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            if (error.name === 'NotAllowedError') {
                                console.log('Autoplay prevented by browser, waiting for interaction:', error);
                                const playOnInteract = () => {
                                    document.removeEventListener('click', playOnInteract);
                                    document.removeEventListener('keydown', playOnInteract);
                                    audio.play().catch(e => console.log('Playback still prevented:', e));
                                };
                                document.addEventListener('click', playOnInteract);
                                document.addEventListener('keydown', playOnInteract);
                            }
                        });
                    }
                }
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
            const trackName = `${index + 1}. ${track.metaData.title}`;
            item.textContent = trackName;
            item.title = trackName;
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
        const trackName = `${track.metaData.title}`;
        trackTitle.textContent = trackName;
        trackTitle.title = trackName;
        audio.src = track.url;
        updatePlaylistUI();
        
        if (isPlaying) {
            audio.play();
        }
    }

    function togglePlay() {
        if(tracks.length === 0) return;
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
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
        const trackName = `${track.metaData.title}`;
        trackTitle.textContent = trackName;
        trackTitle.title = trackName;
        audio.src = track.url;
        audio.play().catch(e => console.log('Playback prevented:', e));
        updatePlaylistUI();
    }

    audio.addEventListener('ended', () => {
        nextBtn.click();
    });

    audio.addEventListener('play', () => {
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        playPauseBtn.textContent = '▶';
    });

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value;
        });
    }

    loadTracks();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMiniPlayer);
} else {
    initMiniPlayer();
}
