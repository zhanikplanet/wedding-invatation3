import { useState } from 'react';
import { InvitationConfig, RSVPResponse } from '../types';
import { Settings, Users, Music, MapPin, Calendar, Heart, Copy, Download, Trash2, CheckCircle2 } from 'lucide-react';

interface InvitationEditorProps {
  config: InvitationConfig;
  onChange: (newConfig: InvitationConfig) => void;
  rsvps: RSVPResponse[];
  onClearRSVPs: () => void;
  onDeleteRSVP: (id: string) => void;
}

export default function InvitationEditor({
  config,
  onChange,
  rsvps,
  onClearRSVPs,
  onDeleteRSVP
}: InvitationEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'rsvps'>('content');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (key: keyof InvitationConfig, value: string) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  // Stats calculation
  const totalSubmissions = rsvps.length;
  const comingSolo = rsvps.filter((r) => r.status === 'yes').length;
  const comingWithPartner = rsvps.filter((r) => r.status === 'with_partner').length;
  const declining = rsvps.filter((r) => r.status === 'no').length;
  const totalGuestsCount = comingSolo + (comingWithPartner * 2);

  const copyRSVPsToClipboard = () => {
    if (rsvps.length === 0) return;
    const text = rsvps
      .map((r, i) => `${i + 1}. ${r.guestName} - ${
        r.status === 'yes' ? 'Әрине, келеді' : r.status === 'with_partner' ? 'Жұбайымен келеді' : 'Келе алмайды'
      } (${r.timestamp})`)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadCSV = () => {
    if (rsvps.length === 0) return;
    const headers = 'Реті,Қонақ есімі,Жауабы,Уақыты\n';
    const rows = rsvps
      .map((r, i) => `${i + 1},"${r.guestName}","${
        r.status === 'yes' ? 'Болады' : r.status === 'with_partner' ? 'Жұбайымен келеді' : 'Болмайды'
      }","${r.timestamp}"`)
      .join('\n');

    const blob = new Blob([`\ufeff${headers}${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Wedding_RSVP_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-xl overflow-hidden font-sans">
      {/* Brand Header */}
      <div className="bg-[#59442a] text-white py-5 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <Heart className="w-5 h-5 text-[#faedd4] fill-[#faedd4]" />
          <div>
            <h2 className="font-serif text-lg tracking-wide font-bold">Той конструкторы</h2>
            <p className="text-[10px] text-gold-100/80 tracking-widest font-semibold uppercase">Басқару панелі</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50/70 p-1.5 gap-1.5">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 select-none flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
            activeTab === 'content'
              ? 'bg-white text-[#9e7b4f] shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          Шақыруды Редакциялау
        </button>
        <button
          onClick={() => setActiveTab('rsvps')}
          className={`flex-1 select-none flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all relative cursor-pointer ${
            activeTab === 'rsvps'
              ? 'bg-white text-[#9e7b4f] shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
          }`}
        >
          <Users className="w-4 h-4" />
          Қонақтар Тізімі (RSVP)
          {rsvps.length > 0 && (
            <span className="absolute top-2 right-4 bg-[#b59468] text-white text-[10px] h-4 min-w-4 px-1 rounded-full flex items-center justify-center font-bold">
              {rsvps.length}
            </span>
          )}
        </button>
      </div>

      {/* Content Form Scroll area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'content' ? (
          <div className="space-y-6">
            {/* Newlyweds section */}
            <div className="bg-amber-50/20 rounded-xl p-4 border border-[#faedd4]/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7b4f] mb-4 flex items-center gap-2.5">
                <Heart className="w-3.5 h-3.5 fill-current" />
                Жас жұбайлар есімдері
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                    Күйеу жігіт
                  </label>
                  <input
                    type="text"
                    value={config.groomName}
                    onChange={(e) => handleInputChange('groomName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#9e7b4f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                    Қалыңдық
                  </label>
                  <input
                    type="text"
                    value={config.brideName}
                    onChange={(e) => handleInputChange('brideName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#9e7b4f]"
                  />
                </div>
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="bg-amber-50/20 rounded-xl p-4 border border-[#faedd4]/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7b4f] mb-4 flex items-center gap-2.5">
                <Calendar className="w-3.5 h-3.5" />
                Күні мен уақыты
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                    Күні (Күнтізбе үшін)
                  </label>
                  <input
                    type="date"
                    value={config.weddingDate}
                    onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#9e7b4f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                    Басталу уақыты
                  </label>
                  <input
                    type="text"
                    value={config.weddingTime}
                    onChange={(e) => handleInputChange('weddingTime', e.target.value)}
                    placeholder="мысалы, 17:00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#9e7b4f]"
                  />
                </div>
              </div>
            </div>

            {/* Venue and Map location */}
            <div className="bg-amber-50/20 rounded-xl p-4 border border-[#faedd4]/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7b4f] mb-4 flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5" />
                Мекен-жай және Мапа сілтемесі
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                    Ғимарат (Тойхана) атауы
                  </label>
                  <input
                    type="text"
                    value={config.locationName}
                    onChange={(e) => handleInputChange('locationName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#9e7b4f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                    Қала, көшесі мен нөмірі
                  </label>
                  <input
                    type="text"
                    value={config.locationAddress}
                    onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#9e7b4f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                    2GIS сілтемесі (Картаны ашу үшін)
                  </label>
                  <input
                    type="text"
                    value={config.mapUrl}
                    onChange={(e) => handleInputChange('mapUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#9e7b4f]"
                  />
                </div>
              </div>
            </div>

            {/* Parents block */}
            <div className="bg-amber-50/20 rounded-xl p-4 border border-[#faedd4]/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7b4f] mb-4 flex items-center gap-2.5">
                <Users className="w-3.5 h-3.5" />
                Шақырушылар (Той иелері)
              </h3>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                  Ата-ана есімдері
                </label>
                <input
                  type="text"
                  value={config.parentsName}
                  onChange={(e) => handleInputChange('parentsName', e.target.value)}
                  placeholder="мысалы Әлібек - Гүлсара (бос қалдырсаңыз шақырудан жойылады)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#9e7b4f]"
                />
              </div>
            </div>

            {/* Music section */}
            <div className="bg-amber-50/20 rounded-xl p-4 border border-[#faedd4]/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9e7b4f] mb-4 flex items-center gap-2.5">
                <Music className="w-3.5 h-3.5" />
                Әуен баптамалары
              </h3>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 tracking-wider mb-1.5 uppercase">
                  Фондық музыка сілтемесі (MP3 URL)
                </label>
                <input
                  type="text"
                  value={config.audioUrl}
                  onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#9e7b4f]"
                />
                <span className="text-[10px] text-gray-400 mt-1.5 block leading-normal">
                  Қалауыңызша кез-келген желідегі MP3 форматындағы музыка сілтемесін қоя аласыз.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* RSVP Stats Dashboard cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#faedd4]/40 border border-[#ebdcb3]/50 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-[#9e7b4f] block mb-0.5 uppercase tracking-wider">Барлығы жауап берді</span>
                <span className="text-2xl font-extrabold text-gray-900">{totalSubmissions}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-emerald-600 block mb-0.5 uppercase tracking-wider">Болжалды қонақ саны</span>
                <span className="text-2xl font-extrabold text-emerald-700">{totalGuestsCount}</span>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-lg shadow-2xs border border-gray-100">
                <span className="text-gray-500 font-semibold uppercase text-[9px] block mb-1">Жеке өзі</span>
                <span className="font-bold text-gray-800 text-sm">{comingSolo}</span>
              </div>
              <div className="p-2 bg-white rounded-lg shadow-2xs border border-gray-100">
                <span className="text-gray-500 font-semibold uppercase text-[9px] block mb-1">Жұбайымен</span>
                <span className="font-bold text-gray-800 text-sm">{comingWithPartner}</span>
              </div>
              <div className="p-2 bg-white rounded-lg shadow-2xs border border-gray-100">
                <span className="text-gray-500 font-semibold uppercase text-[9px] block mb-1">Болмайды</span>
                <span className="font-bold text-gray-800 text-sm">{declining}</span>
              </div>
            </div>

            {/* Submissions heading with extraction actions */}
            {rsvps.length > 0 && (
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Қонақтар тізімі</span>
                <div className="flex gap-2">
                  <button
                    onClick={copyRSVPsToClipboard}
                    className="flex select-none items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-bold text-gray-700 transition-colors uppercase cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Көшірілді!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Көшіру
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="flex select-none items-center gap-1.5 px-3 py-1.5 bg-[#b59468]/5 hover:bg-[#b59468]/10 text-[#9e7b4f] rounded-lg text-[10px] font-bold transition-colors uppercase cursor-pointer border border-[#ebdcb3]/60"
                  >
                    <Download className="w-3.5 h-3.5" />
                    CSV экспорт
                  </button>
                </div>
              </div>
            )}

            {/* Table or Empty lists State */}
            {rsvps.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center">
                <Users className="w-9 h-9 text-gray-300 stroke-[1.5] mb-2.5" />
                <p className="font-semibold text-gray-400 text-sm leading-relaxed max-w-[210px]">
                  Жауаптар әлі тіркелмеді. Тіркелген RSVP жауаптары осында пайда болады!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {rsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-xs transition-shadow duration-200 relative flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-base text-gray-900 leading-tight">
                        {rsvp.guestName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium font-sans">
                        <span className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[9px] ${
                          rsvp.status === 'yes'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : rsvp.status === 'with_partner'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {rsvp.status === 'yes' && 'Әрине келеді'}
                          {rsvp.status === 'with_partner' && 'Жұбайымен келеді'}
                          {rsvp.status === 'no' && 'Келе алмайды'}
                        </span>
                        <span className="text-gray-400">
                          {rsvp.timestamp}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteRSVP(rsvp.id)}
                      className="p-1 px-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Жою"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={onClearRSVPs}
                  className="w-full text-center py-2.5 mt-4 border border-dashed border-rose-200 hover:bg-rose-50 rounded-lg text-[10px] text-rose-600 font-bold uppercase transition-colors tracking-widest cursor-pointer"
                >
                  Барлық тізімді өшіру
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
