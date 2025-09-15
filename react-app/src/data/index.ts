/**
 * Data exports for the Prophet AI SOC Platform
 * This file re-exports all data and utilities from their respective modules
 */

// Re-export all mock data from mockData.ts
export * from './mockData';

// Re-export data management utilities
export { dataManager, DataManager } from './dataManager';
export { realTimeSimulator, simulateNewAlert, simulateTeamStatusChange, simulateIntegrationStatusChange } from './realTimeSimulation';
export type { RealTimeSimulatorType } from './realTimeSimulation';
export { dataInitializer, DataInitializer, DataValidator, initializeData, reinitializeData, getDataStats, exportData, isDataInitialized } from './dataInitializer';

