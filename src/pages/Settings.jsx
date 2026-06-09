import React from 'react';
import { Download, Upload, Trash2, Smartphone, ShieldCheck, LogOut } from 'lucide-react';
import CreditCardManager from '../components/CreditCardManager';
import CategoryManager from '../components/CategoryManager';
import PersonManager from '../components/PersonManager';
import { supabase } from '../lib/supabase';

const Settings = () => {
  
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
        <h1>Ajustes</h1>
      </header>

      <section style={{ marginBottom: '32px' }}>
        <h2 className="text-secondary" style={{ fontSize: '13px', textTransform: 'uppercase' }}>Inteligência Artificial</h2>
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

      <CategoryManager />
      <CreditCardManager />
      <PersonManager />
      
      <section style={{ marginTop: '20px', marginBottom: '32px' }}>
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
    </div>
  );
};

export default Settings;
