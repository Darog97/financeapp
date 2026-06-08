import Dexie from 'dexie';

export const db = new Dexie('FinanceDB');

db.version(1).stores({
  transactions: '++id, date, categoryId, type, value',
  categories: '++id, name, type, icon, color',
  settings: 'key'
});

// Seed default categories
db.on('populate', () => {
  db.categories.bulkAdd([
    { name: 'Alimentação', icon: 'Utensils', color: '#FF9500', type: 'expense' },
    { name: 'Transporte', icon: 'Car', color: '#007AFF', type: 'expense' },
    { name: 'Lazer', icon: 'Gamepad', color: '#AF52DE', type: 'expense' },
    { name: 'Saúde', icon: 'Heart', color: '#FF3B30', type: 'heart' },
    { name: 'Contas', icon: 'Receipt', color: '#5856D6', type: 'expense' },
    { name: 'Salário', icon: 'Wallet', color: '#34C759', type: 'income' },
    { name: 'Outros', icon: 'MoreHorizontal', color: '#8E8E93', type: 'income' },
  ]);
});

export const getTransactions = () => db.transactions.toArray();
export const addTransaction = (t) => db.transactions.add({ ...t, createdAt: new Date() });
export const deleteTransaction = (id) => db.transactions.delete(id);
