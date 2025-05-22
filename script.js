const iframes = Array.from(document.querySelectorAll('iframe.video-embed'));
const baseSrc = "https://player.vimeo.com/video/980835810?muted=1&loop=1";
const autoplaySrc = "https://player.vimeo.com/video/980835810?autoplay=1&muted=1&loop=1";

function setAutoplay(iframe) {
  iframes.forEach(el => {
    // Only update if not already set
    if (el === iframe && !el.src.includes('autoplay=1')) {
      el.src = autoplaySrc;
    } else if (el !== iframe && el.src.includes('autoplay=1')) {
      el.src = baseSrc;
    }
  });
}

// Use Intersection Observer to detect which iframe is most in view
const observer = new IntersectionObserver((entries) => {
  // Find the entry with the largest intersection ratio
  let maxEntry = null;
  let maxRatio = 0;
  entries.forEach(entry => {
    if (entry.intersectionRatio > maxRatio) {
      maxRatio = entry.intersectionRatio;
      maxEntry = entry;
    }
  });
  if (maxEntry && maxEntry.isIntersecting) {
    setAutoplay(maxEntry.target);
  }
}, {
  threshold: Array.from({length: 101}, (_, i) => i / 100) // 0, 0.01, ..., 1
});

// Observe all iframes
iframes.forEach(iframe => observer.observe(iframe));