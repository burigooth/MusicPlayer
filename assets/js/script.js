let nowPlaying = document.querySelector('.now-playing');
let trackArt = document.querySelector('.track-art');
let trackName = document.querySelector('.track-name');
let trackArtist = document.querySelector('.track-artist');

let playPauseBtn = document.querySelector('.playpause-track');
let nextTrackBtn = document.querySelector('.next-track');
let prevTrackBtn = document.querySelector('.prev-track');

let seekSlider = document.querySelector('.seek_slider');
let volumeSlider = document.querySelector('.volume_slider');
let currentTime = document.querySelector('.current-time');
let totalDuration = document.querySelector('.total-duration');
let randomIcon = document.querySelector('.fa-shuffle');
let currentTrack = document.createElement('audio');
let repeatIcon = document.querySelector('.fa-repeat');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

fetch('music_list.json')
  .then(response => response.json())
  .then(data => {
    const music_list = data;
    
    loadTrack(track_index);
    
    function loadTrack(track_index) {
        clearInterval(updateTimer);
        reset();

        currentTrack.src = music_list[track_index].music;
        currentTrack.load();

        trackArt.style.backgroundImage = 'url(' + music_list[track_index].img + ')';
        trackName.textContent = music_list[track_index].name;
        trackArtist.textContent = music_list[track_index].artist;
        nowPlaying.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

        updateTimer = setInterval(setUpdate, 1000);

        currentTrack.addEventListener('ended', nextTrack);
    }

    function reset() {
        currentTime.textContent = '00:00';
        totalDuration.textContent = '00:00';
        seekSlider.value = 0;
    }

    function randomTrack() {
        isRandom ? pauseRandom() : playRandom();
    }

    function playRandom() {
        isRandom = true;
        randomIcon.classList.add('randomActive');
    }

    function pauseRandom() {
        isRandom = false;
        randomIcon.classList.remove('randomActive');
    }

    function repeatTrack() {
        let currentIndex = track_index;
        loadTrack(currentIndex);
        playTrack();
    }

    function playPauseTrack() {
        isPlaying ? pauseTrack() : playTrack();
    }

    function playTrack() {
        currentTrack.play();
        isPlaying = true;
        trackArt.classList.add('rotate');
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }

    function pauseTrack() {
        currentTrack.pause();
        isPlaying = false;
        trackArt.classList.remove('rotate');
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>'
    }

    function nextTrack() {
        if (track_index < music_list.length - 1 && isRandom === false) {
            track_index += 1;
        } else if (track_index < music_list.length - 1 && isRandom === true) {
            let random_index = Number.parseInt(Math.random() * music_list.length);
            track_index = random_index;
        } else {
            track_index = 0
        }
        loadTrack(track_index);
        playTrack();
    }

    function prevTrack() {
        if (track_index > 0) {
            track_index -= 1;
        } else {
            track_index = music_list.length - 1;
        }
        loadTrack(track_index);
        playTrack();
    }

    function seekTo() {
        let seekTo = currentTrack.duration * (seekSlider.value / 100);
        currentTrack.currentTime = seekTo;
    }

    function setVolume() {
        currentTrack.volume = volumeSlider.value / 100;
    }

    function setUpdate() {
        let seekPosition = 0;

        if (!isNaN(currentTrack.duration)) {
            seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
            seekSlider.value = seekPosition;

            let currentMinutes = Math.floor(currentTrack.currentTime / 60);
            let currentSeconds = Math.floor(currentTrack.currentTime - currentMinutes * 60);
            let durationMinutes = Math.floor(currentTrack.duration / 60);
            let durationSeconds = Math.floor(currentTrack.duration - durationMinutes * 60);

            if (currentSeconds < 10) {
                currentSeconds = '0' + currentSeconds
            };
            if (durationSeconds < 10) {
                durationSeconds = '0' + durationSeconds
            };
            if (currentMinutes < 10) {
                currentMinutes = '0' + currentMinutes
            };
            if (durationMinutes < 10){
                durationMinutes = '0' + durationMinutes
            };

            currentTime.textContent = currentMinutes + ':' + currentSeconds;
            totalDuration.textContent = durationMinutes + ':' + durationSeconds;
        }
    }

    
    playPauseBtn.addEventListener('click', playPauseTrack);
    nextTrackBtn.addEventListener('click', nextTrack);
    prevTrackBtn.addEventListener('click', prevTrack);
    seekSlider.addEventListener('change', seekTo);
    volumeSlider.addEventListener('change', setVolume);
    randomIcon.addEventListener('click', randomTrack);
    repeatIcon.addEventListener('click', repeatTrack);

  })
  .catch(error => {
    console.error('Erro ao carregar o arquivo JSON:', error);
  });