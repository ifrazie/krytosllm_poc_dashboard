import '@testing-library/jest-dom'
import React from 'react'

// Mock Chart.js to avoid canvas issues in tests
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  BarElement: vi.fn(),
  ArcElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  Filler: vi.fn(),
}))

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Doughnut: ({ data, options }: any) => 
    React.createElement('div', {
      'data-testid': 'doughnut-chart',
      'data-chart-data': JSON.stringify(data),
      'data-chart-options': JSON.stringify(options)
    }, 'Doughnut Chart Mock'),
  Line: ({ data, options }: any) => 
    React.createElement('div', {
      'data-testid': 'line-chart',
      'data-chart-data': JSON.stringify(data),
      'data-chart-options': JSON.stringify(options)
    }, 'Line Chart Mock'),
  Bar: ({ data, options }: any) => 
    React.createElement('div', {
      'data-testid': 'bar-chart',
      'data-chart-data': JSON.stringify(data),
      'data-chart-options': JSON.stringify(options)
    }, 'Bar Chart Mock'),
  Pie: ({ data, options }: any) => 
    React.createElement('div', {
      'data-testid': 'pie-chart',
      'data-chart-data': JSON.stringify(data),
      'data-chart-options': JSON.stringify(options)
    }, 'Pie Chart Mock'),
}))

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})