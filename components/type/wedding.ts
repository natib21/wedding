export interface WeddingData {
 names: string;
    weddingDate: string;
    heroImage?: string;
    groomImage?: string;
    images?: string[];
    rsvpLink?: string;
    location: string;
    locationName?: string;
    guestName?: string;
    coordinates?: { lat: number; lng: number };
    schedule?: Array<{ time: string; event: string }>;
    features?: string[];
    slug?: string;
    status?: 'pending' | 'attended';
}

export interface TemplateProps {
  data: WeddingData;
}