export interface UserStats {
  id: string;
  name: string;
  statuses: Record<string, number>;
  newClients: number;
}

export interface DayData {
  name: string;
  date: Date;
  completed: number;
  pending: number;
  cancelled: number;
  users: UserStats[];
  totalNewClients: number;
}