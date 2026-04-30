// utils.js - General utility functions


export function showElement(element) {
  if (element) {
    element.classList.remove('hidden');
    console.log('[showElement]', element.id || element.className, 'now visible');
  }
}


export function hideElement(element) {
  if (element) {
    element.classList.add('hidden');
    console.log('[hideElement]', element.id || element.className, 'now hidden');
  }
}
