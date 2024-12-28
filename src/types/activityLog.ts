export type ActivityLogType = 'create' | 'update' | 'delete';
export type EntityType = 'user' | 'client' | 'project' | 'task';

export interface ActivityLog {
  id: string;
  user_id: string;
  action_type: ActivityLogType;
  entity_type: EntityType;
  entity_id: string;
  details: {
    old_data?: any;
    new_data?: any;
  };
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar: string | null;
  };
}