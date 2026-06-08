import React, { useState } from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  ArrowUp, 
  ArrowDown, 
  Wallet, 
  Eye, 
  EyeOff, 
  Gift, 
  ChevronDown,
  User
} from 'lucide-react';

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const transactions = useLiveQuery(() => db.transactions.toArray()) || [];
  
  const now = new Date();
  const currentMonthName = now.toLocaleString('pt-BR', { month: 'long' });
  const capitalizedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

  // Stats calculation
  const stats = transactions.reduce((acc, curr) => {
    const val = parseFloat(curr.value) || 0;
    if (curr.type === 'income') acc.income += val;
    else acc.expense += val;
    return acc;
  }, { income: 0, expense: 0 });

  const balance = stats.income - stats.expense;

  const formatCurrency = (val) => {
    if (!showBalance) return 'R$ ••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="animate-in">
      {/* Header */}
      <header className="dashboard-header" style={{ justifyContent: 'center' }}>
        <div className="month-selector">
          {capitalizedMonth} <ChevronDown size={18} />
        </div>
      </header>

      {/* Balance Section */}
      <section className="balance-section">
        <div className="balance-label">Saldo atual em contas</div>
        <div className="balance-value">{formatCurrency(balance)}</div>
        <button className="eye-button" onClick={() => setShowBalance(!showBalance)}>
          {showBalance ? <Eye size={24} /> : <EyeOff size={24} />}
        </button>
      </section>

      {/* Summary Pills */}
      <div className="summary-container">
        <div className="summary-item">
          <div className="summary-icon-circle" style={{ background: '#34c759' }}>
            <ArrowUp size={20} />
          </div>
          <div className="summary-info">
            <span>Receitas</span>
            <strong className="text-income">{formatCurrency(stats.income)}</strong>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon-circle" style={{ background: '#ff3b30' }}>
            <ArrowDown size={20} />
          </div>
          <div className="summary-info">
            <span>Despesas</span>
            <strong className="text-expense">{formatCurrency(stats.expense)}</strong>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <section>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>Atividade recente</h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '14px', fontWeight: '500' }}>
            Ver tudo
          </button>
        </div>

        {transactions.slice(-10).reverse().map(t => (
          <div key={t.id} className="card flex-between" style={{ padding: '14px', marginBottom: '10px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                background: t.type === 'income' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                padding: '10px',
                borderRadius: '12px'
              }}>
                 <Wallet size={20} color={t.type === 'income' ? '#34c759' : '#ff3b30'} />
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>{t.note || 'Sem descrição'}</div>
                <div className="text-secondary" style={{ fontSize: '12px' }}>{new Date(t.date).toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
            <div style={{ fontWeight: '700', fontSize: '15px' }} className={t.type === 'income' ? 'text-income' : 'text-expense'}>
              {showBalance ? (t.type === 'income' ? '+' : '-') + ' ' + formatCurrency(Math.abs(t.value)) : 'R$ •••'}
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <div style={{ marginBottom: '12px', opacity: 0.5 }}>
              <Wallet size={48} style={{ margin: '0 auto' }} />
            </div>
            <p style={{ fontWeight: '500' }}>Tudo limpo por aqui!</p>
            <p style={{ fontSize: '13px' }}>Comece adicionando sua primeira transação.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
