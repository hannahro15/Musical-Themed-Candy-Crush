import { showElement, hideElement, announce } from '../src/utils.js';

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

  test('showElement does not throw if element is undefined', () => {
    expect(() => showElement(undefined)).not.toThrow();
  });

  test('hideElement does not throw if element is undefined', () => {
    expect(() => hideElement(undefined)).not.toThrow();
  });

  test('showElement can show an already-visible element without error', () => {
    const el = document.createElement('div');
    expect(() => showElement(el)).not.toThrow();
    expect(el.classList.contains('hidden')).toBe(false);
  });

  test('hideElement can hide an already-hidden element without error', () => {
    const el = document.createElement('div');
    el.classList.add('hidden');
    expect(() => hideElement(el)).not.toThrow();
    expect(el.classList.contains('hidden')).toBe(true);
  });
});

describe('announce', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="sr-announcer" aria-live="polite"></div>';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('announce sets announcer text after timeout', () => {
    const announcer = document.getElementById('sr-announcer');
    announce('Level complete!');
    jest.runAllTimers();
    expect(announcer.textContent).toBe('Level complete!');
  });

  test('announce clears announcer text before setting new message', () => {
    const announcer = document.getElementById('sr-announcer');
    announcer.textContent = 'old message';
    announce('New message');
    expect(announcer.textContent).toBe('');
    jest.runAllTimers();
    expect(announcer.textContent).toBe('New message');
  });

  test('announce does nothing if sr-announcer element is missing', () => {
    document.body.innerHTML = '';
    expect(() => announce('test')).not.toThrow();
  });

  test('announce does nothing if message is empty string', () => {
    const announcer = document.getElementById('sr-announcer');
    announcer.textContent = 'existing';
    announce('');
    jest.runAllTimers();
    expect(announcer.textContent).toBe('existing');
  });

  test('announce does nothing if message is null', () => {
    const announcer = document.getElementById('sr-announcer');
    announcer.textContent = 'existing';
    announce(null);
    jest.runAllTimers();
    expect(announcer.textContent).toBe('existing');
  });
});
