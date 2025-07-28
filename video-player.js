// Enhanced Video Player Controls
const video = document.getElementById('video-player');
const videoTitle = document.getElementById('video-title');
const controls = document.getElementById('custom-controls');

controls.innerHTML = `
  <button id="play-pause" title="Play/Pause">▶️</button>
  <button id="skip-back" title="Back 10s">⏪</button>
  <button id="skip-forward" title="Forward 10s">⏩</button>
  <input type="range" id="seek-bar" min="0" value="0" step="0.1">
  <span id="current-time">0:00</span> / <span id="duration">0:00</span>
  <input type="range" id="volume-bar" min="0" max="1" step="0.01" value="1">
  <button id="mute" title="Mute">🔊</button>
  <select id="playback-rate">
    <option value="0.5">0.5x</option>
    <option value="1" selected>1x</option>
    <option value="1.5">1.5x</option>
    <option value="2">2x</option>
  </select>
  <button id="fullscreen" title="Fullscreen">⛶</button>
`;

const playPauseBtn = document.getElementById('play-pause');
const skipBackBtn = document.getElementById('skip-back');
const skipForwardBtn = document.getElementById('skip-forward');
const seekBar = document.getElementById('seek-bar');
const currentTimeSpan = document.getElementById('current-time');
const durationSpan = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');
const muteBtn = document.getElementById('mute');
const playbackRateSelect = document.getElementById('playback-rate');
const fullscreenBtn = document.getElementById('fullscreen');

function formatTime(sec) {
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

video.addEventListener('loadedmetadata', () => {
  seekBar.max = video.duration;
  durationSpan.textContent = formatTime(video.duration);
});

video.addEventListener('timeupdate', () => {
  seekBar.value = video.currentTime;
  currentTimeSpan.textContent = formatTime(video.currentTime);
});

playPauseBtn.onclick = () => {
  if (video.paused) {
    video.play();
    playPauseBtn.textContent = '⏸️';
  } else {
    video.pause();
    playPauseBtn.textContent = '▶️';
  }
};

skipBackBtn.onclick = () => {
  video.currentTime = Math.max(0, video.currentTime - 10);
};
skipForwardBtn.onclick = () => {
  video.currentTime = Math.min(video.duration, video.currentTime + 10);
};

seekBar.oninput = () => {
  video.currentTime = seekBar.value;
};

volumeBar.oninput = () => {
  video.volume = volumeBar.value;
};

muteBtn.onclick = () => {
  video.muted = !video.muted;
  muteBtn.textContent = video.muted ? '🔇' : '🔊';
};

playbackRateSelect.onchange = () => {
  video.playbackRate = playbackRateSelect.value;
};

fullscreenBtn.onclick = () => {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  }
};

video.addEventListener('play', () => {
  playPauseBtn.textContent = '⏸️';
});
video.addEventListener('pause', () => {
  playPauseBtn.textContent = '▶️';
});
