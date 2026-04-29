// utils.js - General utility functions

export function showElement(element) {
  if (element) element.classList.remove('hidden');
}

export function hideElement(element) {
  if (element) element.classList.add('hidden');
}
