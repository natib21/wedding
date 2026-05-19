export interface ScheduleItem {
  time: string;
  event: string;
  location?: string;
}

export interface WeddingData {
  names: string;
  weddingDate: string;
  location: string;
  time?:string;
  locationName?: string;
  guestName?: string;
  slug?: string;
  status?: 'pending' | 'attended';
  heroImage?: string;
  groomImage?: string;
  images?: string[];
  rsvpLink?: string;
  coordinates?: { lat: number; lng: number };
  schedule?: ScheduleItem[];
  features?: string[];
}

export interface TemplateProps {
  data: WeddingData;
}
