import { ReactNode } from 'react';
import { Wifi, Battery } from 'lucide-react';

export type DeviceMode = 'iphone' | 'android' | 'tablet' | 'desktop';

interface PhoneFrameProps {
  children: ReactNode;
  deviceMode?: DeviceMode;
}

export default function PhoneFrame({ children, deviceMode = 'iphone' }: PhoneFrameProps) {
  const currentTimeStr = "17:00";

  // If full-screen Desktop mode, bypass all mock frames and status bars
  if (deviceMode === 'desktop') {
    return (
      <div className="w-full h-full bg-[#fbf9f4] select-none shadow-md overflow-hidden relative">
        {children}
      </div>
    );
  }

  // Set style attributes and classes depending on chosen gadget
  let containerClasses = "";
  let innerClasses = "";
  let showNotch = false;
  let showPunchHole = false;

  switch (deviceMode) {
    case 'iphone':
      // iPhone 15 frame aspect ratio - fully responsive vertically
      containerClasses = "max-w-[360px] md:max-w-[370px] w-full aspect-[9/18.8] h-full max-h-[calc(100vh-150px)] bg-[#1a120b] p-3 rounded-[46px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] border-[5px] border-[#c0a98c]";
      innerClasses = "rounded-[34px]";
      showNotch = true;
      break;
    case 'android':
      // Modern Samsung/Google Pixel frame - punch hole camera
      containerClasses = "max-w-[350px] md:max-w-[360px] w-full aspect-[9/19.5] h-full max-h-[calc(100vh-150px)] bg-neutral-900 p-2.5 rounded-[36px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] border-[4.5px] border-[#c1b5a5]";
      innerClasses = "rounded-[28px]";
      showPunchHole = true;
      break;
    case 'tablet':
      // iPad/Tablet aspect ratio (4:3)
      containerClasses = "max-w-[580px] w-full aspect-[3/4] h-full max-h-[calc(100vh-150px)] bg-neutral-900 p-4 rounded-[28px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] border-[5px] border-[#b09e86]";
      innerClasses = "rounded-[16px]";
      break;
  }

  return (
    <div className={`relative mx-auto my-2 flex flex-col justify-between items-stretch overflow-hidden select-none transition-all duration-300 ${containerClasses}`}>
      
      {/* Glossy overlay reflection */}
      <div className="absolute top-0 inset-x-0 h-8 w-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-50 rounded-t-[34px]" />
      
      {/* Smartphone Inner screen */}
      <div className={`relative w-full h-full bg-white overflow-hidden flex flex-col items-stretch shadow-inner border border-black/10 ${innerClasses}`}>
        
        {/* ================= HARDWARE STATUS BAR ================= */}
        <div className="h-9 bg-white/10 backdrop-blur-xs flex items-center justify-between px-6 absolute top-0 inset-x-0 z-40 pointer-events-none text-gray-800">
          
          {/* Time */}
          <span className="font-sans text-[10px] font-bold tracking-tight">
            {currentTimeStr}
          </span>
          
          {/* Hardware cameras */}
          {showNotch && (
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-4 w-20 bg-black rounded-full flex items-center justify-end px-2 shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/80 animate-pulse" />
            </div>
          )}

          {showPunchHole && (
            <div className="absolute left-1/2 -translate-x-1/2 top-2 h-2.5 w-2.5 bg-black rounded-full shadow-inner" />
          )}

          {/* Icons */}
          <div className="flex items-center gap-1 text-gray-800 scale-90">
            <div className="flex items-end gap-0.5 h-2.5">
              <div className="w-[1.5px] h-1 bg-current" />
              <div className="w-[1.5px] h-1.5 bg-current" />
              <div className="w-[1.5px] h-2 bg-current" />
              <div className="w-[1.5px] h-2.5 bg-current" />
            </div>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-gray-800" />
          </div>
        </div>

        {/* Live Scrollable Webpage */}
        <div className="flex-1 w-full h-full relative pt-9">
          {children}
        </div>

        {/* ================= BOTTOM SIMULATOR BROWSER URL BAR ================= */}
        <div className="h-10 bg-white border-t border-gray-100 flex items-center justify-center px-4 relative z-40">
          <div className="w-full h-7 bg-gray-100/90 rounded-md flex items-center justify-between px-2.5 text-gray-400 scale-95">
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-gray-500" stroke="currentColor" strokeWidth="2.5">
              <rect x="6" y="11" width="12" height="10" rx="3" />
              <path d="M9 11V7a3 3 0 016 0v4" />
            </svg>
            <span className="font-sans text-[10px] font-medium text-gray-600 truncate max-w-[170px]">
              site-invitekz.tilda.ws
            </span>
            <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-gray-400" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4v5h5M20 20v-5h-5" />
              <path d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </div>
        </div>
        
      </div>
    </div>
  );
}

