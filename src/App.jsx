import React, { useState, useEffect } from 'react';
import { db } from './db';
import { 
  LayoutDashboard, 
  History, 
  Plus, 
  BarChart3, 
  Settings as SettingsIcon,
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Cards from './pages/Cards';

import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [addType, setAddType] = useState('expense');
  const [showAdd, setShowAdd] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Ouvir mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'cards': return <Cards />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  const handleOpenAdd = (type) => {
    setAddType(type);
    setShowQuickMenu(false);
    setShowAdd(true);
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

      {/* Quick Menu Backdrop */}
      <AnimatePresence>
        {showQuickMenu && (
          <motion.div 
            className="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickMenu(false)}
          />
        )}
      </AnimatePresence>

      <nav className="tab-bar glass">
        <button 
          className={`tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={24} />
          <span>Principal</span>
        </button>
        <button 
          className={`tab-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <History size={24} />
          <span>Histórico</span>
        </button>
        
        <div className="add-button-container">
          <AnimatePresence>
            {showQuickMenu && (
              <>
                <motion.button
                  className="quick-menu-item income"
                  initial={{ y: 0, x: 0, opacity: 0, scale: 0 }}
                  animate={{ y: -80, x: -60, opacity: 1, scale: 1 }}
                  exit={{ y: 0, x: 0, opacity: 0, scale: 0 }}
                  onClick={() => handleOpenAdd('income')}
                >
                  <div className="icon-circle"><ArrowUpCircle size={24} /></div>
                  <span>Receita</span>
                </motion.button>

                <motion.button
                  className="quick-menu-item"
                  initial={{ y: 0, x: 0, opacity: 0, scale: 0 }}
                  animate={{ y: -130, x: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 0, x: 0, opacity: 0, scale: 0 }}
                  onClick={() => handleOpenAdd('card')}
                  style={{ color: '#5856d6' }}
                >
                  <div className="icon-circle" style={{ background: 'rgba(88, 86, 214, 0.1)' }}><CreditCard size={24} /></div>
                  <span>Cartão</span>
                </motion.button>

                <motion.button
                  className="quick-menu-item expense"
                  initial={{ y: 0, x: 0, opacity: 0, scale: 0 }}
                  animate={{ y: -80, x: 60, opacity: 1, scale: 1 }}
                  exit={{ y: 0, x: 0, opacity: 0, scale: 0 }}
                  onClick={() => handleOpenAdd('expense')}
                >
                  <div className="icon-circle"><ArrowDownCircle size={24} /></div>
                  <span>Despesa</span>
                </motion.button>
              </>
            )}
          </AnimatePresence>

          <button 
            className={`add-button ${showQuickMenu ? 'open' : ''}`} 
            onClick={() => setShowQuickMenu(!showQuickMenu)}
          >
            <motion.div
              animate={{ rotate: showQuickMenu ? 135 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Plus size={28} />
            </motion.div>
          </button>
        </div>

        <button 
          className={`tab-item ${activeTab === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          <CreditCard size={24} />
          <span>Cartões</span>
        </button>
        <button 
          className={`tab-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <SettingsIcon size={24} />
          <span>Mais</span>
        </button>
      </nav>

      <AnimatePresence>
        {showAdd && (
          <AddTransaction 
            type={addType} 
            onClose={() => setShowAdd(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
