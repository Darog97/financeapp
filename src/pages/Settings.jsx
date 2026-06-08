import React from 'react';
import { db } from '../db';
import { Download, Upload, Trash2, Smartphone, ShieldCheck } from 'lucide-react';
import CreditCardManager from '../components/CreditCardManager';

const Settings = () => {
  
  const exportData = async () => {
    const transactions = await db.transactions.toArray();
    const categories = await db.categories.toArray();
    const data = JSON.stringify({ transactions, categories }, null, 2);
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (confirm('Isso irá substituir seus dados atuais. Continuar?')) {
          await db.transactions.clear();
          await db.categories.clear();
          await db.transactions.bulkAdd(data.transactions);
          await db.categories.bulkAdd(data.categories);
          alert('Dados importados com sucesso!');
          window.location.reload();
        }
      } catch (err) {
        alert('Erro ao importar arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const resetData = async () => {
    if (confirm('TEM CERTEZA? Todos os seus dados serão apagados permanentemente.')) {
      await db.delete();
      window.location.reload();
    }
  };

  return (
    <div className="animate-in">
      <header>
        <h1>Ajustes</h1>
      </header>

      <section style={{ marginBottom: '32px' }}>
        <h2 className="text-secondary" style={{ fontSize: '13px', textTransform: 'uppercase' }}>Dados</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <button 
            onClick={exportData}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '16px', 
              background: 'none', 
              border: 'none',
              borderBottom: '0.5px solid rgba(0,0,0,0.05)',
              textAlign: 'left',
              color: 'var(--text-primary)',
              fontSize: '16px'
            }}
          >
            <Download size={20} className="text-accent" />
            <span>Exportar Backup (JSON)</span>
          </button>
          
          <label style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '16px', 
            cursor: 'pointer',
            borderBottom: '0.5px solid rgba(0,0,0,0.05)',
          }}>
            <Upload size={20} className="text-accent" />
            <span style={{ fontSize: '16px' }}>Importar Backup</span>
            <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
          </label>

          <button 
            onClick={resetData}
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
            <Trash2 size={20} />
            <span>Apagar Tudo</span>
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
               <div className="text-secondary" style={{ fontSize: '13px' }}>1.0.0 (Offline-first)</div>
             </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <ShieldCheck size={20} className="text-secondary" />
             <div>
               <div style={{ fontWeight: '500' }}>Privacidade</div>
               <div className="text-secondary" style={{ fontSize: '13px' }}>Seus dados nunca saem deste dispositivo.</div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
