export interface InvitationConfig {
  groomName: string;
  brideName: string;
  weddingDate: string; // e.g. "2026-08-25"
  weddingTime: string; // e.g. "17:00"
  weddingYear: string; // e.g. "2026"
  weddingMonthName: string; // e.g. "Тамыз" or "Август"
  locationName: string;
  locationAddress: string;
  mapUrl: string;
  parentsName: string; // e.g. "Өмірбек - Меруерт" or empty
  audioUrl: string;
  accentColor: 'gold' | 'pink' | 'emerald' | 'burgundy';
}

export interface RSVPResponse {
  id: string;
  guestName: string;
  status: 'yes' | 'with_partner' | 'no';
  timestamp: string;
}
