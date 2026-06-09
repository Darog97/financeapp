import React, { useState, useEffect } from 'react';
import { Target, PieChart, AlertCircle, ChevronRight, Edit3, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories, getTransactions, supabase } from '../services/api';

const Planning = () => {
  const [categories, setCategories] = useState([]);
  const [spendingByCategory, setSpendingByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, transactions] = await Promise.all([
        getCategories(),
        getTransactions()
      ]);

      // Filtrar gastos do mês atual
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlySpent = {};
      transactions.forEach(t => {
        const tDate = new Date(t.date);
        if (tDate >= firstDayOfMonth && t.type === 'expense') {
          const catId = t.category_id;
          monthlySpent[catId] = (monthlySpent[catId] || 0) + parseFloat(t.value || t.amount || 0);
        }
      });

      setSpendingByCategory(monthlySpent);
      setCategories(cats);
    } catch (err) {
      console.error("Erro ao carregar planejamento:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLimit = async (id) => {
    try {
      const limit = parseFloat(editValue) || 0;
      
      // Tentar atualizar no Supabase (esperando que a coluna budget_limit exista ou ignorando erro)
      const { error } = await supabase
        .from('categories')
        .update({ budget_limit: limit })
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.map(c => c.id === id ? { ...c, budget_limit: limit } : c));
      setEditingId(null);
    } catch (err) {
      console.error("Erro ao salvar limite:", err);
      // Fallback: se a coluna não existir, poderíamos usar localStorage, 
      // mas vamos assumir que o usuário pode adicionar a coluna ou que já existe.
      alert("Erro ao salvar no banco. Verifique se a coluna 'budget_limit' existe na tabela 'categories'.");
    }
  };

  const startEditing = (cat) => {
    setEditingId(cat.id);
    setEditValue(cat.budget_limit || '');
  };

  if (loading) return <div className="p-20 text-center text-secondary">Carregando planejamento...</div>;

  const totalBudget = categories.reduce((acc, cat) => acc + (cat.budget_limit || 0), 0);
  const totalSpent = Object.values(spendingByCategory).reduce((acc, val) => acc + val, 0);

  return (
    <div className="animate-in pb-20">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
           <Target className="text-primary" size={24} />
           <h1>Planejamento</h1>
        </div>
        <p className="text-secondary">Metas de gastos por categoria</p>
      </header>

      {/* Resumo Geral */}
      <div className="card" style={{ background: 'var(--accent)', color: 'white', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ opacity: 0.8, fontSize: '13px' }}>Orçamento Total</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>R$ {totalBudget.toLocaleString('pt-BR')}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ opacity: 0.8, fontSize: '13px' }}>Gasto no Mês</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>R$ {totalSpent.toLocaleString('pt-BR')}</div>
          </div>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            style={{ height: '100%', background: 'white' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {categories.filter(c => c.type === 'expense').map(cat => {
          const spent = spendingByCategory[cat.id] || 0;
          const limit = cat.budget_limit || 0;
          const percentage = limit > 0 ? (spent / limit) * 100 : 0;
          const isOver = limit > 0 && spent > limit;

          return (
            <div key={cat.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }}></div>
                  <span style={{ fontWeight: '600' }}>{cat.name}</span>
                </div>
                
                {editingId === cat.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input 
                      type="number" 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      style={{ 
                        width: '80px', padding: '4px 8px', borderRadius: '8px', 
                        background: 'var(--bg-secondary)', border: '1px solid var(--accent)',
                        color: 'var(--text-primary)', fontSize: '14px'
                      }}
                    />
                    <button onClick={() => handleUpdateLimit(cat.id)} className="text-income"><Check size={18} /></button>
                    <button onClick={() => setEditingId(null)} className="text-expense"><X size={18} /></button>
                  </div>
                ) : (
                  <div 
                    onClick={() => startEditing(cat)}
                    style={{ fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {limit > 0 ? `R$ ${limit}` : 'Definir limite'}
                    <Edit3 size={14} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span className="text-secondary">Gasto: R$ {spent.toFixed(2)}</span>
                <span style={{ color: isOver ? 'var(--expense)' : 'var(--text-secondary)' }}>
                  {limit > 0 ? `${percentage.toFixed(0)}%` : '0%'}
                </span>
              </div>

              <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  style={{ 
                    height: '100%', 
                    background: isOver ? 'var(--expense)' : (percentage > 80 ? '#ff9500' : 'var(--income)')
                  }}
                />
              </div>

              {isOver && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: 'var(--expense)', fontSize: '11px' }}>
                  <AlertCircle size={12} />
                  <span>Você ultrapassou o limite nesta categoria!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Planning;
