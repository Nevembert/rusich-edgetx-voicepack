const tracks = [
  { file: "SYSTEM/hello.wav", kind: "system", title: "К полёту всё готово, су́дарь. С Богом!", tag: "Приветствие" },
  { file: "SYSTEM/thralert.wav", kind: "system", title: "Соизвольте убрать рычаг газа, су́дарь.", tag: "Газ" },
  { file: "SYSTEM/swalert.wav", kind: "system", title: "Проверьте положение переключателей, су́дарь.", tag: "Переключатели" },
  { file: "SYSTEM/lowbatt.wav", kind: "system", title: "Батарея пульта слабеет, су́дарь.", tag: "Питание пульта" },
  { file: "SYSTEM/inactiv.wav", kind: "system", title: "Пульт оставлен без внимания, су́дарь.", tag: "Бездействие" },
  { file: "SYSTEM/eebad.wav", kind: "system", title: "Обнаружена ошибка памяти, су́дарь.", tag: "Память" },
  { file: "SYSTEM/rssi_org.wav", kind: "system", title: "Сигнал ослаб, су́дарь.", tag: "RSSI" },
  { file: "SYSTEM/rssi_red.wav", kind: "system", title: "Сигнал крайне слаб, су́дарь!", tag: "RSSI" },
  { file: "SYSTEM/swr_red.wav", kind: "system", title: "Неладно с антенной, су́дарь!", tag: "Антенна" },
  { file: "SYSTEM/telemco.wav", kind: "system", title: "Телеметрия подключена, су́дарь.", tag: "Телеметрия" },
  { file: "SYSTEM/telemko.wav", kind: "system", title: "Телеметрия потеряна, су́дарь!", tag: "Телеметрия" },
  { file: "SYSTEM/telemok.wav", kind: "system", title: "Телеметрия восстановлена, су́дарь.", tag: "Телеметрия" },
  { file: "SYSTEM/trainco.wav", kind: "system", title: "Тренер подключён, су́дарь.", tag: "Тренер" },
  { file: "SYSTEM/trainko.wav", kind: "system", title: "Сигнал тренера потерян, су́дарь.", tag: "Тренер" },
  { file: "SYSTEM/trainok.wav", kind: "system", title: "Сигнал тренера восстановлен, су́дарь.", tag: "Тренер" },
  { file: "SYSTEM/sensorko.wav", kind: "system", title: "Датчик более недоступен, су́дарь.", tag: "Датчик" },
  { file: "SYSTEM/servoko.wav", kind: "system", title: "Сервопривод перегружен, су́дарь.", tag: "Сервопривод" },
  { file: "SYSTEM/rxko.wav", kind: "system", title: "Приёмник перегружен, су́дарь.", tag: "Приёмник" },
  { file: "SYSTEM/modelpwr.wav", kind: "system", title: "Приёмник всё ещё включён, су́дарь.", tag: "Питание модели" },
  { file: "SYSTEM/midtrim.wav", kind: "system", title: "Триммер установлен по центру, су́дарь.", tag: "Триммер" },
  { file: "SYSTEM/maxtrim.wav", kind: "system", title: "Триммер достиг верхнего предела, су́дарь.", tag: "Триммер" },
  { file: "SYSTEM/mintrim.wav", kind: "system", title: "Триммер достиг нижнего предела, су́дарь.", tag: "Триммер" },
  { file: "SYSTEM/timovr1.wav", kind: "system", title: "Время первого таймера истекло, су́дарь.", tag: "Таймер" },
  { file: "SYSTEM/timovr2.wav", kind: "system", title: "Время второго таймера истекло, су́дарь.", tag: "Таймер" },
  { file: "SYSTEM/timovr3.wav", kind: "system", title: "Время третьего таймера истекло, су́дарь.", tag: "Таймер" },

  { file: "armed.wav", kind: "custom", title: "Аппарат вооружён, су́дарь. Летите с Богом!", tag: "Арминг" },
  { file: "disarm.wav", kind: "custom", title: "Аппарат обезоружен, су́дарь.", tag: "Арминг" },
  { file: "airmon.wav", kind: "custom", title: "Воздушный режим включён, су́дарь.", tag: "Air mode" },
  { file: "airmof.wav", kind: "custom", title: "Воздушный режим выключен, су́дарь.", tag: "Air mode" },
  { file: "batcrt.wav", kind: "custom", title: "Критический разряд батареи, су́дарь!", tag: "Батарея" },
  { file: "lowbat.wav", kind: "custom", title: "Бортовая батарея слабеет, су́дарь.", tag: "Батарея" },
  { file: "siglow.wav", kind: "custom", title: "Уровень сигнала низок, су́дарь.", tag: "Сигнал" },
  { file: "sigcrt.wav", kind: "custom", title: "Уровень сигнала критический, су́дарь!", tag: "Сигнал" },
  { file: "fson.wav", kind: "custom", title: "Аварийный режим включён, су́дарь!", tag: "Failsafe" },
  { file: "fsoff.wav", kind: "custom", title: "Аварийный режим выключен, су́дарь.", tag: "Failsafe" },
  { file: "gps.wav", kind: "custom", title: "Система навигации включена, су́дарь.", tag: "GPS" },
  { file: "satfix.wav", kind: "custom", title: "Спутники найдены, су́дарь.", tag: "GPS" },
  { file: "satlst.wav", kind: "custom", title: "Спутники потеряны, су́дарь!", tag: "GPS" },
  { file: "flttm.wav", kind: "custom", title: "Время полёта, су́дарь.", tag: "Телеметрия" },
  { file: "tohigh.wav", kind: "custom", title: "Высота чрезмерна, су́дарь.", tag: "Высота" },
  { file: "tolow.wav", kind: "custom", title: "Высота слишком мала, су́дарь!", tag: "Высота" },
  { file: "alt.wav", kind: "custom", title: "Высота, су́дарь.", tag: "Высота" },
  { file: "althld.wav", kind: "custom", title: "Удержание высоты, су́дарь.", tag: "Режим полёта" },
  { file: "hirate.wav", kind: "custom", title: "Высокие расходы включены, су́дарь.", tag: "Расходы" },
  { file: "lorate.wav", kind: "custom", title: "Низкие расходы включены, су́дарь.", tag: "Расходы" },
  { file: "ledon.wav", kind: "custom", title: "Бортовые огни включены, су́дарь.", tag: "Освещение" },
  { file: "ledoff.wav", kind: "custom", title: "Бортовые огни выключены, су́дарь.", tag: "Освещение" },
  { file: "fm-acr.wav", kind: "custom", title: "Режим акро, су́дарь.", tag: "Режим полёта" },
  { file: "fm-ang.wav", kind: "custom", title: "Режим стабилизации, су́дарь.", tag: "Режим полёта" },
  { file: "fm-hor.wav", kind: "custom", title: "Режим горизонта, су́дарь.", tag: "Режим полёта" },
  { file: "lvlmod.wav", kind: "custom", title: "Режим уровня, су́дарь.", tag: "Режим полёта" },
  { file: "fm-stb.wav", kind: "custom", title: "Стабилизация включена, су́дарь.", tag: "Режим полёта" },
  { file: "fm-man.wav", kind: "custom", title: "Ручное управление, су́дарь.", tag: "Режим полёта" },
  { file: "fm-nrm.wav", kind: "custom", title: "Обычный режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-crs.wav", kind: "custom", title: "Крейсерский режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-lch.wav", kind: "custom", title: "Режим взлёта, су́дарь.", tag: "Режим полёта" },
  { file: "fm-lnd.wav", kind: "custom", title: "Режим посадки, су́дарь.", tag: "Режим полёта" },
  { file: "fm-hld.wav", kind: "custom", title: "Удержание позиции, су́дарь.", tag: "Режим полёта" },
  { file: "fm-rth.wav", kind: "custom", title: "Возвращаемся домой, су́дарь.", tag: "Режим полёта" },
  { file: "fm-1.wav", kind: "custom", title: "Первый полётный режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-2.wav", kind: "custom", title: "Второй полётный режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-3.wav", kind: "custom", title: "Третий полётный режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-4.wav", kind: "custom", title: "Четвёртый полётный режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-5.wav", kind: "custom", title: "Пятый полётный режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-6.wav", kind: "custom", title: "Шестой полётный режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-7.wav", kind: "custom", title: "Седьмой полётный режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-8.wav", kind: "custom", title: "Восьмой полётный режим, су́дарь.", tag: "Режим полёта" },
  { file: "fm-9.wav", kind: "custom", title: "Девятый полётный режим, су́дарь.", tag: "Режим полёта" },
  { file: "gearup.wav", kind: "custom", title: "Шасси убраны, су́дарь.", tag: "Самолёт" },
  { file: "geardn.wav", kind: "custom", title: "Шасси выпущены, су́дарь.", tag: "Самолёт" },
  { file: "flapup.wav", kind: "custom", title: "Закрылки убраны, су́дарь.", tag: "Самолёт" },
  { file: "flapdn.wav", kind: "custom", title: "Закрылки выпущены, су́дарь.", tag: "Самолёт" },
  { file: "splrup.wav", kind: "custom", title: "Интерцепторы убраны, су́дарь.", tag: "Самолёт" },
  { file: "splrdn.wav", kind: "custom", title: "Интерцепторы выпущены, су́дарь.", tag: "Самолёт" },
  { file: "auro.wav", kind: "custom", title: "Авторотация, су́дарь.", tag: "Вертолёт" },
  { file: "trnon.wav", kind: "custom", title: "Режим тренера включён, су́дарь.", tag: "Тренер" },
  { file: "trnoff.wav", kind: "custom", title: "Режим тренера выключен, су́дарь.", tag: "Тренер" }
];

const audio = document.querySelector("#audio");
const player = document.querySelector("#player");
const playerPlay = document.querySelector("#playerPlay");
const playerCode = document.querySelector("#playerCode");
const playerTitle = document.querySelector("#playerTitle");
const progress = document.querySelector("#progress");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const trackList = document.querySelector("#trackList");
const searchInput = document.querySelector("#searchInput");
const emptyState = document.querySelector("#emptyState");

let currentTrack = null;
let filter = "all";

function audioPath(track) {
  return `SOUNDS/ru/${track.file}`;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

function visibleTracks() {
  const query = searchInput.value.trim().toLocaleLowerCase("ru");
  return tracks.filter((track) => {
    const matchesFilter = filter === "all" || track.kind === filter;
    const haystack = `${track.title} ${track.tag} ${track.file}`.toLocaleLowerCase("ru");
    return matchesFilter && haystack.includes(query);
  });
}

function renderTracks() {
  const list = visibleTracks();
  emptyState.hidden = list.length > 0;
  trackList.innerHTML = list.map((track) => {
    const playing = currentTrack?.file === track.file && !audio.paused;
    const filename = track.file.split("/").pop();
    return `
      <button class="track${playing ? " playing" : ""}" type="button" data-file="${track.file}">
        <span class="track-play" aria-hidden="true">${playing ? "Ⅱ" : "▶"}</span>
        <span class="track-main">
          <strong>${track.title}</strong>
          <span>${track.tag}</span>
        </span>
        <span class="track-file">${filename}</span>
        <span class="track-kind ${track.kind}">${track.kind === "system" ? "Система" : "Назначаемая"}</span>
      </button>`;
  }).join("");
}

function selectTrack(track, forcePlay = true) {
  if (!track) return;
  const isSame = currentTrack?.file === track.file;
  currentTrack = track;
  playerCode.textContent = track.file;
  playerTitle.textContent = track.title;
  player.classList.add("visible");

  if (!isSame) {
    audio.src = audioPath(track);
    audio.load();
  }

  if (forcePlay) {
    if (isSame && !audio.paused) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }
  renderTracks();
}

trackList.addEventListener("click", (event) => {
  const row = event.target.closest(".track");
  if (!row) return;
  selectTrack(tracks.find((track) => track.file === row.dataset.file));
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
    renderTracks();
  });
});

searchInput.addEventListener("input", renderTracks);

document.querySelector("#heroPlay").addEventListener("click", () => {
  selectTrack(tracks.find((track) => track.file === "SYSTEM/hello.wav"));
});

playerPlay.addEventListener("click", () => {
  if (!currentTrack) {
    selectTrack(tracks[0]);
  } else if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
});

document.querySelector("#playerClose").addEventListener("click", () => {
  audio.pause();
  player.classList.remove("visible");
  renderTracks();
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = (progress.value / 1000) * audio.duration;
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);
  progress.value = audio.duration ? Math.round((audio.currentTime / audio.duration) * 1000) : 0;
});

["play", "pause", "ended"].forEach((eventName) => {
  audio.addEventListener(eventName, () => {
    const playing = !audio.paused;
    playerPlay.querySelector("span").textContent = playing ? "Ⅱ" : "▶";
    playerPlay.setAttribute("aria-label", playing ? "Пауза" : "Воспроизвести");
    renderTracks();
  });
});

renderTracks();
