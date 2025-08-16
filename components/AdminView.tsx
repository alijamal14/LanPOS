
import React from 'react';
import SystemInfo from './SystemInfo';

const AdminView: React.FC = () => {
  return (
    <div className="p-8 text-white h-full overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6">Admin Panel</h1>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-brand-secondary">System Information & Architecture</h2>
        <p className="text-gray-400 mb-6">
          This section provides details on the application's architecture, stack, deployment, and security as requested.
        </p>
        <SystemInfo />
      </div>
    </div>
  );
};

export default AdminView;
