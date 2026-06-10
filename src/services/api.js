import { supabase } from '../lib/supabase';

// ── Helpers ────────────────────────────────────────────────────────────────
const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Usuário não autenticado');
  return user;
};

// ── Transactions ───────────────────────────────────────────────────────────
export const getTransactions = async () => {
  const user = await getUser();
  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(*), cards(*)')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

export const addTransaction = async (transaction) => {
  const user = await getUser();
  const { data, error } = await supabase
    .from('transactions')
    .insert([{ ...transaction, user_id: user.id }])
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ── Categories ─────────────────────────────────────────────────────────────
export const getCategories = async () => {
  const user = await getUser();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('name');

  if (error) throw error;
  return data;
};

export const addCategory = async (category) => {
  const user = await getUser();
  const { data, error } = await supabase
    .from('categories')
    .insert([{ ...category, user_id: user.id }])
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// ── People ─────────────────────────────────────────────────────────────────
export const getPeople = async () => {
  const user = await getUser();
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('user_id', user.id)
    .order('name');
  if (error) throw error;
  return data;
};

export const addPerson = async (name) => {
  const user = await getUser();
  const { data, error } = await supabase
    .from('people')
    .insert([{ name, user_id: user.id }])
    .select();
  if (error) throw error;
  return data[0];
};

export const deletePerson = async (id) => {
  const { error } = await supabase
    .from('people')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// ── Cards ──────────────────────────────────────────────────────────────────
export const getCards = async () => {
  const user = await getUser();
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)
    .order('name');

  if (error) throw error;
  return data;
};

export const addCard = async (card) => {
  const user = await getUser();
  const { data, error } = await supabase
    .from('cards')
    .insert([{ ...card, user_id: user.id }])
    .select();
  if (error) throw error;
  return data[0];
};

export const deleteCard = async (id) => {
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
