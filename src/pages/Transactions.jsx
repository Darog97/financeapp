import React, { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../services/api';
import { Search, Filter, Trash2, Wallet } from 'lucide-react';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions
    .filter(t => (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir este lançamento?')) {
      try {
        await deleteTransaction(id);
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (error) {
        alert('Erro ao deletar');
      }
    }
  };

  return (
    <div className="animate-in">
      <header>
        <h1>Histórico</h1>
      </header>

      <div className="card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Search size={20} className="text-secondary" />
        <input 
          type="text" 
          placeholder="Buscar lançamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '8px 0',
            fontSize: '16px',
            outline: 'none',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      <div>
        {filtered.map(t => (
          <div key={t.id} className="card flex-between" style={{ padding: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                background: t.type === 'income' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                padding: '10px',
                borderRadius: '10px'
              }}>
                 <Wallet size={20} color={t.type === 'income' ? 'var(--income)' : 'var(--expense)'} />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{t.description || 'Sem descrição'}</div>
                <div className="text-secondary" style={{ fontSize: '13px' }}>
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700', marginBottom: '4px' }} className={t.type === 'income' ? 'text-income' : 'text-expense'}>
                {t.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(t.value))}
              </div>
              <button 
                onClick={() => handleDelete(t.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '4px' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <p>Nenhum resultado encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
