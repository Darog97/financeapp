import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Verifique seu e-mail para confirmar o cadastro!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>{isSignUp ? 'Criar Conta' : 'Entrar'}</h2>
      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '1rem', 
            borderRadius: '8px', 
            background: '#007AFF', 
            color: 'white', 
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          {loading ? 'Carregando...' : isSignUp ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>
      <button 
        onClick={() => setIsSignUp(!isSignUp)}
        style={{ background: 'none', border: 'none', color: '#007AFF', marginTop: '1rem', cursor: 'pointer' }}
      >
        {isSignUp ? 'Já tem conta? Entre aqui' : 'Não tem conta? Crie agora'}
      </button>
    </div>
  );
}
