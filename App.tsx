import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import POSView from './components/POSView';
import { POSProvider } from './contexts/POSContext';
import ManagerView from './components/ManagerView';
import AdminView from './components/AdminView';
import { UserRole } from './types';
import Header from './components/Header';
import { YjsProvider } from './contexts/YjsContext';

const AppContent: React.FC = () => {
  const { user, role } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <POSProvider>
      <div className="flex flex-col h-screen bg-gray-800 font-sans">
        <Header />
        <main className="flex-grow overflow-hidden">
          {role === UserRole.CASHIER && <POSView />}
          {role === UserRole.MANAGER && <ManagerView />}
          {role === UserRole.ADMIN && <AdminView />}
        </main>
      </div>
    </POSProvider>
  );
};

const App: React.FC = () => {
  return (
    <YjsProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </YjsProvider>
  );
};

export default App;