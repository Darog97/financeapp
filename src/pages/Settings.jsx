import React from 'react';
import { Layers, Brain, CreditCard, User, LogOut, Smartphone, ShieldCheck } from 'lucide-react';
import CreditCardManager from '../components/CreditCardManager';
import CategoryManager from '../components/CategoryManager';
import SubcategoryManager from '../components/SubcategoryManager';
import PersonManager from '../components/PersonManager';
import { supabase } from '../lib/supabase';

const Settings = () => {
  const [activeSection, setActiveSection] = React.useState('menu');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const [apiKey, setApiKey] = React.useState(localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    alert('Chave salva com sucesso!');
  };

  return (
    <div className="animate-in">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          {activeSection !== 'menu' && (
            <button
              onClick={() => setActiveSection('menu')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px'
              }}
            >
              ←
            </button>
          )}
          <h1 style={{ margin: 0 }}>
            {activeSection === 'menu' && 'Mais'}
            {activeSection === 'categories' && 'Categorias'}
            {activeSection === 'ai' && 'Inteligência Artificial'}
            {activeSection === 'cards' && 'Meus Cartões'}
            {activeSection === 'contacts' && 'Contatos'}
          </h1>
        </div>
      </header>

      {activeSection === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => setActiveSection('categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <Layers size={20} />
            <span>Categorias</span>
          </button>

          <button
            onClick={() => setActiveSection('ai')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <Brain size={20} />
            <span>Inteligência Artificial</span>
          </button>

          <button
            onClick={() => setActiveSection('cards')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <CreditCard size={20} />
            <span>Meus Cartões</span>
          </button>

          <button
            onClick={() => setActiveSection('contacts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <User size={20} />
            <span>Contatos</span>
          </button>
        </div>
      )}

      {activeSection === 'categories' && (
        <>
          <CategoryManager />
          <div style={{ marginTop: '24px' }}>
            <h2 className="text-secondary" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '16px' }}>Subcategorias</h2>
            <SubcategoryManager />
          </div>
        </>
      )}

      {activeSection === 'ai' && (
        <section style={{ marginBottom: '32px' }}>
          <div className="card">
            <div className="input-group">
              <label style={{ fontSize: '12px', marginBottom: '8px', display: 'block' }}>Gemini API Key</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  placeholder="Cole sua chave aqui..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={saveApiKey}
                  className="btn-primary"
                  style={{ padding: '0 16px' }}
                >
                  Salvar
                </button>
              </div>
            </div>
            <p className="text-secondary" style={{ fontSize: '11px', marginTop: '8px' }}>
              Usamos sua chave para rodar as projeções financeiras. Seus dados não saem do app.
            </p>
          </div>
        </section>
      )}

      {activeSection === 'cards' && <CreditCardManager />}

      {activeSection === 'contacts' && <PersonManager />}

      {activeSection === 'menu' && (
        <>
          <section style={{ marginTop: '32px', marginBottom: '32px' }}>
            <h2 className="text-secondary" style={{ fontSize: '13px', textTransform: 'uppercase' }}>Conta Online</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  color: 'var(--expense)',
                  fontSize: '16px'
                }}
              >
                <LogOut size={20} />
                <span>Sair da Conta</span>
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-secondary" style={{ fontSize: '13px', textTransform: 'uppercase' }}>Sobre</h2>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Smartphone size={20} className="text-secondary" />
                <div>
                  <div style={{ fontWeight: '500' }}>Versão do App</div>
                  <div className="text-secondary" style={{ fontSize: '13px' }}>2.0.0 (Supabase Online)</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={20} className="text-secondary" />
                <div>
                  <div style={{ fontWeight: '500' }}>Sincronização Nuvem</div>
                  <div className="text-secondary" style={{ fontSize: '13px' }}>Seus dados estão criptografados no Supabase.</div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Settings;
