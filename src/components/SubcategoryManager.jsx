import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getCategories, getSubcategoriesByCategory, addSubcategory, deleteSubcategory } from '../services/api';

const SubcategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);

      const subCatsMap = {};
      for (const cat of cats) {
        const subs = await getSubcategoriesByCategory(cat.id);
        subCatsMap[cat.id] = subs;
      }
      setSubcategories(subCatsMap);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = async (categoryId) => {
    const name = newSubcategory[categoryId]?.trim();
    if (!name) return;

    try {
      await addSubcategory({
        name,
        category_id: categoryId,
        color: newSubcategory.color || null,
        icon: null
      });
      setNewSubcategory({ ...newSubcategory, [categoryId]: '' });
      loadData();
    } catch (error) {
      alert('Erro ao adicionar subcategoria');
      console.error(error);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (confirm('Deseja excluir esta subcategoria?')) {
      try {
        await deleteSubcategory(id);
        loadData();
      } catch (error) {
        alert('Erro ao excluir subcategoria');
        console.error(error);
      }
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {categories.map((category) => (
        <div key={category.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '14px', overflow: 'hidden' }}>
          <button
            onClick={() => toggleCategory(category.id)}
            style={{
              width: '100%',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            <span>{category.name}</span>
            {expandedCategory === category.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {expandedCategory === category.id && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {(subcategories[category.id] || []).map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      fontSize: '14px'
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>• {sub.name}</span>
                    <button
                      onClick={() => handleDeleteSubcategory(sub.id)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,59,48,0.5)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Nova subcategoria..."
                  value={newSubcategory[category.id] || ''}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, [category.id]: e.target.value })}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddSubcategory(category.id);
                  }}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
                <button
                  onClick={() => handleAddSubcategory(category.id)}
                  style={{
                    background: 'var(--accent)',
                    border: 'none',
                    color: 'white',
                    width: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubcategoryManager;
