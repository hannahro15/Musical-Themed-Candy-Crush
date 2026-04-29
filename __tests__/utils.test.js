import { showElement, hideElement } from '../src/utils.js';

describe('utils', () => {
  test('showElement removes hidden class', () => {
    const el = document.createElement('div');
    el.classList.add('hidden');
    showElement(el);
    expect(el.classList.contains('hidden')).toBe(false);
  });

  test('hideElement adds hidden class', () => {
    const el = document.createElement('div');
    hideElement(el);
    expect(el.classList.contains('hidden')).toBe(true);
  });

  test('showElement does nothing if element is null', () => {
    expect(() => showElement(null)).not.toThrow();
  });

  test('hideElement does nothing if element is null', () => {
    expect(() => hideElement(null)).not.toThrow();
  });
});
