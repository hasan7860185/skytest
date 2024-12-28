export interface Company {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  projects?: Array<{
    id: string;
    name: string;
    description?: string | null;
  }>;
}