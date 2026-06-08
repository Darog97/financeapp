import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

const Dashboard = () => {
  const transactions = useLiveQuery(() => db.transactions.toArray()) || [];
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthStats = transactions.reduce((acc, curr) => {
    const d = new Date(curr.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      if (curr.type === 'income') acc.income += curr.value;
      else acc.expense += curr.value;
    }
    return acc;
  }, { income: 0, expense: 0 });

  const stats = transactions.reduce((acc, curr) => {
    const val = parseFloat(curr.value) || 0;
    if (curr.type === 'income') acc.income += val;
    else acc.expense += val;
    return acc;
  }, { income: 0, expense: 0 });

  const balance = stats.income - stats.expense;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="animate-in">
      <header style={{ marginTop: '20px' }}>
        <p className="text-secondary" style={{ marginBottom: '4px' }}>Saldo Total</p>
        <h1 style={{ marginBottom: '32px' }}>{formatCurrency(balance)}</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--income)' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <ArrowUpCircle size={20} className="text-income" />
            <span className="text-secondary" style={{ fontSize: '13px' }}>Este Mês</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatCurrency(currentMonthStats.income)}</div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--expense)' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <ArrowDownCircle size={20} className="text-expense" />
            <span className="text-secondary" style={{ fontSize: '13px' }}>Gastos</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatCurrency(currentMonthStats.expense)}</div>
        </div>
      </div>

      <section>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h2>Últimas Atividades</h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '15px' }}>Ver tudo</button>
        </div>

        {transactions.slice(-5).reverse().map(t => (
          <div key={t.id} className="card flex-between" style={{ padding: '12px 16px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                background: t.type === 'income' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                padding: '8px',
                borderRadius: '8px'
              }}>
                 <Wallet size={20} color={t.type === 'income' ? 'var(--income)' : 'var(--expense)'} />
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>{t.note || 'Sem descrição'}</div>
                <div className="text-secondary" style={{ fontSize: '12px' }}>{new Date(t.date).toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
            <div style={{ fontWeight: '600' }} className={t.type === 'income' ? 'text-income' : 'text-expense'}>
              {t.type === 'income' ? '+' : '-'} {formatCurrency(Math.abs(t.value))}
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>Nenhuma movimentação ainda.</p>
            <p style={{ fontSize: '14px' }}>Toque em + para começar.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
