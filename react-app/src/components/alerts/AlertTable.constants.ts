/**
 * AlertTable Constants
 * Centralized constants for better maintainability
 */

export const SEVERITY_ICONS = {
  critical: 'fas fa-exclamation-circle',
  high: 'fas fa-exclamation-triangle',
  medium: 'fas fa-exclamation',
  low: 'fas fa-info-circle',
  default: 'fas fa-question-circle'
} as const;

export const STATUS_ICONS = {
  'active threat': 'fas fa-fire',
  'under investigation': 'fas fa-search',
  'auto-contained': 'fas fa-shield-alt',
  'resolved': 'fas fa-check-circle',
  'new': 'fas fa-plus-circle',
  'investigating': 'fas fa-search',
  default: 'fas fa-question-circle'
} as const;

export const RISK_SCORE_THRESHOLDS = {
  critical: 80,
  high: 60,
  medium: 40
} as const;

export const DESCRIPTION_TRUNCATE_LENGTH = 60;
export const ALERT_ID_DISPLAY_LENGTH = 6;