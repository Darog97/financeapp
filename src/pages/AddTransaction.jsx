import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  CalendarDays, 
  Pencil, 
  Bookmark, 
  Wallet, 
  Image as ImageIcon,
  Heart,
  Delete
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddTransaction = ({ onClose, type: initialType = 'expense' }) => {
  const [value, setValue] = useState('0');
  const [showKeypad, setShowKeypad] = useState(false);
  const [type, setType] = useState(initialType);
  const [isPaid, setIsPaid] = useState(true);
  const [dateType, setDateType] = useState('today');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = useLiveQuery(() => 
    db.categories.where('type').equals(type).toArray()
  , [type]) || [];

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const handleKeypadPress = (key) => {
    if (key === 'backspace') {
      setValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === ',') {
      if (!value.includes(',')) setValue(prev => prev + ',');
    } else if (['+', '-', '*', '/'].includes(key)) {
      // Basic math could be implemented here, for now just append
      setValue(prev => prev + ' ' + key + ' ');
    } else if (key === '=') {
      try {
        // Simple eval-like logic (caution with real eval, but here it's controlled)
        const sanitized = value.replace(/,/g, '.');
        const result = eval(sanitized);
        setValue(result.toString().replace(/\./g, ','));
      } catch (e) {
        // ignore errors
      }
    } else {
      setValue(prev => prev === '0' ? key : prev + key);
    }
  };

  const handleSave = async () => {
    const numericValue = parseFloat(value.replace(/,/g, '.').replace(/\s/g, '')) || 0;
    if (numericValue <= 0 || !selectedCategory) return;
    
    let finalDate = new Date();
    if (dateType === 'yesterday') {
      finalDate.setDate(finalDate.getDate() - 1);
    }

    await db.transactions.add({
      value: numericValue,
      type,
      categoryId: selectedCategory.id,
      date: finalDate.toISOString(),
      note,
      status: isPaid ? 'completed' : 'pending',
      createdAt: new Date()
    });
    
    onClose();
  };

  const mainColor = type === 'income' ? '#34c759' : '#ff2d55';
  const typeLabel = type === 'income' ? 'Receita' : 'Despesa';

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="transaction-modal"
    >
      {/* Header */}
      <header className="transaction-header">
        <button className="btn-cancel" onClick={onClose}>Cancelar</button>
        
        <button 
          className="type-selector-pill" 
          style={{ background: mainColor }}
          onClick={() => setType(type === 'income' ? 'expense' : 'income')}
        >
          {typeLabel} <ChevronDown size={18} />
        </button>
        
        <div style={{ width: '80px' }}></div>
      </header>

      {/* Value Section */}
      <section className="value-input-section" onClick={() => setShowKeypad(true)}>
        <div className="value-label">Valor da {typeLabel.toLowerCase()}</div>
        <div className="value-input-container">
          <div className="value-display">
            R$ <span style={{ color: 'white' }}>{value}</span>
          </div>
          <div className="currency-selector">
            BRL <ChevronDown size={16} />
          </div>
        </div>
      </section>

      {/* Form Body */}
      <div className="form-body-card">
        <div className="form-row">
          <div className="form-row-left">
            <CheckCircle2 size={22} color="#8e8e93" />
            <span style={{ color: 'white' }}>{type === 'income' ? 'Recebido' : 'Pago'}</span>
          </div>
          <label className="switch">
            <input type="checkbox" checked={isPaid} onChange={() => setIsPaid(!isPaid)} />
            <span className={`slider ${type}`}></span>
          </label>
        </div>

        <div className="form-row">
          <div className="form-row-left">
            <CalendarDays size={22} color="#8e8e93" />
            <div className="date-pills">
              <button 
                className={`date-pill ${dateType === 'today' ? `active ${type}` : ''}`}
                onClick={() => setDateType('today')}
              >Hoje</button>
              <button 
                className={`date-pill ${dateType === 'yesterday' ? `active ${type}` : ''}`}
                onClick={() => setDateType('yesterday')}
              >Ontem</button>
              <button 
                className={`date-pill ${dateType === 'other' ? `active ${type}` : ''}`}
                onClick={() => setDateType('other')}
              >Outros</button>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-row-left" style={{ flex: 1 }}>
            <Pencil size={22} color="#8e8e93" />
            <input 
              type="text" 
              placeholder="Descrição"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '16px', outline: 'none', flex: 1 }}
            />
          </div>
          <Heart size={20} color="#8e8e93" />
        </div>

        <div className="form-row">
          <div className="form-row-left">
            <Bookmark size={22} color="#8e8e93" />
            <div className="category-badge" style={{ borderColor: mainColor }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: mainColor }}></div>
              <span style={{ color: 'white' }}>{selectedCategory?.name || 'Selecionar categoria'}</span>
            </div>
          </div>
          <ChevronRight size={20} color="#3a3a3c" />
        </div>

        <div className="form-row">
          <div className="form-row-left">
            <Wallet size={22} color="#8e8e93" />
            <div className="category-badge" style={{ borderColor: '#ff9500' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#ff9500', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>i</div>
              <span style={{ color: 'white' }}>Inter</span>
            </div>
          </div>
          <ChevronRight size={20} color="#3a3a3c" />
        </div>

        {/* Save Button */}
        <button 
          className="save-button" 
          style={{ background: mainColor }}
          onClick={handleSave}
        >
          Salvar
        </button>
      </div>

      {/* Numeric Keypad Overlay */}
      <AnimatePresence>
        {showKeypad && (
          <motion.div 
            className="keypad-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="keypad-container"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="keypad-display">
                <span>R$</span>
                <span className="keypad-current-val">{value}</span>
                <button onClick={() => handleKeypadPress('backspace')} style={{ background: 'none', border: 'none', color: '#8e8e93' }}>
                  <Delete size={28} />
                </button>
              </div>

              <div className="keypad-grid">
                {[7, 8, 9, '+', 4, 5, 6, '-', 1, 2, 3, '*', ',', 0, '=', '/'].map((key) => (
                  <button 
                    key={key} 
                    className={`keypad-btn ${['+', '-', '*', '/', '=', ','].includes(key) ? 'operator' : ''}`}
                    onClick={() => handleKeypadPress(key.toString())}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="keypad-actions">
                <button className="keypad-action-btn cancel" onClick={() => setShowKeypad(false)}>Cancelar</button>
                <button 
                  className={`keypad-action-btn done ${type}`} 
                  onClick={() => setShowKeypad(false)}
                >
                  Pronto
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddTransaction;
