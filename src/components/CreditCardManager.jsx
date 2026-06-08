import React, { useState, useEffect } from 'react';
import { getCards, addCard, deleteCard } from '../services/api';
import { CreditCard, Plus, Trash2, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreditCardManager = () => {
  const [cards, setCards] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newClosing, setNewClosing] = useState('');
  const [newDue, setNewDue] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const data = await getCards();
      setCards(data);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
    }
  };

  const handleAdd = async () => {
    if (!newName || !newClosing || !newDue) return;
    try {
      await addCard({
        name: newName,
        closing_day: parseInt(newClosing),
        due_day: parseInt(newDue)
      });
      loadCards();
      setNewName('');
      setNewClosing('');
      setNewDue('');
      setShowAdd(false);
    } catch (error) {
      alert('Erro ao cadastrar cartão');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir este cartão?')) {
      try {
        await deleteCard(id);
        setCards(cards.filter(c => c.id !== id));
      } catch (error) {
        alert('Erro ao excluir');
      }
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div className="flex-between" style={{ marginBottom: '12px' }}>
        <h2 className="text-secondary" style={{ fontSize: '13px', textTransform: 'uppercase', margin: 0 }}>Meus Cartões</h2>
        <button 
          onClick={() => setShowAdd(true)}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '600', fontSize: '14px' }}
        >
          Adicionar
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {cards.map((card, idx) => (
          <div 
            key={card.id}
            style={{ 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              borderBottom: idx === cards.length - 1 ? 'none' : '0.5px solid rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--accent)'
              }}>
                <CreditCard size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{card.name}</div>
                <div className="text-secondary" style={{ fontSize: '12px' }}>
                  Fecha dia {card.closing_day} • Vence dia {card.due_day}
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(card.id)}
              style={{ background: 'none', border: 'none', color: 'var(--expense)', opacity: 0.7 }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {cards.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Nenhum cartão cadastrado.
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.8)', zIndex: 3000,
              display: 'flex', alignItems: 'flex-end'
            }}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              style={{
                background: 'var(--card-bg)', width: '100%',
                borderRadius: '24px 24px 0 0', padding: '24px',
                paddingBottom: 'calc(24px + var(--safe-area-bottom))'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: 0 }}>Adicionar Cartão</h3>
                <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nome do Cartão</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Nubank, Inter..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)',
                      border: 'none', padding: '12px', borderRadius: '12px',
                      color: 'white', outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Dia Fechamento</label>
                    <input 
                      type="number" 
                      placeholder="1 a 31"
                      min="1" max="31"
                      value={newClosing}
                      onChange={(e) => setNewClosing(e.target.value)}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.05)',
                        border: 'none', padding: '12px', borderRadius: '12px',
                        color: 'white', outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Dia Vencimento</label>
                    <input 
                      type="number" 
                      placeholder="1 a 31"
                      min="1" max="31"
                      value={newDue}
                      onChange={(e) => setNewDue(e.target.value)}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.05)',
                        border: 'none', padding: '12px', borderRadius: '12px',
                        color: 'white', outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAdd}
                  disabled={!newName || !newClosing || !newDue}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '16px',
                    background: (!newName || !newClosing || !newDue) ? 'rgba(255,255,255,0.1)' : 'var(--accent)',
                    border: 'none', color: 'white', fontWeight: '700', fontSize: '16px',
                    marginTop: '12px'
                  }}
                >
                  Confirmar Cadastro
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreditCardManager;
