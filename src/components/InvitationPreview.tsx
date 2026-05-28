import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, MapPin, Check, ChevronDown, Music, Heart, Calendar as CalendarIcon } from 'lucide-react';
import Calendar from './Calendar';
import Countdown from './Countdown';
import { InvitationConfig, RSVPResponse } from '../types';

// Use direct asset string constants to keep TypeScript compiler happy
const weddingHandsImg = '/wedding-invatation3/wedding_hands_1779698518970.jpeg';
const watercolorRoseImg = '/wedding-invatation3/white_rose_water_color_1779698545103.png';

interface DecorativeFlowerProps {
  className?: string;
  delay?: number;
  rotate?: number;
  opacity?: number;
}

function DecorativeFlower({ className = '', delay = 0, rotate = 0, opacity = 0.15 }: DecorativeFlowerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, rotate: rotate - 25 }}
      whileInView={{ opacity, scale: 1, rotate }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay }}
      viewport={{ once: true, margin: "-10%" }}
      className={`absolute pointer-events-none select-none z-0 ${className}`}
    >
      <img src={watercolorRoseImg} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
    </motion.div>
  );
}


interface InvitationPreviewProps {
  config: InvitationConfig;
  onRSVPAdded?: (rsvp: RSVPResponse) => void;
}

export default function InvitationPreview({ config, onRSVPAdded }: InvitationPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'with_partner' | 'no'>('yes');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Parse Date parts dynamically
  // Date format: "YYYY-MM-DD"
  const dateParts = config.weddingDate.split('-');
  const year = parseInt(dateParts[0]) || 2026;
  const month = parseInt(dateParts[1]) || 8;
  const day = parseInt(dateParts[2]) || 25;

  // Sync background audio element + Autoplay Fix
  useEffect(() => {
    // Инициализируем аудио элемент, если его еще нет
    if (!audioRef.current) {
      audioRef.current = new Audio(config.audioUrl);
      audioRef.current.loop = true;
    } else {
      // Если url изменился в админке, обновляем источник
      audioRef.current.src = config.audioUrl;
    }

    // Функция для попытки автоматического запуска
    const attemptAutoplay = () => {
      if (!audioRef.current) return;

      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          // Как только музыка успешно заиграла — убираем глобальные слушатели
          removeInteractionListeners();
        })
        .catch((err) => {
          console.log("Автовоспроизведение ожидает взаимодействия пользователя...");
        });
    };

    // Слушатели для активации звука при первом же действии на сайте
    const handleUserInteraction = () => {
      attemptAutoplay();
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    };

    // 1. Пробуем запуститься сразу (на случай, если браузер позволит)
    attemptAutoplay();

    // 2. Если браузер заблокировал — запускаем при первом клике, тапе или скролле
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction);

    // Чистим память при демонтаже компонента
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      removeInteractionListeners();
    };
  }, [config.audioUrl]);

  // Handle Play/Pause (Ручное управление кнопкой)
  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Audio playback blocked or failed:", err);
        });
    }
  };

  // Submit RSVP
  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    // 1. НАСТРОЙКА ТЕЛЕГРАМА (Вставьте свои данные сюда)
    const TELEGRAM_BOT_TOKEN = '8100500156:AAHxsddijDRn0zcaKU048apqa6dU1NH7Bp4';
    const TELEGRAM_CHAT_ID = '1198060039';

    // Красивый текст статуса для сообщения
    let statusText = '';
    if (rsvpStatus === 'yes') statusText = '✅ Әрине, келемін!';
    if (rsvpStatus === 'with_partner') statusText = '👩‍❤️‍👨 Жұбайыммен (жұбыммен) барамын';
    if (rsvpStatus === 'no') statusText = '❌ Өкінішке орай, келе алмаймын';

    const message = `
🔔 **Жаңа жауап (Шынгыс той):**
👤 **Қонақ:** ${guestName.trim()}
❓ **Таңдауы:** ${statusText}
⏰ **Уақыты:** ${new Date().toLocaleString('kk-KZ')}
  `.trim();

    // 2. ОТПРАВКА В ТЕЛЕГРАМ
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
      // Не блокируем гостя, даже если телеграм заглючил, пускай форма отправится локально
    }

    // 3. ВАШ СТАРЫЙ КОД (Сохранение в localStorage)
    const newRSVP: RSVPResponse = {
      id: Math.random().toString(36).substring(2, 9),
      guestName: guestName.trim(),
      status: rsvpStatus,
      timestamp: new Date().toLocaleString('kk-KZ')
    };

    const existingList = localStorage.getItem('wedding_rsvps');
    const rsvps = existingList ? JSON.parse(existingList) : [];
    rsvps.unshift(newRSVP);
    localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));

    if (onRSVPAdded) {
      onRSVPAdded(newRSVP);
    }

    // Сбрасываем форму и показываем экран "Рақмет"
    setIsSubmitted(true);
    setGuestName('');
  };

  return (
    <div className="relative w-full max-w-[480px] mx-auto h-full overflow-y-auto no-scrollbar bg-marble text-gray-800 selection:bg-gold-200 md:shadow-[0_0_60px_rgba(90,68,42,0.07)] md:border-l md:border-r md:border-[#ebdcb3]/30">
      {/* Background Audio */}
      <audio ref={audioRef} preload="auto" />

      {/* Persistent Audio Button in Top-Right or Left-Center (just like the original video) */}
      <div className="absolute top-48 left-4 z-40">
        <button
          onClick={toggleAudio}
          className="relative w-18 h-18 flex items-center justify-center rounded-full bg-white/95 border border-[#ebdcb3] shadow-md focus:outline-none transition-transform duration-300 hover:scale-105 active:scale-95"
          id="music-button"
        >
          {/* Circular Text */}
          <div className={`absolute inset-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path
                id="textPathCircle"
                d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                fill="transparent"
              />
              <text className="text-[7.2px] fill-[#9e7b4f] tracking-[0.14em] font-sans font-bold uppercase">
                <textPath href="#textPathCircle" startOffset="0%">
                  ӘУЕНДІ ҚОСУ • КУӘСІ БОЛЫҢЫЗ •
                </textPath>
              </text>
            </svg>
          </div>

          {/* Center Play/Pause Indicator Icon */}
          <div className="relative z-10 w-9 h-9 rounded-full bg-[#faedd4] text-[#9e7b4f] flex items-center justify-center">
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </div>
        </button>
      </div>

      {/* ================= HERO COVER ================= */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-between py-12 px-6 bg-transparent overflow-hidden">
        {/* Decorative background flower on Hero */}
        <DecorativeFlower className="top-[38vh] -left-12 w-32 h-32" rotate={35} opacity={0.12} />
        <DecorativeFlower className="top-[50vh] -right-12 w-36 h-36" rotate={-45} opacity={0.12} />

        {/* Upper Image with soft gradient masks to white */}
        <div className="absolute top-0 inset-x-0 h-[60vh] z-0 overflow-hidden">
          <img
            src={weddingHandsImg}
            alt="Wedding Ceremony"
            className="w-full h-full object-cover scale-105 filter brightness-95 opacity-90 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Smooth overlay gradient to match standard elegant invite card transitions */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fcfbf9]/50 to-[#fcfbf9]" />
        </div>

        {/* Centered spacer to offset text block below the background photo */}
        <div className="h-[43vh] w-full z-10" />

        {/* Cursive Signature Names Area mimicking the video layout precisely */}
        <div className="relative z-10 text-center w-full max-w-sm px-4 bg-white/60 backdrop-blur-xs py-8 rounded-2xl border border-white/50 shadow-xs mt-4">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            {/* Groom Name */}
            <h1 className="font-serif italic text-4xl md:text-5xl font-medium tracking-wide text-gray-900 leading-tight">
              {config.groomName}
            </h1>

            {/* Elegant Ampersand / Divider */}
            <span className="font-serif italic text-xl md:text-2xl text-[#b59468] my-1 font-light">&</span>

            {/* Bride Name */}
            <h1 className="font-serif italic text-4xl md:text-5xl font-medium tracking-wide text-gray-900 leading-tight">
              {config.brideName}
            </h1>

            {/* Sub-Header info block */}
            <div className="w-20 h-[1.5px] bg-[#e1d5ba] my-5" />

            <span className="font-sans text-[11px] font-semibold text-gray-500 tracking-[0.3em] uppercase block mb-1">
              WEDDING DAY
            </span>

            <span className="font-serif text-lg tracking-widest text-[#9e7b4f] font-medium">
              {config.weddingDate.split('-').reverse().join('.')}
            </span>

            {/* Kazakh Wedding Text footer on first page */}
            <p className="font-serif text-xs italic text-gray-500 tracking-wider mt-6 font-medium">
              ЖОҒАРЫ КӨТЕРІҢІЗ
            </p>

            {/* Bouncing Chevron scroll hint */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-1"
            >
              <ChevronDown className="w-4 h-4 text-[#9e7b4f]" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ================= GREETING TEXT ================= */}
      <div className="relative w-full py-20 px-6 bg-transparent flex flex-col items-center overflow-hidden">
        {/* Flanking decorative background roses with organic animation parameters */}
        <DecorativeFlower className="top-10 -left-6 w-24 h-24" rotate={45} />
        <DecorativeFlower className="top-40 -right-8 w-28 h-28" rotate={-15} />
        <DecorativeFlower className="bottom-8 -left-10 w-32 h-32" rotate={120} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="w-full max-w-sm text-center font-serif flex flex-col items-center px-4 relative z-10"
        >
          <span className="text-[#b59468] text-2xl italic font-medium mb-6 block">
            Құрметті қонақтар!
          </span>

          <p className="text-gray-700 text-sm md:text-base leading-relaxed tracking-wide font-normal mb-6">
            Сіздерді балаларымыз
          </p>

          <div className="flex flex-col items-center my-4 font-serif italic text-3xl text-gray-900 border-l border-r border-[#ebdcb3] px-8 py-2">
            <span className="font-medium tracking-wide">{config.groomName}</span>
            <span className="text-[#c5a880] text-sm my-1 uppercase tracking-widest font-sans not-italic font-semibold">пен</span>
            <span className="font-medium tracking-wide">{config.brideName}ның</span>
          </div>

          <p className="text-gray-700 text-sm md:text-base leading-relaxed tracking-wide font-normal mt-4">
            үйлену тойына арналған салтанатты ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!
          </p>

          {/* Separator flower accent */}
          <div className="w-20 my-10 opacity-35 self-center">
            <img src={watercolorRoseImg} className="w-8 h-8 object-contain mx-auto" referrerPolicy="no-referrer" />
          </div>

          {/* Optional hosts parents block as seen in video */}
          {config.parentsName && (
            <div className="text-center font-serif">
              <span className="text-xs uppercase tracking-widest text-[#9e7b4f] block mb-2 font-semibold">
                Ізгі ниетпен,
              </span>
              <p className="text-gray-900 text-base md:text-lg italic font-medium">
                {config.parentsName}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ================= CALENDAR SECTION ================= */}
      <div className="relative w-full py-16 px-6 bg-white/45 backdrop-blur-xs border-t border-b border-[#f3ebde]/80 overflow-hidden">
        {/* Background decorative flower */}
        <DecorativeFlower className="top-4 -right-10 w-36 h-36" rotate={75} opacity={0.1} />
        <DecorativeFlower className="bottom-1 -left-12 w-32 h-32" rotate={-35} opacity={0.1} />

        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 opacity-10 select-none pointer-events-none">
          <Heart className="w-full h-full text-[#9e7b4f] fill-current" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="w-full relative z-10"
        >
          {/* Dynamic Calendar */}
          <Calendar year={year} month={month} day={day} />

          {/* Time block */}
          <div className="text-center mt-6">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1">
              БАСТАЛУЫ
            </span>
            <span className="font-serif italic text-[#c5a880] text-xl font-medium">
              САҒАТ {config.weddingTime} - ДЕ
            </span>
          </div>
        </motion.div>
      </div>

      {/* ================= VENUE SECTION ================= */}
      <div className="relative w-full py-16 px-6 bg-transparent flex flex-col items-center text-center overflow-hidden">
        {/* Background decorative flower */}
        <DecorativeFlower className="top-12 -left-10 w-36 h-36" rotate={-60} opacity={0.1} />
        <DecorativeFlower className="bottom-8 -right-8 w-28 h-28" rotate={15} opacity={0.1} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="w-full max-w-sm flex flex-col items-center relative z-10"
        >
          <div className="w-12 h-12 bg-[#faedd4] rounded-full text-[#9e7b4f] flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 stroke-[1.5]" />
          </div>

          <h3 className="font-serif italic text-xl font-medium text-[#9e7b4f] tracking-wide mb-4">
            Мекен-жайымыз:
          </h3>

          <p className="font-serif text-lg text-gray-900 font-semibold mb-2">
            {config.locationName}
          </p>
          <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-[280px] mb-8 font-medium">
            {config.locationAddress}
          </p>

          {/* Clickable 2GIS Button matching the green and blue style or golden elegant accent */}
          <a
            href={config.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#faedd4] hover:bg-gold-200 border border-[#b59468]/30 text-[#8b6e4e] font-sans font-semibold tracking-wider text-xs uppercase shadow-sm transition-transform duration-200 active:scale-95 cursor-pointer"
          >
            {/* Map Pin Vector Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-[#8b6e4e]"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            КАРТАНЫ АШУ
          </a>
        </motion.div>
      </div>

      {/* ================= RSVP FORM SECTION ================= */}
      <div className="relative w-full py-16 px-6 bg-white/45 backdrop-blur-xs border-t border-b border-[#f3ebde]/80 overflow-hidden">
        {/* Background decorative flower */}
        <DecorativeFlower className="top-16 -right-10 w-36 h-36" rotate={110} opacity={0.11} />
        <DecorativeFlower className="bottom-6 -left-10 w-32 h-32" rotate={-85} opacity={0.11} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="w-full max-w-sm mx-auto relative z-10"
        >
          <div className="text-center mb-8">
            <h3 className="font-serif text-[#a58d6b] uppercase text-sm tracking-[0.2em] font-semibold mb-2">
              ҚҰРМЕТТІ ҚОНАҚ!
            </h3>
            <p className="font-serif italic text-gray-800 text-base">
              Тойға қатысуыңызды растауыңызды сұраймыз:
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="rsvp-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleRSVPSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2 font-sans">
                    Аты-жөніңіз (жұбайыңызбен келетін болсаңыз, есімдеріңізді бірге жазуыңызды өтінеміз)
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Есіміңізді жазыңыз"
                    className="w-full py-3 px-1 text-base text-gray-900 border-b border-[#ebdcb3] bg-transparent focus:outline-none focus:border-[#9e7b4f] transition-colors duration-200 placeholder-gray-400 font-serif"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3 font-sans">
                    Қатысу таңдауы:
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="rsvpStatus"
                      checked={rsvpStatus === 'yes'}
                      onChange={() => setRsvpStatus('yes')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${rsvpStatus === 'yes' ? 'border-[#9e7b4f] bg-[#faedd4]' : 'border-gray-300'
                      }`}>
                      {rsvpStatus === 'yes' && <div className="w-2.5 h-2.5 rounded-full bg-[#9e7b4f]" />}
                    </div>
                    <span className="font-serif text-sm font-medium text-gray-800">
                      Әрине, келемін
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="rsvpStatus"
                      checked={rsvpStatus === 'with_partner'}
                      onChange={() => setRsvpStatus('with_partner')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${rsvpStatus === 'with_partner' ? 'border-[#9e7b4f] bg-[#faedd4]' : 'border-gray-300'
                      }`}>
                      {rsvpStatus === 'with_partner' && <div className="w-2.5 h-2.5 rounded-full bg-[#9e7b4f]" />}
                    </div>
                    <span className="font-serif text-sm font-medium text-gray-800">
                      Жұбайыммен барамын
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="rsvpStatus"
                      checked={rsvpStatus === 'no'}
                      onChange={() => setRsvpStatus('no')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${rsvpStatus === 'no' ? 'border-[#9e7b4f] bg-[#faedd4]' : 'border-gray-300'
                      }`}>
                      {rsvpStatus === 'no' && <div className="w-2.5 h-2.5 rounded-full bg-[#9e7b4f]" />}
                    </div>
                    <span className="font-serif text-sm font-medium text-gray-800">
                      Өкінішке орай, келе алмаймын
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full select-none py-3.5 mt-4 rounded-lg bg-[#b59468] hover:bg-gold-700 text-white font-sans text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-sm active:scale-98 cursor-pointer"
                >
                  ЖІБЕРУ
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="submitted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8 space-y-4"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-full text-emerald-500 border border-emerald-100 flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="font-serif text-[#9e7b4f] italic text-lg font-medium">
                  Рақмет, жауабыңыз қабылданды!
                </h4>
                <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-[240px]">
                  Біздің қуанышымызға ортақтасып, жауап бергеніңізге алғыс білдіреміз!
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-[#b59468] hover:underline font-sans uppercase tracking-widest cursor-pointer"
                >
                  Қайтадан жауап беру
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ================= FOOTER / COUNTDOWN ================= */}
      <div className="relative w-full py-16 px-6 bg-transparent text-center flex flex-col items-center overflow-hidden">
        {/* Background decorative flower */}
        <DecorativeFlower className="top-20 -left-12 w-36 h-36" rotate={5} opacity={0.12} />
        <DecorativeFlower className="top-40 -right-12 w-32 h-32" rotate={115} opacity={0.12} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-10%" }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Dynamic Countdown */}
          <Countdown weddingDateStr={config.weddingDate} weddingTimeStr={config.weddingTime} />

          <div className="w-24 h-[1px] bg-[#e1d5ba] my-8 mx-auto" />

          {/* Closing message */}
          <p className="font-serif italic text-gray-800 text-lg md:text-xl font-medium tracking-wide">
            Қуанышымызға ортақ болыңыздар!
          </p>

          <div className="mt-12 opacity-20">
            <img src={watercolorRoseImg} className="w-12 h-12 object-contain mx-auto" referrerPolicy="no-referrer" />
          </div>

          <p className="mt-6 text-[10px] font-sans text-gray-400 tracking-wider font-semibold uppercase">
            © {config.groomName} & {config.brideName} • 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
