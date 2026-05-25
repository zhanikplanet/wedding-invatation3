import { ReactNode } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  // Current local formatted time for phone status bar
  const currentTimeStr = "17:00";

  return (
    <div className="relative mx-auto my-4 max-w-[360px] md:max-w-[370px] w-full aspect-[9/18.8] h-[780px] bg-[#1a120b] p-3.5 rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)] border-[5.5px] border-[#c0a98c] flex flex-col justify-between items-stretch overflow-hidden select-none">
      
      {/* Phone Case Inner Details- Highlight reflections */}
      <div className="absolute top-0 inset-x-0 h-10 w-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-50 rounded-t-[36px]" />
      
      {/* Smartphone Inner Screen Content Area */}
      <div className="relative w-full h-full rounded-[38px] bg-white overflow-hidden flex flex-col items-stretch shadow-inner border border-black/10">
        
        {/* ================= HARDWARE SIMULATION STATUS BAR ================= */}
        <div className="h-10 bg-white/10 backdrop-blur-xs flex items-center justify-between px-6 absolute top-0 inset-x-0 z-40 pointer-events-none text-gray-800">
          
          {/* Mock Time Display */}
          <span className="font-sans text-[11px] font-bold tracking-tight">
            {currentTimeStr}
          </span>
          
          {/* Elegant Top Notch / Dynamic Island */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 h-4.5 w-24 bg-black rounded-full flex items-center justify-end px-2.5 shadow-md">
            {/* Small green/blue sensor indicator dot */}
            <div className="w-1 h-1 rounded-full bg-green-500/85 animate-pulse" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-gray-800">
            {/* Mock Cellular Network level bars */}
            <div className="flex items-end gap-0.5 h-3">
              <div className="w-[2px] h-1 bg-current rounded-3xs" />
              <div className="w-[2px] h-1.5 bg-current rounded-3xs" />
              <div className="w-[2px] h-2 bg-current rounded-3xs" />
              <div className="w-[2px] h-2.5 bg-current rounded-3xs" />
            </div>
            
            <Wifi className="w-3.5 h-3.5" />
            
            <Battery className="w-4 h-4 text-gray-800" />
          </div>
        </div>

        {/* Dynamic Simulated Content (Invitation scrolling app view) */}
        <div className="flex-1 w-full h-full relative pt-10">
          {children}
        </div>

        {/* ================= BOTTOM BROWSER SIMULATOR ADDRESS BAR ================= */}
        <div className="h-12 bg-white/95 border-t border-gray-100 flex items-center justify-center px-4 relative z-40">
          <div className="w-full h-8 bg-gray-100/80 rounded-lg flex items-center justify-between px-3 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-gray-500" stroke="currentColor" strokeWidth="2.5">
              <rect x="6" y="11" width="12" height="10" rx="3" />
              <path d="M9 11V7a3 3 0 016 0v4" />
            </svg>
            <span className="font-sans text-[10.5px] font-medium text-gray-600 truncate max-w-[200px]">
              site-invitekz.tilda.ws
            </span>
            <svg viewBox="0 0 24 24" fill="none" class="w-3.5 h-3.5 text-gray-500" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4v5h5M20 20v-5h-5" />
              <path d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </div>
        </div>
        
      </div>
    </div>
  );
}
