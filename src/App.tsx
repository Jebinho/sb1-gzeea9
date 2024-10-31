import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Financial from './components/Financial';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'inventory':
        return <Inventory />;
      case 'financial':
        return <Financial />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar onNavigate={setCurrentView} currentView={currentView} />
        <div className="flex-1 overflow-auto">
          {renderView()}
        </div>
      </div>
    </AppProvider>
  );
}