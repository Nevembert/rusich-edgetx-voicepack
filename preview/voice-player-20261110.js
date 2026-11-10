// Каждая карточка содержит собственный список примеров. Для новой озвучки добавьте объект в voicepacks.
const voicepacks=[
 {id:'rusich',name:'Русич',subtitle:'КЛАССИЧЕСКАЯ ОЗВУЧКА',symbol:'Р',description:'Голос с характером для каждого полёта.',tracks:[
  ['К полёту всё готово, су́дарь. С Богом!','assets/hello.mp3'],['Аппарат вооружён, су́дарь. Летите с Богом!','assets/armed.mp3'],['Режим стабилизации, су́дарь.','assets/angle.mp3'],['Батарея пульта слабеет, су́дарь.','assets/battery.mp3'],['Телеметрия потеряна, су́дарь!','assets/telemetry.mp3']]},
 {id:'arc-short',name:'Арк Варден',subtitle:'КОРОТКАЯ ВЕРСИЯ · ЗЕТ: РАСКОЛ',symbol:'✦',description:'Лаконичные фразы для быстрых уведомлений.',tracks:[
  ['Самость пробудилась.','assets/arc-short-hello.mp3'],['Режим акро.','assets/arc-short-acro.mp3'],['Режим энгл.','assets/arc-short-angle.mp3'],['Заряд пульта низкий.','assets/arc-short-battery.mp3'],['Телеметрия потеряна.','assets/arc-short-telemetry.mp3']]},
 {id:'arc-full',name:'Арк Варден',subtitle:'ПОЛНАЯ ВЕРСИЯ · ЗЕТ: РАСКОЛ',symbol:'✧',description:'Более длинные фразы с атмосферой персонажа.',tracks:[
  ['Самость пробудилась.','assets/arc-full-hello.mp3'],['Режим акро. Самость надеется, что ты за пультом.','assets/arc-full-acro.mp3'],['Режим энгл. Самость подстрахует.','assets/arc-full-angle.mp3'],['Заряд пульта низкий. Самость слабеет.','assets/arc-full-battery.mp3'],['Телеметрия потеряна. Самость скрылась.','assets/arc-full-telemetry.mp3']]},
 {
  id: 'rick',
  name: 'Рик-дроновод',
  subtitle: 'ПОЛНАЯ ВЕРСИЯ · 77 РЕПЛИК',
  symbol: '✳',
  description: 'Порталы, огурчик Рик и команды для полёта.',
  tracks: [
   ['Вабба-лабба-даб-даб! Пульт готов, Морти. Открывай портал!', 'assets/rick-hello.wav'],
   ['Дизарм. Всё, я огурчик!', 'assets/rick-disarm.wav'],
   ['Акро. Запасной дрон в соседней вселенной.', 'assets/rick-acro.wav'],
   ['Шасси выпущены. Смотри, Морти, я нога!', 'assets/rick-gear.wav'],
   ['Низкий заряд пульта, Морти.', 'assets/rick-battery.wav']
  ]
 }
];
const audio=document.querySelector('#audio');const grid=document.querySelector('#voiceGrid');const positions=Object.fromEntries(voicepacks.map(p=>[p.id,0]));let active=null;let serial=0;
function renderCards(){grid.innerHTML='';voicepacks.forEach((pack,index)=>{const card=document.createElement('article');card.className='voice-tile '+(pack.id.startsWith('arc')?'arc-tile':pack.id+'-tile');card.innerHTML=`<div class="tile-top"><span>0${index+1} / VOICE PACK</span><span class="tile-icon">${pack.symbol}</span></div><p class="tile-subtitle">${pack.subtitle}</p><h3>${pack.name}<span>.</span></h3><p class="tile-description">${pack.description}</p><button type="button" class="listen-button" data-pack="${pack.id}" aria-label="Послушать ${pack.name}, ${pack.subtitle}"><span class="listen-play">▶</span><span>СЛУШАТЬ ФРАЗУ</span><span class="listen-arrow">↗</span></button><div class="phrase-line"><span>ФРАЗА <b data-count="${pack.id}">1 / ${pack.tracks.length}</b></span><p data-text="${pack.id}" aria-live="polite"></p></div><p class="tile-hint">Нажми ещё раз — услышишь следующую</p>`;card.querySelector('[data-text]').textContent=pack.tracks[0][0];grid.append(card)});}
function updateCard(id){const pack=voicepacks.find(x=>x.id===id);const button=grid.querySelector(`[data-pack="${id}"]`);const playing=active===id;button.classList.toggle('playing',playing);button.querySelector('.listen-play').textContent=playing?'◼':'▶';button.querySelectorAll('span')[1].textContent=playing?'ВОСПРОИЗВОДИТСЯ':'СЛУШАТЬ ФРАЗУ';button.setAttribute('aria-pressed',String(playing));grid.querySelector(`[data-count="${id}"]`).textContent=`${positions[id]+1} / ${pack.tracks.length}`;grid.querySelector(`[data-text="${id}"]`).textContent=pack.tracks[positions[id]][0]}
renderCards();grid.addEventListener('click',async e=>{const button=e.target.closest('button[data-pack]');if(!button)return;const id=button.dataset.pack;if(active===id)return;const old=active;const n=++serial;audio.pause();active=id;if(old)updateCard(old);updateCard(id);const pack=voicepacks.find(p=>p.id===id);audio.src=pack.tracks[positions[id]][1];try{await audio.play()}catch{if(n!==serial)return;active=null;updateCard(id);const hint=button.closest('.voice-tile').querySelector('.tile-hint');hint.textContent='Не удалось воспроизвести. Попробуй нажать ещё раз.'}});
audio.addEventListener('ended',()=>{if(!active)return;const id=active;const pack=voicepacks.find(p=>p.id===id);positions[id]=(positions[id]+1)%pack.tracks.length;active=null;updateCard(id)});audio.addEventListener('error',()=>{if(!active)return;const id=active;active=null;updateCard(id);grid.querySelector(`[data-pack="${id}"]`).closest('.voice-tile').querySelector('.tile-hint').textContent='Не удалось загрузить звук. Попробуй ещё раз.'});
const dialog=document.querySelector('#orderDialog');document.querySelector('#openOrder').onclick=()=>dialog.showModal();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});async function copy(text){try{await navigator.clipboard.writeText(text);document.querySelector('#feedback').textContent='Скопировано!'}catch{document.querySelector('#feedback').textContent='Не удалось скопировать автоматически — выделите текст вручную.'}}document.querySelector('#copyPhone').onclick=()=>copy('+79966348865');document.querySelector('#copyOrder').onclick=()=>{const chosen=[...dialog.querySelectorAll('input:checked')].map(x=>x.value);if(!chosen.length){document.querySelector('#feedback').textContent='Сначала выбери хотя бы одну озвучку.';return}copy(`Здравствуйте! Интересует озвучка: ${chosen.join(', ')}.${chosen.length>1?' Подскажите стоимость с учётом скидки 10%.':' Подскажите стоимость.'}`)};
