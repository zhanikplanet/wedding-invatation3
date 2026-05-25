import { useEffect, useState } from 'react';

interface CountdownProps {
  weddingDateStr: string; // e.g. "2026-08-25"
  weddingTimeStr: string; // e.g. "17:00"
}

export default function Countdown({ weddingDateStr, weddingTimeStr }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    function calculateTime() {
      const targetDate = new Date(`${weddingDateStr}T${weddingTimeStr}:00`);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [weddingDateStr, weddingTimeStr]);

  const timeBlocks = [
    { label: 'КҮН', value: timeLeft.days },
    { label: 'САҒАТ', value: timeLeft.hours },
    { label: 'МИНУТ', value: timeLeft.minutes },
    { label: 'СЕКУНД', value: timeLeft.seconds }
  ];

  return (
    <div className="flex flex-col items-center bg-transparent py-4 px-4 w-full text-center">
      <h3 className="font-serif italic font-medium text-lg text-[#9e7b4f] mb-4">
        Тойға дейін:
      </h3>
      
      {timeLeft.isOver ? (
        <p className="font-serif text-[#a58d6b] italic font-medium px-4 tracking-wider">
          Үйлену тойы өтті! Сиқырлы өмір тілейміз! 🥂
        </p>
      ) : (
        <div className="flex items-center justify-center gap-3 md:gap-4 w-full max-w-sm">
          {timeBlocks.map((block, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Outer circular/pill-shaped border or elegant gold box block */}
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-[#ebdcb3] bg-[#fbf9f4] shadow-sm mb-1.5">
                <span className="font-sans text-lg md:text-xl font-semibold text-gray-800 tabular-nums">
                  {block.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="font-sans text-[10px] md:text-xs text-gray-500 tracking-wider font-semibold">
                {block.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
