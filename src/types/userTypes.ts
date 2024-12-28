export interface UserDetails {
  id: string;
  full_name: string | null;
  avatar: string | null;
  role: string | null;
}

export type TimeRange = "all" | "daily" | "weekly" | "monthly";

export interface TopUser {
  user_id: string;
  full_name: string | null;
  role: string | null;
  avatar: string | null;
  action_count: number;
}