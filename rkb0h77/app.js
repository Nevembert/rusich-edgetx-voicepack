(() => {
  'use strict';

  const tracks = globalThis.rickDroneCatalog;
  const pageSize = 12;
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#search');
  const list = document.querySelector('#track-list');
  const results = document.querySelector('#results');
  const empty = document.querySelector('#empty');
  const moreArea = document.querySelector('#more-area');
  const audioStatus = document.querySelector('#audio-status');
  const player = document.querySelector('#player');

  let filter = 'all';
  let visibleCount = pageSize;
  let activeFile = null;
  let playRequest = 0;

  function assetPath(path) {
    const parts = path.split('/');
    if (!parts.every((part) => /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(part))) {
      throw new Error('Invalid local asset path');
    }
    return parts.join('/');
  }

  function updatePlayerButtons() {
    for (const button of list.querySelectorAll('.play')) {
      const playing = button.dataset.file === activeFile && !player.paused && !player.ended;
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', (playing ? 'Пауза · ' : 'Прослушать · ') + button.dataset.title);
      button.textContent = playing ? 'Ⅱ' : '▶';
    }
  }

  function reportAudioError() {
    audioStatus.textContent = 'Запись не загрузилась. Попробуй запустить её ещё раз.';
    updatePlayerButtons();
  }

  async function playTrack(track) {
    const request = ++playRequest;
    audioStatus.textContent = '';
    if (activeFile === track.file && !player.paused && !player.ended) {
      player.pause();
      return;
    }

    if (activeFile !== track.file || player.error) {
      player.pause();
      player.src = assetPath('SOUNDS/ru/' + track.file);
      activeFile = track.file;
    }

    try {
      await player.play();
    } catch (error) {
      if (request === playRequest && error.name !== 'AbortError') reportAudioError();
    }
  }

  function makeTrack(track, index) {
    const item = document.createElement('li');
    item.className = 'track';
    item.tabIndex = -1;

    const number = document.createElement('span');
    number.className = 'track-number';
    number.textContent = String(index + 1).padStart(2, '0');

    const details = document.createElement('div');
    const text = document.createElement('p');
    text.className = 'track-text';
    text.textContent = track.text;

    const meta = document.createElement('p');
    meta.className = 'track-meta';
    const event = document.createElement('span');
    event.textContent = track.event;
    const file = document.createElement('code');
    file.textContent = track.file;
    meta.append(event, file);
    details.append(text, meta);
    item.append(number, details);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'play';
    button.dataset.file = track.file;
    button.dataset.title = track.text;
    button.addEventListener('click', () => playTrack(track));
    item.append(button);
    return item;
  }

  function normalize(value) {
    return value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  }

  function renderTracks() {
    const query = normalize(search.value);
    const matched = tracks.map((track, index) => ({ track, index })).filter(({ track }) => {
      const kind = track.file.startsWith('SYSTEM/') ? 'system' : 'custom';
      return (filter === 'all' || kind === filter)
        && normalize(track.text + ' ' + track.event + ' ' + track.file).includes(query);
    });

    list.replaceChildren(...matched.slice(0, visibleCount).map(({ track, index }) => makeTrack(track, index)));
    results.textContent = 'Найдено ' + matched.length + ' из ' + tracks.length;
    empty.hidden = matched.length > 0;
    moreArea.hidden = matched.length <= visibleCount;
    updatePlayerButtons();
  }

  for (const button of filterButtons) {
    button.addEventListener('click', () => {
      filter = button.dataset.filter;
      for (const candidate of filterButtons) {
        candidate.setAttribute('aria-pressed', String(candidate === button));
      }
      visibleCount = pageSize;
      renderTracks();
    });
  }

  search.addEventListener('input', () => {
    visibleCount = pageSize;
    renderTracks();
  });
  document.querySelector('#more').addEventListener('click', () => {
    const firstNewIndex = visibleCount;
    visibleCount += pageSize;
    renderTracks();
    list.children[firstNewIndex]?.focus({ preventScroll: true });
  });
  for (const event of ['play', 'pause', 'ended']) player.addEventListener(event, updatePlayerButtons);
  player.addEventListener('error', () => {
    if (activeFile) reportAudioError();
  });

  renderTracks();
})();
