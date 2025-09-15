import React from 'react';
import { useAppContext } from '../../context/AppContext';

export const SimpleAlertTable: React.FC = () => {
  const { state } = useAppContext();
  const { alerts, loading } = state;

  if (loading.alerts) {
    return <div>Loading alerts...</div>;
  }

  if (alerts.length === 0) {
    return <div>No alerts found</div>;
  }

  return (
    <div style={{ background: 'white', color: 'black', padding: '20px', margin: '20px' }}>
      <h3>Simple Alert Table Debug</h3>
      <p>Alert count: {alerts.length}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Title</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Severity</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, index) => (
            <tr key={alert.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{alert.id}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{alert.title}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{alert.severity}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{alert.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};