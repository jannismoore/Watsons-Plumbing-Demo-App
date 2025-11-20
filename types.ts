export enum VoiceMode {
  RECEPTION = 'RECEPTION',
  EMERGENCY = 'EMERGENCY'
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Review {
  author: string;
  location: string;
  text: string;
  stars: number;
}
