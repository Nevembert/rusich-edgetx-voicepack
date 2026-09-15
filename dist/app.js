(() => {
  'use strict';
  const pack = window.VOICEPACK;
  if (!pack || !Array.isArray(pack.tracks)) return;
  const $ = (selector) => document.querySelector(selector);
  const list = $('#trackList');
  const search = $('#search');
  const audio = $('#audio');
  const player = $('#player');
  let filter = 'all';
  let current = null;
  let toastTimer;
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalize = (value) => value.toLocaleLowerCase('ru').replace(/ё/g, 'е');
  const soundUrl = (track) => 'SOUNDS/ru/' + track.file.split('/').map(encodeURIComponent).join('/');

  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.append(area);
        const previous = document.activeElement;
        area.select();
        const copied = document.execCommand('copy');
        area.remove();
        if (previous instanceof HTMLElement) previous.focus();
        if (!copied) throw new Error('copy failed');
      }
      notify('Фраза скопирована');
    } catch {
      notify('Не удалось скопировать. Выдели текст фразы вручную.');
    }
  }

  function visibleTracks() {
    const query = normalize(search.value.trim());
    return pack.tracks.filter((track) => {
      const category = filter === 'all' || (filter === 'alerts' ? track.priority !== 'normal' : track.kind === filter);
      return category && normalize(track.text + ' ' + track.tag + ' ' + track.file).includes(query);
    });
  }

  function render() {
    const tracks = visibleTracks();
    $('#resultCount').textContent = `Найдено: ${tracks.length} из ${pack.tracks.length}`;
    $('#empty').hidden = tracks.length > 0;
    list.innerHTML = tracks.map((track) => {
      const index = pack.tracks.indexOf(track) + 1;
      const priority = track.priority === 'critical' ? '<span class="track-priority">Критическое уведомление</span>' : '';
      const playing = current === track.file && !audio.paused;
      return `<article class="track" data-file="${escape(track.file)}">
        <span class="track-index">${String(index).padStart(2, '0')}</span>
        <div class="track-main"><p class="track-text">${escape(track.text)}</p>${priority}</div>
        <div class="track-meta"><span class="track-tag">${escape(track.tag)}</span><span class="track-file">${escape(track.file)}</span></div>
        <div class="track-actions">
          <button type="button" class="copy" data-action="copy" aria-label="Копировать: ${escape(track.text)}">Копировать</button>
          <button type="button" class="play" data-action="play" ${track.available ? '' : 'disabled'} title="${track.available ? 'Прослушать запись' : 'Голос ещё не записан'}" aria-label="${track.available ? 'Прослушать: ' + escape(track.text) : 'Запись ещё не готова'}">${playing ? 'Ⅱ' : '▶'}</button>
          ${track.available ? `<a class="wav-link" href="${soundUrl(track)}" download aria-label="Скачать ${escape(track.file)}">↓</a>` : ''}
        </div></article>`;
    }).join('');
  }

  async function playTrack(track) {
    if (!track.available) return;
    if (current === track.file && !audio.paused) { audio.pause(); return; }
    if (current !== track.file) {
      audio.src = soundUrl(track);
      current = track.file;
      $('#playerTitle').textContent = track.text;
      $('#playerFile').textContent = track.file;
    }
    player.hidden = false;
    try { await audio.play(); }
    catch { notify('Не удалось воспроизвести запись. Попробуй скачать WAV.'); }
  }

  list.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const row = button.closest('[data-file]');
    const track = pack.tracks.find((item) => item.file === row.dataset.file);
    if (!track) return;
    if (button.dataset.action === 'copy') copyText(track.text);
    else playTrack(track);
  });
  document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  }));
  search.addEventListener('input', render);
  ['play', 'pause', 'ended'].forEach((name) => audio.addEventListener(name, () => {
    // Update only play icons so keyboard focus and active copy controls remain intact.
    list.querySelectorAll('.track').forEach((row) => {
      row.querySelector('.play').textContent = current === row.dataset.file && !audio.paused ? 'Ⅱ' : '▶';
    });
  }));
  audio.addEventListener('error', () => { if (current) notify('Запись недоступна. Обнови страницу или скачай WAV.'); });
  $('#closePlayer').addEventListener('click', () => { audio.pause(); player.hidden = true; });
  $('#readyCount').textContent = `${pack.ready} / ${pack.tracks.length}`;
  if (pack.ready > 0) {
    $('#packStatus').textContent = pack.complete ? 'Все записи готовы к установке' : `Записано ${pack.ready} фраз · подготовка продолжается`;
    $('#catalogNote').textContent = pack.complete ? 'Прослушай реплики и скачай весь пакет или отдельные WAV.' : 'Готовые записи можно прослушать. Остальные реплики ожидают озвучки.';
  }
  if (pack.complete && pack.release) {
    $('#releaseLink').href = pack.release;
    $('#releaseLink').hidden = false;
    $('#releasePending').hidden = true;
    $('#downloadNote').textContent = 'Все записи прошли техническую проверку. Перед первым полётом проверь звучание и срабатывание уведомлений на своём пульте.';
  }
  render();
})();
