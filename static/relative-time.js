const UNITS = {
  year: 365 * 24 * 60 * 60 * 1000,
  month: (365 * 24 * 60 * 60 * 1000) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const now = Date.now();
const relativeTimeFormat = new Intl.RelativeTimeFormat(navigator.languages, { numeric: 'auto' });

function getRelativeTime(when) {
  const elapsed = when - now;

  // Loop through the units to find the largest applicable unit
  for (const [unit, value] of Object.entries(UNITS)) {
    if (Math.abs(elapsed) >= value || unit === 'second') {
      return relativeTimeFormat.format(Math.round(elapsed / value), unit);
    }
  }
}

document.querySelectorAll('.js-relative-time').forEach((timeElement) => {
  const publishDate = new Date(timeElement.getAttribute('datetime')).getTime();
  timeElement.textContent = getRelativeTime(publishDate);
});