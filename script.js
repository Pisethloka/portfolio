// Scroll Reveal Animation
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  },
);

revealElements.forEach((element) => observer.observe(element));

// Active Navigation
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < bottom) {
      current = section.id;
    }
  });

  // At the bottom of the page, always highlight Contact
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 5
  ) {
    current = "contact";
  }

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`,
    );
  });
});

// Intro Typing effects
const text =
  "Developer with passion about building software and sharing technology contents.";

const typing = document.getElementById("typing");
const cursor = document.querySelector(".cursor");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (prefersReducedMotion) {
  typing.textContent = text;
  cursor.style.display = "none";
} else {
  let index = 0;
  function type() {
    if (index < text.length) {
      typing.textContent += text.charAt(index);
      index++;
      setTimeout(type, 50);
    } else {
      cursor.style.display = "none";
    }
  }
  type();
}

// === YOUTUBE PLAYER ===

// Initialize the player
let ytPlayer = null;

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player("yt-hidden-player", {
    videoId: "7F5oZfJCRZM",
    playerVars: { controls: 0, disablekb: 1 },
    events: {
      onReady: () => {
        durationE1.textContent = formatTime(ytPlayer.getDuration());
      },
      onStateChange: onPlayerStateChange,
    },
  });
};

// Play/Pause button

const playBtn = document.querySelector(".player-play-btn");
const playIcon = document.querySelector(".play-icon");

playBtn.addEventListener("click", () => {
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
  } else {
    ytPlayer.playVideo();
  }
});

function onPlayerStateChange(event) {
  const isPlaying = event.data === YT.PlayerState.PLAYING;
  playIcon.textContent = isPlaying ? "⏸" : "▶";
  if (isPlaying) {
    progressInterval = setInterval(updateProgress, 250);
  } else {
    clearInterval(progressInterval);
  }
}

// Progress bar updates

const progressFill = document.querySelector(".player-progress-fill");
const currentTimeE1 = document.querySelector(".player-current-time");
const durationE1 = document.querySelector(".player-duration");

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function updateProgress() {
  const current = ytPlayer.getCurrentTime();
  const duration = ytPlayer.getDuration();
  progressFill.style.width = "${(current / duration) * 100}%";
  currentTimeE1.textContent = formatTime(current);
  durationE1.textContent = formatTime(duration);
}

// Click to seek
const progressBar = document.querySelector(".player-progress-bar");

progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  ytPlayer.seekTo(ratio * ytPlayer.getDuration(), true);
  updateProgress();
});
