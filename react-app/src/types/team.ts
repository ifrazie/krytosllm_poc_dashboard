/**
 * Team and user-related type definitions
 */

export type TeamMemberStatus = 'Online' | 'Away' | 'Offline';

export type TeamMemberRole = 
  | 'Senior SOC Analyst' 
  | 'SOC Analyst' 
  | 'Threat Hunter' 
  | 'SOC Manager' 
  | 'Incident Responder'
  | 'Security Engineer';

export interface TeamMember {
  name: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  activeAlerts: number;
}

export interface TeamMemberDetails extends TeamMember {
  id: string;
  email?: string;
  avatar?: string;
  department?: string;
  lastActivity?: string;
  permissions?: string[];
  skills?: string[];
}