window.VOICEPACK = {
  "name": "ЗЕТ: Раскол",
  "slug": "arcwarden-edgetx-voicepack",
  "version": "0.1.0-draft",
  "language": "ru",
  "status": "awaiting_voice",
  "voice_status": "Голос ещё не записан. Тексты — новые реплики для пульта, а не цитаты из игры.",
  "base_repository": "https://github.com/Nevembert/rusich-edgetx-voicepack",
  "repository_url": "https://github.com/Nevembert/rusich-edgetx-voicepack/tree/arcwarden",
  "format": {
    "encoding": "PCM signed 16-bit little-endian",
    "sample_rate": 32000,
    "channels": 1
  },
  "tracks": [
    {
      "file": "SYSTEM/hello.wav",
      "kind": "system",
      "tag": "Приветствие",
      "text": "Раскол преодолён. Мы готовы к полёту.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/thralert.wav",
      "kind": "system",
      "tag": "Газ",
      "text": "Газ не убран. Опусти стик.",
      "priority": "warning",
      "max_seconds": 4,
      "available": false
    },
    {
      "file": "SYSTEM/swalert.wav",
      "kind": "system",
      "tag": "Переключатели",
      "text": "Проверь переключатели. Восстанови порядок.",
      "priority": "warning",
      "max_seconds": 4,
      "available": false
    },
    {
      "file": "SYSTEM/lowbatt.wav",
      "kind": "system",
      "tag": "Питание пульта",
      "text": "Низкий заряд пульта.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "SYSTEM/inactiv.wav",
      "kind": "system",
      "tag": "Бездействие",
      "text": "Мы ждём твоей воли.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/eebad.wav",
      "kind": "system",
      "tag": "Память",
      "text": "Ошибка памяти пульта.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "SYSTEM/rssi_org.wav",
      "kind": "system",
      "tag": "RSSI",
      "text": "Слабый сигнал.",
      "priority": "warning",
      "max_seconds": 4,
      "available": false
    },
    {
      "file": "SYSTEM/rssi_red.wav",
      "kind": "system",
      "tag": "RSSI",
      "text": "Критически слабый сигнал.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "SYSTEM/swr_red.wav",
      "kind": "system",
      "tag": "Антенна",
      "text": "Ошибка антенны.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "SYSTEM/telemco.wav",
      "kind": "system",
      "tag": "Телеметрия",
      "text": "Телеметрия подключена.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/telemko.wav",
      "kind": "system",
      "tag": "Телеметрия",
      "text": "Телеметрия потеряна.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "SYSTEM/telemok.wav",
      "kind": "system",
      "tag": "Телеметрия",
      "text": "Телеметрия восстановлена.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/trainco.wav",
      "kind": "system",
      "tag": "Тренер",
      "text": "Тренер подключён.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/trainko.wav",
      "kind": "system",
      "tag": "Тренер",
      "text": "Сигнал тренера потерян.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "SYSTEM/trainok.wav",
      "kind": "system",
      "tag": "Тренер",
      "text": "Сигнал тренера восстановлен.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/sensorko.wav",
      "kind": "system",
      "tag": "Датчик",
      "text": "Датчик недоступен.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "SYSTEM/servoko.wav",
      "kind": "system",
      "tag": "Сервопривод",
      "text": "Перегрузка сервопривода.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "SYSTEM/rxko.wav",
      "kind": "system",
      "tag": "Приёмник",
      "text": "Перегрузка приёмника.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "SYSTEM/modelpwr.wav",
      "kind": "system",
      "tag": "Питание модели",
      "text": "Приёмник ещё включён.",
      "priority": "warning",
      "max_seconds": 4,
      "available": false
    },
    {
      "file": "SYSTEM/midtrim.wav",
      "kind": "system",
      "tag": "Триммер",
      "text": "Триммер в центре. Равновесие.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/maxtrim.wav",
      "kind": "system",
      "tag": "Триммер",
      "text": "Верхний предел триммера.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/mintrim.wav",
      "kind": "system",
      "tag": "Триммер",
      "text": "Нижний предел триммера.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/timovr1.wav",
      "kind": "system",
      "tag": "Таймер",
      "text": "Первый таймер истёк.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/timovr2.wav",
      "kind": "system",
      "tag": "Таймер",
      "text": "Второй таймер истёк.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "SYSTEM/timovr3.wav",
      "kind": "system",
      "tag": "Таймер",
      "text": "Третий таймер истёк.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "armed.wav",
      "kind": "custom",
      "tag": "Арминг",
      "text": "Моторы активны. Наша воля едина.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "disarm.wav",
      "kind": "custom",
      "tag": "Арминг",
      "text": "Моторы отключены. Мы обрели покой.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "airmon.wav",
      "kind": "custom",
      "tag": "Air mode",
      "text": "Воздушный режим включён.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "airmof.wav",
      "kind": "custom",
      "tag": "Air mode",
      "text": "Воздушный режим выключен.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "batcrt.wav",
      "kind": "custom",
      "tag": "Батарея",
      "text": "Критический заряд. Посадка.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "lowbat.wav",
      "kind": "custom",
      "tag": "Батарея",
      "text": "Низкий заряд борта.",
      "priority": "warning",
      "max_seconds": 4,
      "available": false
    },
    {
      "file": "siglow.wav",
      "kind": "custom",
      "tag": "Сигнал",
      "text": "Слабый сигнал.",
      "priority": "warning",
      "max_seconds": 4,
      "available": false
    },
    {
      "file": "sigcrt.wav",
      "kind": "custom",
      "tag": "Сигнал",
      "text": "Критический уровень сигнала.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "fson.wav",
      "kind": "custom",
      "tag": "Failsafe",
      "text": "Аварийный режим включён.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "fsoff.wav",
      "kind": "custom",
      "tag": "Failsafe",
      "text": "Аварийный режим выключен.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "gps.wav",
      "kind": "custom",
      "tag": "GPS",
      "text": "Навигация включена. Путь определён.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "satfix.wav",
      "kind": "custom",
      "tag": "GPS",
      "text": "Спутники найдены.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "satlst.wav",
      "kind": "custom",
      "tag": "GPS",
      "text": "Спутники потеряны.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "flttm.wav",
      "kind": "custom",
      "tag": "Телеметрия",
      "text": "Время полёта.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "tohigh.wav",
      "kind": "custom",
      "tag": "Высота",
      "text": "Слишком высоко.",
      "priority": "warning",
      "max_seconds": 4,
      "available": false
    },
    {
      "file": "tolow.wav",
      "kind": "custom",
      "tag": "Высота",
      "text": "Опасно низко.",
      "priority": "critical",
      "max_seconds": 3.5,
      "available": false
    },
    {
      "file": "alt.wav",
      "kind": "custom",
      "tag": "Высота",
      "text": "Высота.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "althld.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Высота удерживается.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "hirate.wav",
      "kind": "custom",
      "tag": "Расходы",
      "text": "Высокие расходы.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "lorate.wav",
      "kind": "custom",
      "tag": "Расходы",
      "text": "Низкие расходы.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "ledon.wav",
      "kind": "custom",
      "tag": "Освещение",
      "text": "Бортовые огни включены.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "ledoff.wav",
      "kind": "custom",
      "tag": "Освещение",
      "text": "Бортовые огни выключены.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-acr.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Режим акро. Воля без оков.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-ang.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Режим стабилизации. Равновесие.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-hor.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Режим горизонта.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "lvlmod.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Режим уровня.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-stb.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Стабилизация включена.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-man.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Ручное управление. Твоя воля.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-nrm.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Обычный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-crs.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Крейсерский режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-lch.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Режим взлёта. Мы восходим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-lnd.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Режим посадки.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-hld.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Позиция удерживается.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-rth.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Возврат домой. К истоку.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-1.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Первый полётный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-2.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Второй полётный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-3.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Третий полётный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-4.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Четвёртый полётный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-5.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Пятый полётный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-6.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Шестой полётный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-7.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Седьмой полётный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-8.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Восьмой полётный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "fm-9.wav",
      "kind": "custom",
      "tag": "Режим полёта",
      "text": "Девятый полётный режим.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "gearup.wav",
      "kind": "custom",
      "tag": "Самолёт",
      "text": "Шасси убраны.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "geardn.wav",
      "kind": "custom",
      "tag": "Самолёт",
      "text": "Шасси выпущены.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "flapup.wav",
      "kind": "custom",
      "tag": "Самолёт",
      "text": "Закрылки убраны.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "flapdn.wav",
      "kind": "custom",
      "tag": "Самолёт",
      "text": "Закрылки выпущены.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "splrup.wav",
      "kind": "custom",
      "tag": "Самолёт",
      "text": "Интерцепторы убраны.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "splrdn.wav",
      "kind": "custom",
      "tag": "Самолёт",
      "text": "Интерцепторы выпущены.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "auro.wav",
      "kind": "custom",
      "tag": "Вертолёт",
      "text": "Авторотация.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "trnon.wav",
      "kind": "custom",
      "tag": "Тренер",
      "text": "Режим тренера включён. Две воли.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    },
    {
      "file": "trnoff.wav",
      "kind": "custom",
      "tag": "Тренер",
      "text": "Режим тренера выключен.",
      "priority": "normal",
      "max_seconds": 6,
      "available": false
    }
  ],
  "ready": 0,
  "complete": false,
  "release": null
};
