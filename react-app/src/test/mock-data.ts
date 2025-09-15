import { Alert, Investigation, Integration, TeamMember, Metrics, AppState, Incident } from '../types'

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Suspicious PowerShell Activity',
    severity: 'Critical',
    status: 'Active Threat',
    source: 'Microsoft Sentinel',
    timestamp: '2024-01-15T10:30:00Z',
    description: 'Detected encoded PowerShell commands attempting to download external payloads',
    aiAnalysis: 'High confidence malicious activity. PowerShell obfuscation techniques detected.',
    riskScore: 95,
    artifacts: ['powershell.exe', 'encoded_command.ps1', '192.168.1.100'],
    recommendedActions: ['Isolate affected host', 'Collect memory dump', 'Block external IPs']
  },
  {
    id: 'alert-2',
    title: 'Unusual Login Pattern',
    severity: 'Medium',
    status: 'Under Investigation',
    source: 'Azure AD',
    timestamp: '2024-01-15T09:15:00Z',
    description: 'User login from unusual geographic location',
    aiAnalysis: 'Possible account compromise. Login from new country detected.',
    riskScore: 65,
    artifacts: ['user@company.com', '203.0.113.45', 'Chrome/120.0'],
    recommendedActions: ['Verify with user', 'Check for additional suspicious activity']
  }
]

export const mockInvestigations: Investigation[] = [
  {
    id: 'inv-1',
    alertId: 'alert-1',
    status: 'In Progress',
    assignedTo: 'Sarah Chen',
    timeline: [
      { time: '10:30', event: 'Alert triggered by PowerShell execution' },
      { time: '10:35', event: 'Analyst assigned to investigation' },
      { time: '10:40', event: 'Host isolation initiated' }
    ],
    evidence: ['Process execution logs', 'Network traffic capture', 'Memory dump']
  },
  {
    id: 'inv-2',
    alertId: 'alert-2',
    status: 'New',
    assignedTo: 'Mike Rodriguez',
    timeline: [
      { time: '09:15', event: 'Unusual login detected' },
      { time: '09:20', event: 'Investigation created' }
    ],
    evidence: ['Authentication logs', 'IP geolocation data']
  }
]

export const mockIntegrations: Integration[] = [
  {
    name: 'Microsoft Sentinel',
    status: 'Connected',
    lastSync: '2 minutes ago',
    health: 'Healthy'
  },
  {
    name: 'CrowdStrike Falcon',
    status: 'Connected',
    lastSync: '1 minute ago',
    health: 'Healthy'
  },
  {
    name: 'AWS GuardDuty',
    status: 'Degraded',
    lastSync: '15 minutes ago',
    health: 'Warning'
  }
]

export const mockTeamMembers: TeamMember[] = [
  {
    name: 'Sarah Chen',
    role: 'Senior SOC Analyst',
    status: 'Online',
    activeAlerts: 3
  },
  {
    name: 'Mike Rodriguez',
    role: 'SOC Analyst',
    status: 'Online',
    activeAlerts: 2
  },
  {
    name: 'Alex Thompson',
    role: 'Threat Hunter',
    status: 'Away',
    activeAlerts: 1
  }
]

export const mockMetrics: Metrics = {
  totalAlerts: 247,
  alertsTrend: '+12%',
  activeInvestigations: 8,
  investigationsTrend: '-5%',
  resolvedIncidents: 156,
  incidentsTrend: '+8%',
  mttr: '2.3h',
  mttrTrend: '-15%'
}

const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'Data Breach Investigation',
    description: 'Potential data exfiltration detected',
    severity: 'Critical',
    status: 'In Progress',
    assignedTo: 'Sarah Chen',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
]

export const mockAppState: AppState = {
  alerts: mockAlerts,
  investigations: mockInvestigations,
  integrations: mockIntegrations,
  socTeam: mockTeamMembers,
  metrics: mockMetrics,
  incidents: mockIncidents,
  currentSection: 'dashboard',
  selectedInvestigation: null,
  selectedAlert: null,
  loading: {
    alerts: false,
    investigations: false,
    integrations: false,
    metrics: false,
    incidents: false
  },
  errors: {
    alerts: null,
    investigations: null,
    integrations: null,
    metrics: null,
    incidents: null
  }
}

// Helper functions for creating test data variations
export const createMockAlert = (overrides: Partial<Alert> = {}): Alert => ({
  id: 'test-alert',
  title: 'Test Alert',
  severity: 'Medium',
  status: 'Active Threat',
  source: 'Test Source',
  timestamp: new Date().toISOString(),
  description: 'Test alert description',
  aiAnalysis: 'Test AI analysis',
  riskScore: 50,
  artifacts: ['test-artifact'],
  recommendedActions: ['Test action'],
  ...overrides
})

export const createMockInvestigation = (overrides: Partial<Investigation> = {}): Investigation => ({
  id: 'test-investigation',
  alertId: 'test-alert',
  status: 'New',
  assignedTo: 'Test Analyst',
  timeline: [{ time: '10:00', event: 'Test event' }],
  evidence: ['Test evidence'],
  ...overrides
})

export const createMockIntegration = (overrides: Partial<Integration> = {}): Integration => ({
  name: 'Test Integration',
  status: 'Connected',
  lastSync: '1 minute ago',
  health: 'Healthy',
  ...overrides
})