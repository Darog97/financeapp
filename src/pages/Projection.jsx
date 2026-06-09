import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTransactions } from '../services/api';
import { GoogleGenAI } from "@google/genai";

const Projection = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ 
    balance: 0, 
    last30DaysExpenses: 0, 
    last30DaysIncome: 0,
    futureExpenses: 0,
    upcomingItems: []
  });
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const transactions = await getTransactions();
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      let balance = 0;
      let exp30 = 0;
      let inc30 = 0;
      let futExp = 0;
      const upcoming = [];

      transactions.forEach(t => {
        const val = parseFloat(t.value || t.amount || 0);
        const date = new Date(t.date);
        date.setHours(0, 0, 0, 0);

        if (date <= now) {
          if (t.type === 'income') balance += val;
          else balance -= val;
        }

        if (date <= now && date >= thirtyDaysAgo) {
          if (t.type === 'income') inc30 += val;
          else exp30 += val;
        }

        if (date > now && t.type !== 'income') {
          futExp += val;
          upcoming.push({
            description: t.description || 'Sem descrição',
            value: val,
            date: t.date
          });
        }
      });

      upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

      setStats({ 
        balance, 
        last30DaysExpenses: exp30, 
        last30DaysIncome: inc30,
        futureExpenses: futExp,
        upcomingItems: upcoming.slice(0, 5)
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError('Por favor, configure sua chave da API do Gemini nas configurações.');
      return;
    }
    if (!amount || !description) {
      setError('Preencha o valor e a descrição.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // USANDO A NOVA BIBLIOTECA @google/genai QUE VOCÊ ENCONTROU
      const ai = new GoogleGenAI({ apiKey });
      
      const upcomingText = stats.upcomingItems.map(i => `- ${i.description}: R$ ${i.value.toFixed(2)} (${i.date})`).join('\n');

      const promptData = `
        Você é um consultor financeiro pessoal inteligente e direto.
        Análise de Risco para NOVO GASTO.

        CONTEXTO ATUAL:
        - Saldo Disponível Hoje: R$ ${stats.balance.toFixed(2)}
        - Média de Gastos (últimos 30 dias): R$ ${stats.last30DaysExpenses.toFixed(2)}
        - Média de Receitas (últimos 30 dias): R$ ${stats.last30DaysIncome.toFixed(2)}

        COMPROMISSOS FUTUROS JÁ AGENDADOS:
        - Total Futuro: R$ ${stats.futureExpenses.toFixed(2)}
        ${upcomingText || 'Nenhum compromisso futuro agendado.'}

        PROPOSTA DE NOVO GASTO:
        - Valor: R$ ${parseFloat(amount).toFixed(2)}
        - Descrição: "${description}"

        RESPONDA: Em PORTUGUÊS, de forma SIMPLES, CURTA e DIRETA.
        Diga se "Vale a pena" ou "É arriscado".
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash", // Utilizando o modelo solicitado pelo usuário
        contents: promptData
      });

      setResult(response.text);

    } catch (err) {
      console.error("Gemini Error:", err);
      let detail = err.message || 'Erro desconhecido';
      setError(`Erro do Google (Novo SDK): ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in pb-20">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
           <Brain className="text-primary" size={24} />
           <h1>IA Projeção</h1>
        </div>
        <p className="text-secondary">Simule e analise o impacto futuro</p>
      </header>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="input-group">
          <label>Quanto pretende gastar?</label>
          <div className="amount-input-wrapper">
            <span className="currency-prefix">R$</span>
            <input 
              type="number" 
              placeholder="0,00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
            />
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '16px' }}>
          <label>No que pretende gastar?</label>
          <input 
            type="text" 
            placeholder="Ex: Novo iPhone, Jantar, Viagem..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '12px', 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '16px'
            }}
          />
        </div>

        {error && (
          <div style={{ color: 'var(--expense)', display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px', fontSize: '12px', background: 'rgba(255,59,48,0.1)', padding: '10px', borderRadius: '8px' }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        <button 
          className="btn-primary" 
          onClick={handleAnalyze}
          disabled={loading}
          style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles size={20} />
              </motion.div>
              Analisando...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Analisar Impacto
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ 
              borderLeft: `4px solid ${result.toLowerCase().includes('riscado') ? 'var(--expense)' : 'var(--income)'}`,
              background: 'rgba(255,255,255,0.03)'
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              {result.toLowerCase().includes('riscado') ? (
                <AlertTriangle className="text-expense" size={24} style={{ flexShrink: 0 }} />
              ) : (
                <CheckCircle2 className="text-income" size={24} style={{ flexShrink: 0 }} />
              )}
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                  Análise da IA
                </h3>
                <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-primary)' }}>
                  {result}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section style={{ marginTop: '32px' }}>
        <h2 className="text-secondary" style={{ fontSize: '13px', textTransform: 'uppercase', marginBottom: '12px' }}>Contexto Financeiro</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div className="card" style={{ padding: '16px', marginBottom: 0 }}>
            <div className="text-secondary" style={{ fontSize: '12px' }}>Saldo Hoje</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: stats.balance >= 0 ? 'var(--income)' : 'var(--expense)' }}>
              R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="card" style={{ padding: '16px', marginBottom: 0 }}>
            <div className="text-secondary" style={{ fontSize: '12px' }}>Contas Futuras</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--expense)' }}>
              R$ {stats.futureExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projection;
