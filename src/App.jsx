import React, { useState, useEffect } from 'react';
import { db } from './db';
import {
  LayoutDashboard,
  Plus,
  MoreVertical,
  ArrowUpCircle,
  ArrowDownCircle,
  CreditCard,
  Brain,
  Target,
  Layers,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Settings from './pages/Settings';
import Projection from './pages/Projection';
import Planning from './pages/Planning';

import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
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
      case 'reports': return <Reports />;
      case 'projection': return <Projection />;
      case 'planning': return <Planning />;
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
          onClick={() => {
            setActiveTab('dashboard');
            setShowMoreMenu(false);
          }}
        >
          <LayoutDashboard size={24} />
          <span>Principal</span>
        </button>

        <button
          className={`tab-item ${activeTab === 'projection' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('projection');
            setShowMoreMenu(false);
          }}
        >
          <Brain size={24} />
          <span>IA</span>
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
          className={`tab-item ${activeTab === 'planning' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('planning');
            setShowMoreMenu(false);
          }}
        >
          <Target size={24} />
          <span>Planejamento</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className={`tab-item ${showMoreMenu ? 'active' : ''}`}
            onClick={() => setShowMoreMenu(!showMoreMenu)}
          >
            <MoreVertical size={24} />
            <span>Mais</span>
          </button>

          <AnimatePresence>
            {showMoreMenu && (
              <motion.div
                className="more-menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute',
                  bottom: '70px',
                  right: 0,
                  background: 'var(--bg-secondary)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  zIndex: 100,
                  minWidth: '200px',
                  overflow: 'hidden'
                }}
              >
                <button
                  className="more-menu-item"
                  onClick={() => {
                    setActiveTab('settings');
                    setShowMoreMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 16px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  <Layers size={18} />
                  <span>Categorias</span>
                </button>

                <button
                  className="more-menu-item"
                  onClick={() => {
                    setActiveTab('settings');
                    setShowMoreMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 16px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  <Brain size={18} />
                  <span>Inteligência Artificial</span>
                </button>

                <button
                  className="more-menu-item"
                  onClick={() => {
                    setActiveTab('settings');
                    setShowMoreMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 16px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  <CreditCard size={18} />
                  <span>Meus Cartões</span>
                </button>

                <button
                  className="more-menu-item"
                  onClick={() => {
                    setActiveTab('settings');
                    setShowMoreMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 16px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <User size={18} />
                  <span>Contatos</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
