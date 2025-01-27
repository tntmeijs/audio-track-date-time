// Helper elements - will never be added to the DOM
const audioPlayer = document.createElement("audio");

// Connections to various elements on the page
const selectFileButton = document.getElementById("select-file-btn");
const uploadModal = document.getElementById("upload-modal");
const audioPlayerContainer = document.getElementById("audio-player");
const audioPlayerDateTimeLocal = document.getElementById("audio-player-date-time-local");
const audioPlayerTimeline = document.getElementById("audio-player-timeline");
const audioPlayerPlayPauseButton = document.getElementById("audio-player-play-pause-btn");

// Style as dictated by CSS - stored here so we can restore the original style
const uploadModalStyle = uploadModal.style;
const audioPlayerStyle = audioPlayerContainer.style;

// Start with the upload modal shown and the audio player hidden
uploadModal.style.display = uploadModalStyle;
audioPlayerContainer.style.display = "none";

// Keep the progress bar in-sync whenever the audio plays
audioPlayer.addEventListener("timeupdate", _ => setTimelineToCurrentAudioTime());
audioPlayer.addEventListener("seeked", _ => setTimelineToCurrentAudioTime());

// Keep the play/pause buttons in-sync whenever audio plays
audioPlayer.addEventListener("play", _ => audioPlayerPlayPauseButton.innerHTML = "⏸️");
audioPlayer.addEventListener("pause", _ => audioPlayerPlayPauseButton.innerHTML = "▶️");

// Play/pause the audio when clicking the button
audioPlayerPlayPauseButton.addEventListener("click", e => {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
})

// Allow a user to seek by clicking the timeline
audioPlayerTimeline.addEventListener("click", e => {
  // Relative to left side of the timeline, scale 0 to 1
  progress = e.offsetX / e.target.clientWidth;
  seekTo = audioPlayer.duration * progress;
  audioPlayer.currentTime = seekTo;
  audioPlayer.play();
});

// Open a file selection dialogue when clicking a button
selectFileButton.addEventListener("click", _ => {
  const fileSelector = document.createElement("input");
  fileSelector.type = "file";
  fileSelector.accept = "audio/*";
  fileSelector.onchange = e => {
    audioPlayer.src = URL.createObjectURL(e.target.files[0]);

    // Ready to start playing audio, hide the file selector and displya the audio player
    uploadModal.style.display = "none";
    audioPlayerContainer.style = audioPlayerStyle;
    setDateTimeOffset(new Date())
  };

  fileSelector.click();
});

// Helper method to set the date-time picker to the specified date
function setDateTimeOffset(d) {
  // Set date time to current date time (remove zero-time, milliseconds, and seconds)
  d.setSeconds(null);
  d.setMilliseconds(null);
  str = d.toISOString().slice(0, -1); // Remove "Z" from the end
  audioPlayerDateTimeLocal.value = str;
}

// Helper method to pin the timeline to the current audio track's time
function setTimelineToCurrentAudioTime() {
  progress = audioPlayer.currentTime / audioPlayer.duration * 100.0
  audioPlayerTimeline.value = progress;
}
