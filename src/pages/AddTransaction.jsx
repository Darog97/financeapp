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
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const AddTransaction = ({ onClose, type: initialType = 'expense' }) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState(initialType);
  const [isPaid, setIsPaid] = useState(true);
  const [dateType, setDateType] = useState('today'); // today, yesterday, other
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const inputRef = useRef(null);

  const categories = useLiveQuery(() => 
    db.categories.where('type').equals(type).toArray()
  , [type]) || [];

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    // Default category selection
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const handleSave = async () => {
    if (!value || !selectedCategory) return;
    
    let finalDate = new Date();
    if (dateType === 'yesterday') {
      finalDate.setDate(finalDate.getDate() - 1);
    }

    await db.transactions.add({
      value: parseFloat(value),
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
        
        <div style={{ width: '80px' }}></div> {/* Spacer */}
      </header>

      {/* Value Section */}
      <section className="value-input-section">
        <div className="value-label">Valor da {typeLabel.toLowerCase()}</div>
        <div className="value-input-container">
          <div className="value-display">
            R$ <input 
              ref={inputRef}
              type="number" 
              placeholder="0,00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{
                background: 'none', border: 'none', color: 'white',
                fontSize: '42px', fontWeight: '700', outline: 'none', width: '200px'
              }}
            />
          </div>
          <div className="currency-selector">
            BRL <ChevronDown size={16} />
          </div>
        </div>
      </section>

      {/* Form Body */}
      <div className="form-body-card">
        {/* Paid/Received Toggle */}
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

        {/* Date Selector */}
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

        {/* Description */}
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

        {/* Category */}
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

        {/* Account */}
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

        {/* Attachment */}
        <div className="form-row">
          <div className="form-row-left">
            <ImageIcon size={22} color="#8e8e93" />
            <span style={{ color: 'white' }}>Anexo</span>
          </div>
          <div style={{ color: mainColor }}><ImageIcon size={24} /></div>
        </div>

        <button 
          style={{ background: 'none', border: 'none', color: mainColor, marginTop: '24px', width: '100%', fontWeight: '600' }}
        >
          Mais detalhes
        </button>

        {/* Save Button */}
        <button 
          className="save-button" 
          style={{ background: mainColor }}
          onClick={handleSave}
        >
          Salvar
        </button>
      </div>
    </motion.div>
  );
};

export default AddTransaction;
