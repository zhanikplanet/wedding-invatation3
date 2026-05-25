import { useState, useEffect } from 'react';
import { InvitationConfig, RSVPResponse } from './types';
import InvitationEditor from './components/InvitationEditor';
import InvitationPreview from './components/InvitationPreview';
import PhoneFrame from './components/PhoneFrame';
import { Eye, Edit3, Heart, ListPlus, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_CONFIG: InvitationConfig = {
  groomName: 'Шыңғыс',
  brideName: 'Ақжан',
  weddingDate: '2026-08-25',
  weddingTime: '17:00',
  weddingYear: '2026',
  weddingMonthName: 'Тамыз',
  locationName: 'Строящееся административное здание',
  locationAddress: 'Алматы қаласы (2GIS картасы нүктесі бойынша)',
  mapUrl: 'https://2gis.kz/almaty/geo/70030076996008465/77.043740,43.309045',
  parentsName: 'Әлібек - Гүлсара',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  accentColor: 'gold'
};

export default function App() {
  const [config, setConfig] = useState<InvitationConfig>(() => {
    const saved = localStorage.getItem('wedding_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileEditor, setShowMobileEditor] = useState(false);

  // Sync config updates with localStorage
  useEffect(() => {
    localStorage.setItem('wedding_config', JSON.stringify(config));
  }, [config]);

  // Load RSVP list on mount
  useEffect(() => {
    const savedRSVPs = localStorage.getItem('wedding_rsvps');
    if (savedRSVPs) {
      setRsvps(JSON.parse(savedRSVPs));
    }

    // Detect if viewport is essentially mobile-sized to adapt layout dynamically
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRSVPAdded = (newRSVP: RSVPResponse) => {
    setRsvps((prev) => [newRSVP, ...prev]);
  };

  const handleClearRSVPs = () => {
    if (confirm('Шынымен барлық тіркелген қонақ жауаптарын өшіргіңіз келе ме?')) {
      localStorage.removeItem('wedding_rsvps');
      setRsvps([]);
    }
  };

  const handleDeleteRSVP = (id: string) => {
    const updated = rsvps.filter((r) => r.id !== id);
    localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
    setRsvps(updated);
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#faf8f4] text-gray-800">
      
      {/* ================= DESKTOP SPLITSCREEN LAYOUT ================= */}
      {!isMobileView ? (
        <>
          {/* Left Editor / Dashboard Column (40%) */}
          <div className="w-[400px] xl:w-[460px] h-full flex-shrink-0 z-10 select-none">
            <InvitationEditor
              config={config}
              onChange={setConfig}
              rsvps={rsvps}
              onClearRSVPs={handleClearRSVPs}
              onDeleteRSVP={handleDeleteRSVP}
            />
          </div>

          {/* Right Presentation Backdrop (60%) */}
          <div className="flex-1 h-full bg-[#f6f2e9] relative flex items-center justify-center overflow-hidden">
            {/* Ambient Bokeh blobs for wedding atmosphere */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#faedd4]/40 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/50 rounded-full blur-3xl" />
            
            <div className="relative z-10 w-full flex flex-col items-center">
              {/* Smartphone Simulator */}
              <PhoneFrame>
                <InvitationPreview config={config} onRSVPAdded={handleRSVPAdded} />
              </PhoneFrame>
              <p className="mt-2 text-xs text-[#9e7b4f] font-sans font-semibold tracking-wider uppercase opacity-80 shadow-3xs px-3 py-1.5 rounded-full bg-white/40 border border-white/20 select-none">
                Жанды қарау • 2GIS Карта • Аудио батырма белсенді
              </p>
            </div>
          </div>
        </>
      ) : (
        /* ================= MOBILE ADAPTIVE VIEW ================= */
        <div className="relative w-full h-full flex flex-col">
          {/* Active Invitation full height & width */}
          <div className="flex-1 w-full h-full">
            <InvitationPreview config={config} onRSVPAdded={handleRSVPAdded} />
          </div>

          {/* Floating Admin Toggle for mobile administrators & testing */}
          <div className="absolute bottom-4 right-4 z-50">
            <button
              onClick={() => setShowMobileEditor(true)}
              className="flex select-none items-center gap-1.5 px-4 py-3 rounded-full bg-[#59442a] text-[#faedd4] font-sans font-bold text-xs tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#ebdcb3]/30"
            >
              <Edit3 className="w-4 h-4" />
              Басқару
            </button>
          </div>

          {/* Slide-Up Overlay Modal for mobile admin editing */}
          <AnimatePresence>
            {showMobileEditor && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 bg-white z-50 flex flex-col"
              >
                {/* Header that allows closing panel */}
                <div className="bg-[#59442a] text-white py-4 px-6 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-5 h-5 text-[#faedd4] fill-[#faedd4]" />
                    <span className="font-serif text-base tracking-wide font-bold">Той конструкторы</span>
                  </div>
                  <button
                    onClick={() => setShowMobileEditor(false)}
                    className="select-none px-4 py-1.5 text-xs font-sans font-bold text-[#faedd4] bg-white/10 hover:bg-white/20 rounded-full transition-colors uppercase border border-white/10 cursor-pointer"
                  >
                    Жабу
                  </button>
                </div>

                {/* Simulated Editor inside model */}
                <div className="flex-1 overflow-hidden">
                  <InvitationEditor
                    config={config}
                    onChange={setConfig}
                    rsvps={rsvps}
                    onClearRSVPs={handleClearRSVPs}
                    onDeleteRSVP={handleDeleteRSVP}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
