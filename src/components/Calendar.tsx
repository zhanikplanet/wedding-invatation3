import { motion } from 'motion/react';

interface CalendarProps {
  year: number;
  month: number; // 1-indexed (1 = Jan, 12 = Dec)
  day: number;
}

const KAZAKH_MONTHS = [
  'Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым',
  'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'
];

const WEEKDAYS = ['ДС', 'СС', 'СР', 'БС', 'ЖМ', 'СН', 'ЖБ'];

export default function Calendar({ year, month, day }: CalendarProps) {
  const monthIndex = month - 1;
  const numDays = new Date(year, month, 0).getDate();
  
  // Weekday of 1st day (0 = Sun, 1 = Mon...)
  const firstDayRaw = new Date(year, monthIndex, 1).getDay();
  // Adjust to Mon = 0, Sun = 6
  const startOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= numDays; d++) {
    calendarCells.push(d);
  }

  const monthName = KAZAKH_MONTHS[monthIndex].toUpperCase();

  return (
    <div className="flex flex-col items-center bg-transparent py-4 px-6 w-full max-w-sm mx-auto font-serif">
      <div className="text-center mb-6">
        <h3 className="text-[#a58d6b] tracking-wider text-lg uppercase font-medium mb-1">
          Той салтанаты
        </h3>
        <p className="text-gray-800 text-sm tracking-wide md:text-base font-normal">
          {year} ЖЫЛДЫҢ {monthName} АЙЫНЫҢ {day} ЖҰЛДЫЗЫНДА
        </p>
      </div>

      <div className="grid grid-cols-7 gap-y-3 gap-x-2 w-full text-center text-xs md:text-sm border-t border-b border-[#ebdcb3]/60 py-4">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="text-gray-500 font-semibold text-center font-sans">
            {wd}
          </div>
        ))}

        {calendarCells.map((cellDay, index) => {
          const isSelected = cellDay === day;

          return (
            <div
              key={index}
              className="relative flex items-center justify-center h-8 w-8 mx-auto font-sans text-gray-800"
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="absolute inset-0 flex items-center justify-center z-0"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-8 h-8 text-[#b59468] fill-[#b59468]/5"
                    strokeWidth="1.5"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>
              )}
              {cellDay && (
                <span
                  className={`relative z-10 font-medium ${
                    isSelected ? 'text-[#8b6e4e] font-bold' : 'text-gray-700'
                  }`}
                >
                  {cellDay}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
