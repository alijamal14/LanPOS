
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from './icons/Icons';

const Header: React.FC = () => {
  const { user, role, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
      <div className="text-xl font-bold">LAN-POS</div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
            <div>
                <div className="font-semibold">{user?.name}</div>
                <div className="text-xs text-gray-400 capitalize">{role}</div>
            </div>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition"
          aria-label="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
