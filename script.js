const iframes = Array.from(document.querySelectorAll('iframe.video-embed'));
let currentAutoplay = null;
let debounceTimer = null;

// Helper to get base src and build autoplay src
function getBaseSrc(iframe) {
  return iframe.dataset.baseSrc || iframe.src.replace(/(&|\?)autoplay=1/, '');
}
function getAutoplaySrc(iframe) {
  const base = getBaseSrc(iframe);
  return base + (base.includes('?') ? '&' : '?') + 'autoplay=1';
}

function setAutoplay(iframe) {
  if (currentAutoplay === iframe) return;
  iframes.forEach(el => {
    if (el === iframe) {
      if (!el.src.includes('autoplay=1')) el.src = getAutoplaySrc(el);
    } else {
      if (el.src.includes('autoplay=1')) el.src = getBaseSrc(el);
    }
  });
  currentAutoplay = iframe;
}

// Debounce function
function debounce(fn, delay) {
  return function(...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Intersection Observer callback
const handleIntersect = debounce((entries) => {
  // Find the entry with the largest intersection ratio above 0.5
  let maxEntry = null;
  let maxRatio = 0.5;
  entries.forEach(entry => {
    if (entry.intersectionRatio > maxRatio) {
      maxRatio = entry.intersectionRatio;
      maxEntry = entry;
    }
  });
  if (maxEntry && maxEntry.isIntersecting) {
    setAutoplay(maxEntry.target);
  }
}, 100);

const observer = new IntersectionObserver(handleIntersect, {
  threshold: Array.from({length: 101}, (_, i) => i / 100)
});

iframes.forEach(iframe => observer.observe(iframe));