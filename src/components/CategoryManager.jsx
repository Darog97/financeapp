import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory } from '../services/api';
import { Plus, Trash2, X, Bookmark, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#5856D6', '#AF52DE', '#8E8E93', '#A2845E'
];

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('expense');
  const [newColor, setNewColor] = useState(CATEGORY_COLORS[0]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleAdd = async () => {
    if (!newName) return;
    try {
      await addCategory({
        name: newName,
        type: newType,
        color: newColor,
        icon: 'Bookmark'
      });
      loadCategories();
      setNewName('');
      setShowAdd(false);
    } catch (error) {
      alert('Erro ao cadastrar categoria');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir esta categoria? Os lançamentos vinculados a ela podem ficar sem categoria.')) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        alert('Erro ao excluir');
      }
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div className="flex-between" style={{ marginBottom: '12px' }}>
        <h2 className="text-secondary" style={{ fontSize: '13px', textTransform: 'uppercase', margin: 0 }}>Categorias</h2>
        <button 
          onClick={() => setShowAdd(true)}
          style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '600', fontSize: '14px' }}
        >
          Gerenciar
        </button>
      </div>

      <div className="card" style={{ padding: '16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {categories.map(cat => (
          <div 
            key={cat.id}
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${cat.color}44`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></div>
            <span style={{ fontSize: '13px', color: 'white' }}>{cat.name}</span>
          </div>
        ))}
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
                maxHeight: '90vh', overflowY: 'auto'
              }}
            >
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: 0, color: 'white' }}>Gerenciar Categorias</h3>
                <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                  <X size={24} />
                </button>
              </div>

              {/* Lista para Deletar */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Existentes</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {categories.map(cat => (
                    <div key={cat.id} className="flex-between" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color }}></div>
                        <span style={{ color: 'white' }}>{cat.name}</span>
                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                          {cat.type === 'income' ? 'Receita' : 'Despesa'}
                        </span>
                      </div>
                      <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', color: '#ff3b30' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nova Categoria */}
              <div>
                <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Nova Categoria</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input 
                    type="text" 
                    placeholder="Nome da categoria"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)',
                      border: 'none', padding: '16px', borderRadius: '16px',
                      color: 'white', outline: 'none', fontSize: '16px'
                    }}
                  />

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => setNewType('expense')}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '12px',
                        background: newType === 'expense' ? '#ff3b30' : 'rgba(255,255,255,0.05)',
                        border: 'none', color: 'white', fontWeight: '600'
                      }}
                    >Despesa</button>
                    <button 
                      onClick={() => setNewType('income')}
                      style={{
                        flex: 1, padding: '12px', borderRadius: '12px',
                        background: newType === 'income' ? '#34c759' : 'rgba(255,255,255,0.05)',
                        border: 'none', color: 'white', fontWeight: '600'
                      }}
                    >Receita</button>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', padding: '8px' }}>
                    {CATEGORY_COLORS.map(color => (
                      <button 
                        key={color}
                        onClick={() => setNewColor(color)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: color, border: newColor === color ? '3px solid white' : 'none',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={handleAdd}
                    disabled={!newName}
                    style={{
                      width: '100%', padding: '18px', borderRadius: '18px',
                      background: !newName ? 'rgba(255,255,255,0.1)' : 'var(--accent)',
                      border: 'none', color: 'white', fontWeight: '700', fontSize: '16px'
                    }}
                  >
                    Adicionar Categoria
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManager;
