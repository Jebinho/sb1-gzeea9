import React from 'react';
import { BarChart3, Box, Receipt, DollarSign, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const { darkMode, toggleDarkMode } = useAppContext();
  
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'inventory', icon: Box, label: 'Estoque' },
    { id: 'financial', icon: DollarSign, label: 'Financeiro' },
    { id: 'invoices', icon: Receipt, label: 'Notas Fiscais' }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Gestão de Chinelos</h1>
      </div>
      <nav className="mt-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 transition-colors rounded-lg"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>
      </div>
    </aside>
  );
}