import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { X, Check, Calendar, Type } from 'lucide-react';
import { motion } from 'framer-motion';

const AddTransaction = ({ onClose, type: initialType = 'expense' }) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState('');
  const inputRef = useRef(null);

  const categories = useLiveQuery(() => 
    db.categories.where('type').equals(type).toArray()
  , [type]) || [];

  useEffect(() => {
    // Focar o input de valor ao abrir
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSave = async () => {
    if (!value || !selectedCategory) return;
    
    await db.transactions.add({
      value: parseFloat(value),
      type,
      categoryId: selectedCategory.id,
      date: new Date().toISOString(),
      note,
      createdAt: new Date()
    });
    
    onClose();
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="glass"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        color: 'var(--text-primary)'
      }}
    >
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--accent)' }}>Cancelar</button>
        <span style={{ fontWeight: '600' }}>Novo Lançamento</span>
        <button 
          onClick={handleSave} 
          disabled={!value || !selectedCategory}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: (!value || !selectedCategory) ? 'var(--text-secondary)' : 'var(--accent)',
            fontWeight: '600'
          }}
        >
          Salvar
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ 
          background: 'rgba(142, 142, 147, 0.12)', 
          padding: '4px', 
          borderRadius: '10px',
          display: 'flex',
          gap: '2px'
        }}>
          <button 
            onClick={() => setType('expense')}
            style={{
              padding: '6px 20px',
              borderRadius: '8px',
              border: 'none',
              background: type === 'expense' ? 'var(--card-bg)' : 'transparent',
              boxShadow: type === 'expense' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              color: type === 'expense' ? 'var(--expense)' : 'var(--text-secondary)',
              fontWeight: type === 'expense' ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            Despesa
          </button>
          <button 
            onClick={() => setType('income')}
            style={{
              padding: '6px 20px',
              borderRadius: '8px',
              border: 'none',
              background: type === 'income' ? 'var(--card-bg)' : 'transparent',
              boxShadow: type === 'income' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              color: type === 'income' ? 'var(--income)' : 'var(--text-secondary)',
              fontWeight: type === 'income' ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            Receita
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Valor</div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '32px', fontWeight: '700' }}>R$</span>
          <input 
            ref={inputRef}
            type="number" 
            pattern="\d*"
            placeholder="0,00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              fontSize: '48px',
              fontWeight: '700',
              background: 'none',
              border: 'none',
              width: '200px',
              outline: 'none',
              color: 'var(--text-primary)',
              textAlign: 'left'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>Categoria</div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '12px' 
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                opacity: selectedCategory?.id === cat.id ? 1 : 0.5,
                transform: selectedCategory?.id === cat.id ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ 
                background: cat.color, 
                width: '50px', 
                height: '50px', 
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: selectedCategory?.id === cat.id ? `0 4px 12px ${cat.color}66` : 'none'
              }}>
                {/* Fallback icon if Lucide isn't dynamic enough here */}
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{cat.name[0]}</div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: '500' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Type size={18} className="text-secondary" />
        <input 
          type="text"
          placeholder="Observação (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '12px 0',
            fontSize: '16px',
            outline: 'none',
            color: 'var(--text-primary)'
          }}
        />
      </div>
    </motion.div>
  );
};

export default AddTransaction;
