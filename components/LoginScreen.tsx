import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useYjsArray } from '../hooks/useYjs';
import { User } from '../types';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const users = useYjsArray<User>('users');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">LAN-POS</h1>
          <p className="mt-2 text-gray-400">Select your profile to sign in</p>
        </div>
        <div className="space-y-4">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => login(user.id)}
              className="w-full px-5 py-4 text-left text-lg font-medium text-white bg-gray-700 rounded-lg hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-primary transition-colors duration-200"
            >
              {user.name}
            </button>
          ))}
        </div>
        <div className="text-center text-gray-500 text-sm">
          <p>Offline-First Point of Sale</p>
          <p>Data now syncs automatically over the local network.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
