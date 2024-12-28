export type ClientStatus = 'new' | 'potential' | 'interested' | 'responded' | 'noResponse' | 
  'scheduled' | 'postMeeting' | 'whatsappContact' | 'facebookContact' | 'booked' | 'cancelled' | 
  'sold' | 'postponed' | 'resale';

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
  phone: string;
  country: string;
  email?: string;
  city?: string;
  project?: string;
  budget?: string;
  salesPerson?: string;
  contactMethod: string;
  facebook?: string;
  campaign?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  assignedTo?: string;
  rating?: number;
  nextActionDate?: Date;
  nextActionType?: string;
  comments?: string[];
  post_url?: string;
  comment?: string;
}