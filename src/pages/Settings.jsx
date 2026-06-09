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

  return (
    <div className="animate-in">
      <header>
        <h1>Ajustes</h1>
      </header>

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
