export interface MessengerStats {
  id: string;
  user_id: string;
  sent_count: number;
  received_count: number;
  created_at: string;
  updated_at: string;
  users?: { id: string; name: string; count: number }[];
}