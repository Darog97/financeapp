import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTransactions } from '../services/api';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

        // Saldo atual considera tudo até hoje
        if (date <= now) {
          if (t.type === 'income') balance += val;
          else balance -= val;
        }

        // Fluxo dos últimos 30 dias
        if (date <= now && date >= thirtyDaysAgo) {
          if (t.type === 'income') inc30 += val;
          else exp30 += val;
        }

        // Compromissos futuros
        if (date > now && t.type !== 'income') {
          futExp += val;
          upcoming.push({
            description: t.description || 'Sem descrição',
            value: val,
            date: t.date
          });
        }
      });

      // Ordenar próximos compromissos por data e pegar os 5 primeiros
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
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const upcomingText = stats.upcomingItems.map(i => `- ${i.description}: R$ ${i.value.toFixed(2)} (${i.date})`).join('\n');

      const prompt = `
        Você é um consultor financeiro pessoal inteligente e direto.
        Análise de Risco para NOVO GASTO.

        CONTEXTO ATUAL:
        - Saldo Disponível Hoje: R$ ${stats.balance.toFixed(2)}
        - Média de Gastos (últimos 30 dias): R$ ${stats.last30DaysExpenses.toFixed(2)}
        - Média de Receitas (últimos 30 dias): R$ ${stats.last30DaysIncome.toFixed(2)}

        COMPROMISSOS FUTUROS JÁ AGENDADOS (Parcelas, contas etc):
        - Total Futuro: R$ ${stats.futureExpenses.toFixed(2)}
        - Próximos itens:
        ${upcomingText || 'Nenhum compromisso futuro agendado.'}

        PROPOSTA DE NOVO GASTO:
        - Valor: R$ ${parseFloat(amount).toFixed(2)}
        - Descrição: "${description}"

        CONSIDERE: O saldo atual MENOS os compromissos futuros. Se o novo gasto for maior que o que "sobra" após as contas futuras, o risco é ALTO.
        
        RESPONDA: Em PORTUGUÊS, de forma SIMPLES, CURTA e DIRETA (máximo 3 frases).
        Diga explicitamente se "Vale a pena" ou "É arriscado".
        Seja sincero sobre o impacto real no futuro (ex: "Isso vai te deixar sem margem para suas próximas 3 parcelas").
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setResult(text);
    } catch (err) {
      console.error("Gemini Error:", err);
      const errorMessage = err.message || '';
      if (errorMessage.includes('API_KEY_INVALID')) {
        setError('Chave de API inválida. Certifique-se de que ela começa com "AIza".');
      } else if (errorMessage.includes('QUOTA_EXCEEDED')) {
        setError('Limite de uso gratuito atingido no Google AI Studio.');
      } else {
        setError(`Erro: ${errorMessage || 'Falha na comunicação com o Gemini.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in pb-20">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
           <Brain className="text-primary" size={24} />
           <h1>Projeção & Risco</h1>
        </div>
        <p className="text-secondary">Simule gastos e veja o impacto real</p>
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
          <div style={{ color: 'var(--expense)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '14px' }}>
            <AlertTriangle size={16} />
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
                  {result.toLowerCase().includes('riscado') ? 'Análise de Risco' : 'Vale a pena!'}
                </h3>
                <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-secondary)' }}>
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
        
        {stats.upcomingItems.length > 0 && (
          <div className="card" style={{ padding: '12px 16px' }}>
            <div className="text-secondary" style={{ fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Próximos Compromissos</div>
            {stats.upcomingItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0', borderBottom: idx === stats.upcomingItems.length - 1 ? 'none' : '0.5px solid var(--border)' }}>
                <span style={{ color: 'var(--text-primary)', opacity: 0.8 }}>{item.description}</span>
                <span style={{ color: 'var(--expense)', fontWeight: '500' }}>R$ {item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {!apiKey && (
        <div className="card" style={{ marginTop: '24px', background: 'rgba(255, 149, 0, 0.1)', border: '1px solid rgba(255, 149, 0, 0.2)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={20} style={{ color: '#ff9500' }} />
            <div>
              <div style={{ fontWeight: '500', color: '#ff9500', marginBottom: '4px' }}>Configuração Necessária</div>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                Você precisa configurar sua chave da API do Gemini nas configurações para usar a inteligência artificial.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projection;
