document.addEventListener("DOMContentLoaded", function() {
  const iframes = Array.from(document.querySelectorAll('iframe.video-embed'));
  const players = iframes.map(iframe => new Vimeo.Player(iframe, {muted: true, loop: true}));
  let currentPlayingIdx = 0; // Start with the first video playing

  // Play the first video on load
  players[0].play().catch(() => {});
  iframes[0].classList.add('in-view');

  function handleIntersect(entries) {
    // Find any video at least 90% in view
    let newIdx = currentPlayingIdx;
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.9) {
        const idx = iframes.indexOf(entry.target);
        if (idx !== -1) newIdx = idx;
      }
    });

    if (newIdx !== currentPlayingIdx) {
      // Pause the old, play the new
      players[currentPlayingIdx].pause();
      iframes[currentPlayingIdx].classList.remove('in-view');
      players[newIdx].play().catch(() => {});
      iframes[newIdx].classList.add('in-view');
      currentPlayingIdx = newIdx;
    }
  }

  const observer = new IntersectionObserver(handleIntersect, {
    threshold: Array.from({length: 101}, (_, i) => i / 100)
  });

  iframes.forEach(iframe => observer.observe(iframe));
});