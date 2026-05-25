import { useState, useEffect } from 'react';
import { InvitationConfig, RSVPResponse } from './types';
import InvitationPreview from './components/InvitationPreview';

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
  const [config] = useState<InvitationConfig>(() => {
    const saved = localStorage.getItem('wedding_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);

  // Load RSVP list on mount
  useEffect(() => {
    const savedRSVPs = localStorage.getItem('wedding_rsvps');
    if (savedRSVPs) {
      setRsvps(JSON.parse(savedRSVPs));
    }
  }, []);

  const handleRSVPAdded = (newRSVP: RSVPResponse) => {
    const updated = [newRSVP, ...rsvps];
    setRsvps(updated);
    localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-marble text-gray-800">
      <div className="flex-1 w-full h-full">
        <InvitationPreview config={config} onRSVPAdded={handleRSVPAdded} />
      </div>
    </div>
  );
}

