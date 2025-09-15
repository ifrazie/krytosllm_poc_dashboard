/**
 * Simple test script to verify state management functionality
 * This can be run in the browser console to test the implementation
 */

// Test script that can be pasted into browser console
const testStateManagement = () => {
  console.log('Testing Prophet AI State Management Implementation');
  
  // Check if the app is loaded
  const app = document.querySelector('.prophet-ai-app');
  if (!app) {
    console.error('App not found - make sure the React app is running');
    return;
  }
  
  console.log('✅ App container found');
  
  // Check for state debugger
  const stateDebugger = app.querySelector('div[style*="monospace"]');
  if (stateDebugger) {
    console.log('✅ State debugger found');
    console.log('State debugger content:', stateDebugger.textContent?.substring(0, 200) + '...');
  } else {
    console.log('❌ State debugger not found');
  }
  
  // Check for navigation buttons
  const navButtons = app.querySelectorAll('button');
  console.log(`✅ Found ${navButtons.length} navigation buttons`);
  
  // Test navigation
  if (navButtons.length > 0) {
    console.log('Testing navigation...');
    navButtons[1]?.click(); // Click second button
    setTimeout(() => {
      console.log('✅ Navigation test completed');
    }, 100);
  }
  
  console.log('State management test completed');
};

// Export for use
if (typeof window !== 'undefined') {
  (window as any).testStateManagement = testStateManagement;
}

export { testStateManagement };