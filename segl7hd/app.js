(() => {
  'use strict';
  let pack = window.VOICEPACK;
  if (!pack || !Array.isArray(pack.tracks)) return;
  const editions = { full: window.VOICEPACK, short: window.VOICEPACK_SHORT };
  let edition = 'full';
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
  const shortRevision = () => '?v=' + encodeURIComponent(editions.short.version);
  const soundUrl = (track) => (edition === 'short' ? 'short/' : '') + 'SOUNDS/ru/' + track.file.split('/').map(encodeURIComponent).join('/') + (edition === 'short' ? shortRevision() : '');
  const groups = [
    { id: 'radio', title: 'Пульт и подготовка', files: ['SYSTEM/hello.wav','SYSTEM/thralert.wav','SYSTEM/swalert.wav','SYSTEM/lowbatt.wav','SYSTEM/inactiv.wav','SYSTEM/eebad.wav','SYSTEM/modelpwr.wav'] },
    { id: 'motors', title: 'Моторы и воздушный режим', files: ['armed.wav','disarm.wav','airmon.wav','airmof.wav'] },
    { id: 'link', title: 'Связь и телеметрия', files: ['SYSTEM/rssi_org.wav','SYSTEM/rssi_red.wav','SYSTEM/swr_red.wav','SYSTEM/telemco.wav','SYSTEM/telemko.wav','SYSTEM/telemok.wav','siglow.wav','sigcrt.wav','fson.wav','fsoff.wav'] },
    { id: 'power', title: 'Питание и оборудование', files: ['batcrt.wav','lowbat.wav','SYSTEM/sensorko.wav','SYSTEM/servoko.wav','SYSTEM/rxko.wav'] },
    { id: 'navigation', title: 'Навигация и высота', files: ['gps.wav','satfix.wav','satlst.wav','tohigh.wav','tolow.wav','alt.wav','althld.wav'] },
    { id: 'flight', title: 'Полётные режимы', files: ['fm-acr.wav','fm-ang.wav','fm-hor.wav','lvlmod.wav','fm-stb.wav','fm-man.wav','fm-nrm.wav','fm-crs.wav','fm-lch.wav','fm-lnd.wav','fm-hld.wav','fm-rth.wav'] },
    { id: 'numbered', title: 'Нумерованные режимы', files: ['fm-1.wav','fm-2.wav','fm-3.wav','fm-4.wav','fm-5.wav','fm-6.wav','fm-7.wav','fm-8.wav','fm-9.wav'] },
    { id: 'timers', title: 'Таймеры и время полёта', files: ['SYSTEM/timovr1.wav','SYSTEM/timovr2.wav','SYSTEM/timovr3.wav','flttm.wav'] },
    { id: 'controls', title: 'Настройки и освещение', files: ['SYSTEM/midtrim.wav','SYSTEM/maxtrim.wav','SYSTEM/mintrim.wav','hirate.wav','lorate.wav','ledon.wav','ledoff.wav'] },
    { id: 'aircraft', title: 'Самолёт и вертолёт', files: ['gearup.wav','geardn.wav','flapup.wav','flapdn.wav','splrup.wav','splrdn.wav','auro.wav'] },
    { id: 'trainer', title: 'Тренер', files: ['SYSTEM/trainco.wav','SYSTEM/trainko.wav','SYSTEM/trainok.wav','trnon.wav','trnoff.wav'] }
  ];
  const groupedFiles = new Set(groups.flatMap((group) => group.files));
  const extras = pack.tracks.filter((track) => !groupedFiles.has(track.file));
  if (extras.length) groups.push({ id: 'other', title: 'Дополнительные фразы', files: extras.map((track) => track.file) });

  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
  }

  async function copyText(text, message = 'Фраза скопирована') {
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
      notify(message);
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
    function renderRow(track) {
      const index = pack.tracks.indexOf(track) + 1;
      const priority = track.priority === 'critical' ? '<span class="track-priority">Критическое уведомление</span>' : '';
      const playing = current === track.file && !audio.paused;
      return `<article class="track" data-file="${escape(track.file)}">
        <span class="track-index">${String(index).padStart(2, '0')}</span>
        <div class="track-main"><p class="track-text">${escape(track.text)}</p>${priority}</div>
        <div class="track-meta"><span class="track-tag">${escape(track.tag)}</span><span class="track-file">${escape(track.file)}</span>${track.available && Number.isFinite(track.duration) ? `<span class="track-duration">${track.duration.toLocaleString('ru-RU', {maximumFractionDigits: 1})} сек.</span>` : ''}</div>
        <div class="track-actions">
          <button type="button" class="copy" data-action="copy" aria-label="Копировать: ${escape(track.text)}">Копировать</button>
          <button type="button" class="play" data-action="play" ${track.available ? '' : 'disabled'} aria-pressed="${playing}" title="${playing ? 'Пауза' : 'Прослушать запись'}" aria-label="${playing ? 'Пауза: ' : 'Прослушать: '}${escape(track.text)}">${playing ? 'Ⅱ' : '▶'}</button>
          ${track.available ? `<a class="wav-link" href="${soundUrl(track)}" download aria-label="Скачать ${escape(track.file)}">↓</a>` : ''}
        </div></article>`;
    }
    list.innerHTML = groups.map((group) => {
      const groupTracks = tracks.filter((track) => group.files.includes(track.file));
      if (!groupTracks.length) return '';
      return `<section class="phrase-group" aria-labelledby="group-${group.id}">
        <header class="group-heading"><h3 id="group-${group.id}">${escape(group.title)} <span>${groupTracks.length}</span></h3>
          <button class="copy-group" type="button" data-action="copy-group" data-group="${group.id}" aria-label="Копировать все показанные фразы: ${escape(group.title)}">Копировать группу</button>
        </header>${groupTracks.map(renderRow).join('')}</section>`;
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
    if (button.dataset.action === 'copy-group') {
      const group = groups.find((item) => item.id === button.dataset.group);
      if (!group) return;
      const tracks = visibleTracks().filter((track) => group.files.includes(track.file));
      if (tracks.length) copyText(tracks.map((track) => track.text).join('\n'), `Скопировано фраз: ${tracks.length}`);
      return;
    }
    const row = button.closest('[data-file]');
    if (!row) return;
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
      const playing = current === row.dataset.file && !audio.paused;
      const button = row.querySelector('.play');
      button.textContent = playing ? 'Ⅱ' : '▶';
      button.setAttribute('aria-pressed', String(playing));
      button.title = playing ? 'Пауза' : 'Прослушать запись';
      button.setAttribute('aria-label', `${playing ? 'Пауза' : 'Прослушать'}: ${row.querySelector('.track-text').textContent}`);
    });
  }));
  audio.addEventListener('error', () => { if (current) notify('Запись недоступна. Обнови страницу или скачай WAV.'); });
  $('#closePlayer').addEventListener('click', () => { audio.pause(); player.hidden = true; });

  function selectEdition(value) {
    if (!Object.hasOwn(editions, value) || !editions[value] || !Array.isArray(editions[value].tracks)) return;
    current = null;
    audio.pause();
    audio.removeAttribute('src');
    player.hidden = true;
    edition = value;
    pack = editions[edition];
    const short = edition === 'short';
    document.querySelectorAll('[data-edition]').forEach((button) => {
      const active = button.dataset.edition === edition;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#readyCount').textContent = `${pack.ready} / ${pack.tracks.length}`;
    $('#packStatus').textContent = short ? 'Короткая версия · готова к установке' : 'Полная версия · готова к установке';
    $('#catalogTitle').textContent = short ? 'Коротко. По существу.' : 'Его воля. Твой полёт.';
    $('#catalogNote').textContent = short ? 'Тот же голос, только основная фраза. Короткие команды с мягким затуханием и сохранённым эхом.' : 'Полные записи с комментариями Самости. Слушай, копируй и скачивай.';
    $('#phrasesLink').href = short ? 'short/PHRASES.md' : 'PHRASES.md';
    const durations = pack.tracks.filter((track) => Number.isFinite(track.duration)).map((track) => track.duration);
    $('#editionSummary').textContent = durations.length ? `77 записей · в среднем ${(durations.reduce((sum, n) => sum + n, 0) / durations.length).toLocaleString('ru-RU', { maximumFractionDigits: 1 })} сек. на фразу` : '';
    const release = short ? 'ArcWarden_EdgeTX_ru_short.zip' + shortRevision() : 'ArcWarden_EdgeTX_ru.zip';
    ['#releaseLink', '#catalogReleaseLink'].forEach((id) => {
      $(id).href = release;
      $(id).textContent = short ? 'Скачать короткую озвучку ↓' : 'Скачать полную озвучку ↓';
      $(id).hidden = !pack.complete;
    });
    $('#otherReleaseLink').href = short ? 'ArcWarden_EdgeTX_ru.zip' : 'ArcWarden_EdgeTX_ru_short.zip' + shortRevision();
    $('#otherReleaseLink').textContent = short ? 'Скачать полную озвучку ↓' : 'Скачать короткую озвучку ↓';
    $('#releasePending').hidden = Boolean(pack.complete);
    $('#downloadNote').textContent = 'Выбери полную или короткую версию. Имена файлов совпадают, поэтому назначения на пульте сохранятся при замене пакета.';
    render();
  }
  document.querySelectorAll('[data-edition]').forEach((button) => button.addEventListener('click', () => {
    selectEdition(button.dataset.edition);
    history.replaceState(null, '', edition === 'short' ? '#short' : '#catalog');
  }));
  window.addEventListener('hashchange', () => {
    if (location.hash === '#short') selectEdition('short');
    else if (location.hash === '#catalog') selectEdition('full');
  });
  selectEdition(location.hash === '#short' ? 'short' : 'full');
})();
