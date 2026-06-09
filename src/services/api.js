import { supabase } from '../lib/supabase';

export const getTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(*), cards(*)')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addTransaction = async (transaction) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      ...transaction,
      user_id: user.id
    }])
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

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const addCategory = async (category) => {
  const { data: { user } } = await supabase.auth.getUser();
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

export const getPeople = async () => {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
};

export const addPerson = async (name) => {
  const { data: { user } } = await supabase.auth.getUser();
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

export const getCards = async () => {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const addCard = async (card) => {
  const { data: { user } } = await supabase.auth.getUser();
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
