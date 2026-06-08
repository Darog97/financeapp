import React, { useState, useEffect, useRef } from 'react';
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
  Delete,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addTransaction, getCategories, getCards } from '../services/api';

const AddTransaction = ({ onClose, type: initialType = 'expense' }) => {
  const [value, setValue] = useState('0');
  const [showKeypad, setShowKeypad] = useState(false);
  const [type, setType] = useState(initialType);
  const [isPaid, setIsPaid] = useState(true);
  const [dateType, setDateType] = useState('today');
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    loadInitialData();
  }, [type]);

  const loadInitialData = async () => {
    try {
      const [cats, crds] = await Promise.all([
        getCategories(),
        getCards()
      ]);
      const filteredCats = cats.filter(c => c.type === type);
      setCategories(filteredCats);
      setCards(crds);
      
      if (filteredCats.length > 0) {
        setSelectedCategory(filteredCats[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

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
    } else if (dateType.includes('-')) {
      finalDate = new Date(dateType);
    }

    try {
      await addTransaction({
        value: numericValue,
        type,
        category_id: selectedCategory.id,
        card_id: selectedCard?.id || null,
        date: finalDate.toISOString().split('T')[0],
        description: note,
      });
      
      onClose();
    } catch (error) {
      alert('Erro ao salvar: ' + error.message);
    }
  };

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

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
                onClick={() => {
                  // Aqui poderíamos abrir um date picker nativo
                  const d = prompt("Digite a data (AAAA-MM-DD):", new Date().toISOString().split('T')[0]);
                  if (d) setDateType(d);
                }}
              >{dateType.includes('-') ? dateType : 'Outros'}</button>
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

        {/* Categoria Clicável */}
        <div className="form-row" onClick={() => setShowCategoryPicker(true)} style={{ cursor: 'pointer' }}>
          <div className="form-row-left">
            <Bookmark size={22} color="#8e8e93" />
            <div className="category-badge" style={{ borderColor: selectedCategory?.color || mainColor }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedCategory?.color || mainColor }}></div>
              <span style={{ color: 'white' }}>{selectedCategory?.name || 'Selecionar categoria'}</span>
            </div>
          </div>
          <ChevronRight size={20} color="#3a3a3c" />
        </div>

        {/* Credit Card Selection (only for expenses) */}
        {type === 'expense' && cards.length > 0 && (
          <div className="form-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <div className="form-row-left">
              <CreditCard size={22} color="#8e8e93" />
              <span style={{ color: 'white', fontSize: '14px' }}>Pagar com cartão?</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', width: '100%', padding: '4px 0' }}>
              <button 
                onClick={() => setSelectedCard(null)}
                style={{
                  background: !selectedCard ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                  color: 'white', border: 'none', padding: '6px 12px', borderRadius: '12px',
                  whiteSpace: 'nowrap', fontSize: '12px'
                }}
              >
                Dinheiro / Conta
              </button>
              {cards.map(card => (
                <button 
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  style={{
                    background: selectedCard?.id === card.id ? '#5856d6' : 'rgba(255,255,255,0.05)',
                    color: 'white', border: 'none', padding: '6px 12px', borderRadius: '12px',
                    whiteSpace: 'nowrap', fontSize: '12px'
                  }}
                >
                  {card.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-row-left">
            <Wallet size={22} color="#8e8e93" />
            <div className="category-badge" style={{ borderColor: '#8e8e93' }}>
              <span style={{ color: 'white' }}>Principal (Padrão)</span>
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
      {/* Category Picker Sheet */}
      <AnimatePresence>
        {showCategoryPicker && (
          <motion.div 
            className="keypad-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCategoryPicker(false)}
            style={{ zIndex: 4000 }}
          >
            <motion.div 
              className="keypad-container"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={e => e.stopPropagation()}
              style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}
            >
              <div className="flex-between" style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: 'white' }}>Selecionar Categoria</h3>
                <button onClick={() => setShowCategoryPicker(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                  <X size={24} />
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px 8px',
                      borderRadius: '16px',
                      background: selectedCategory?.id === cat.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)',
                      border: selectedCategory?.id === cat.id ? `1px solid ${cat.color}` : '1px solid rgba(255,255,255,0.05)',
                      color: 'white'
                    }}
                  >
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Bookmark size={18} color="white" />
                    </div>
                    <span style={{ fontSize: '11px', textAlign: 'center' }}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddTransaction;
