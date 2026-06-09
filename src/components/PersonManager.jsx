import React, { useState, useEffect } from 'react';
import { getPeople, addPerson, deletePerson } from '../services/api';
import { User, Plus, Trash2, X } from 'lucide-react';

const PersonManager = () => {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    try {
      const data = await getPeople();
      setPeople(data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await addPerson(newName.trim());
      setNewName('');
      loadPeople();
    } catch (error) {
      alert('Erro ao adicionar contato');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir este contato?')) {
      try {
        await deletePerson(id);
        loadPeople();
      } catch (error) {
        alert('Erro ao excluir contato');
      }
    }
  };

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(88, 86, 214, 0.1)', padding: '10px', borderRadius: '12px' }}>
          <User size={24} color="#5856d6" />
        </div>
        <h3 style={{ margin: 0 }}>Gerenciar Contatos</h3>
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Nome (Ex: Mãe, Pai...)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ 
            flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '12px', color: 'white', outline: 'none'
          }}
        />
        <button type="submit" style={{ 
          background: 'var(--accent)', border: 'none', color: 'white', 
          width: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Plus size={24} />
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {people.length === 0 && !loading && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', textAlign: 'center' }}>
            Nenhum contato cadastrado.
          </p>
        )}
        {people.map(person => (
          <div key={person.id} className="flex-between" style={{ 
            padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' 
          }}>
            <span style={{ fontWeight: '500' }}>{person.name}</span>
            <button 
              onClick={() => handleDelete(person.id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,59,48,0.5)', cursor: 'pointer' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonManager;
