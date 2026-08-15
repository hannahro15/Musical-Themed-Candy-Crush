// utils.js - General utility functions

export function showElement(element) {
  if (element) {
    element.classList.remove('hidden');
  }
}


export function hideElement(element) {
  if (element) {
    element.classList.add('hidden');
  }
}

/**
 * Announces a message to screen-reader users via the hidden #sr-announcer
 * live region. Clears the region first so repeated identical messages are
 * still announced (aria-live only fires on content change).
 * @param {string} message
 */
export function announce(message) {
  const announcer = document.getElementById('sr-announcer');
  if (!announcer || !message) return;
  announcer.textContent = '';
  // Force a reflow/microtask so identical consecutive messages re-announce.
  window.setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}
