import React from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Reports = () => {
  const transactions = useLiveQuery(() => db.transactions.toArray()) || [];
  const categories = useLiveQuery(() => db.categories.toArray()) || [];

  const expenseData = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const total = transactions
        .filter(t => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.value), 0);
      return { name: cat.name, value: total, color: cat.color };
    })
    .filter(d => d.value > 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="animate-in">
      <header>
        <h1>Relatórios</h1>
      </header>

      <div className="card" style={{ height: '350px', padding: '20px' }}>
        <h2 style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Gasto por Categoria</h2>
        {expenseData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            Sem dados suficientes para gerar o gráfico.
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px' }}>
        <h2>Resumo Mensal</h2>
        <div className="card">
          {expenseData.map(item => (
            <div key={item.name} className="flex-between" style={{ padding: '12px 0', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }}></div>
                <span>{item.name}</span>
              </div>
              <span style={{ fontWeight: '600' }}>{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
