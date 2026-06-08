import React, { useState, useEffect } from 'react';
import { db } from './db';
import { 
  LayoutDashboard, 
  History, 
  Plus, 
  BarChart3, 
  Settings as SettingsIcon,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAdd, setShowAdd] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      <nav className="tab-bar glass">
        <button 
          className={`tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={24} />
          <span>Dashboard</span>
        </button>
        <button 
          className={`tab-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <History size={24} />
          <span>Histórico</span>
        </button>
        
        <button className="add-button" onClick={() => setShowAdd(true)}>
          <Plus size={28} />
        </button>

        <button 
          className={`tab-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <BarChart3 size={24} />
          <span>Relatórios</span>
        </button>
        <button 
          className={`tab-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <SettingsIcon size={24} />
          <span>Ajustes</span>
        </button>
      </nav>

      <AnimatePresence>
        {showAdd && (
          <AddTransaction onClose={() => setShowAdd(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
