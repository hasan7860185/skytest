export interface Suggestion {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}