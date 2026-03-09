import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmarPresenca } from '../hooks/useApi'
import BalloonDecor from '../components/FloralDecor'
import './ConfirmacaoPage.css'

const initialForm = {
  nome: '',
  email: '',
  telefone: '',
  presenca: '',
  acompanhantes: '0',
  chute: '',
  mensagem: ''
}

export default function ConfirmacaoPage() {
  const [form, setForm] = useState(initialForm)
  const [erros, setErros] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (erros[name]) setErros(prev => ({ ...prev, [name]: '' }))
    setApiError('')
  }

  function validar() {
    const novosErros = {}
    if (!form.nome.trim() || form.nome.trim().length < 2)
      novosErros.nome = 'Informe seu nome completo'
    if (!form.presenca)
      novosErros.presenca = 'Informe se vai ou não poderá comparecer'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      novosErros.email = 'E-mail inválido'
    return novosErros
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const novosErros = validar()
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }
    setLoading(true)
    setApiError('')
    try {
      const res = await confirmarPresenca({
        ...form,
        acompanhantes: parseInt(form.acompanhantes) || 0
      })
      navigate('/sucesso', {
        state: {
          mensagem: res.message,
          presenca: form.presenca,
          chute: form.chute,
          nome: form.nome
        }
      })
    } catch (err) {
      setApiError(err.message || 'Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg confirmacao-page">
      <BalloonDecor />

      <div className="page-content">
        <div className="container">

          <button
            className="voltar-btn animate-fade-up animate-fade-up-delay-1"
            onClick={() => navigate('/')}
          >
            ← Ver convite
          </button>

          <div className="confirmacao-header animate-fade-up animate-fade-up-delay-2">
            <div className="confirmacao-urso">🐻</div>
            <h1 className="confirmacao-titulo">Confirmar Presença</h1>
            <p className="confirmacao-sub">29 de Março · 15h00 · Espaço Felicitá Festas</p>
          </div>

          <div className="card form-card animate-fade-up animate-fade-up-delay-3">
            <form onSubmit={handleSubmit} noValidate>

              {/* NOME */}
              <div className={`input-group ${erros.nome ? 'has-error' : ''}`}>
                <label htmlFor="nome">Nome completo *</label>
                <input
                  id="nome" name="nome" type="text"
                  value={form.nome} onChange={handleChange}
                  placeholder="Seu nome"
                  className={erros.nome ? 'input-error' : ''}
                  autoComplete="name"
                />
                {erros.nome && <span className="error-msg">⚠ {erros.nome}</span>}
              </div>

              {/* EMAIL E TELEFONE */}
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="email">
                    E-mail <span className="opcional">(opcional)</span>
                  </label>
                  <input
                    id="email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="seu@email.com"
                    className={erros.email ? 'input-error' : ''}
                    autoComplete="email"
                  />
                  {erros.email && <span className="error-msg">⚠ {erros.email}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="telefone">
                    WhatsApp <span className="opcional">(opcional)</span>
                  </label>
                  <input
                    id="telefone" name="telefone" type="tel"
                    value={form.telefone} onChange={handleChange}
                    placeholder="(21) 99999-9999"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="divider">🐻</div>

              {/* PRESENÇA */}
              <div className={`input-group ${erros.presenca ? 'has-error' : ''}`}>
                <label>Você vai comparecer? *</label>
                <div className="presenca-opcoes">
                  <button
                    type="button"
                    className={`presenca-btn ${form.presenca === 'sim' ? 'presenca-sim-ativo' : ''}`}
                    onClick={() => {
                      setForm(p => ({ ...p, presenca: 'sim' }))
                      setErros(e => ({ ...e, presenca: '' }))
                    }}
                  >
                    🎈 Sim, estarei lá!
                  </button>
                  <button
                    type="button"
                    className={`presenca-btn ${form.presenca === 'nao' ? 'presenca-nao-ativo' : ''}`}
                    onClick={() => {
                      setForm(p => ({ ...p, presenca: 'nao' }))
                      setErros(e => ({ ...e, presenca: '' }))
                    }}
                  >
                    😔 Não poderei ir
                  </button>
                </div>
                {erros.presenca && <span className="error-msg">⚠ {erros.presenca}</span>}
              </div>

              {/* ACOMPANHANTES */}
              {form.presenca === 'sim' && (
                <div className="input-group acomp-group">
                  <label>Número de acompanhantes</label>
                  <div className="numero-control">
                    <button
                      type="button"
                      onClick={() => setForm(p => ({
                        ...p,
                        acompanhantes: Math.max(0, parseInt(p.acompanhantes) - 1).toString()
                      }))}
                    >−</button>
                    <span>{form.acompanhantes}</span>
                    <button
                      type="button"
                      onClick={() => setForm(p => ({
                        ...p,
                        acompanhantes: (parseInt(p.acompanhantes) + 1).toString()
                      }))}
                    >+</button>
                  </div>
                  <p className="input-hint">
                    Total no evento: {parseInt(form.acompanhantes) + 1} pessoa(s)
                  </p>
                </div>
              )}

              <div className="divider">🎀</div>

              {/* CHUTE */}
              <div className="input-group">
                <label>Seu palpite: menina ou menino?</label>
                <div className="chute-opcoes">
                  <button
                    type="button"
                    className={`chute-btn chute-menina ${form.chute === 'menina' ? 'chute-ativo' : ''}`}
                    onClick={() => setForm(p => ({
                      ...p, chute: p.chute === 'menina' ? '' : 'menina'
                    }))}
                  >
                    <span className="chute-icon">🎀</span>
                    <span className="chute-label">Menina</span>
                    {form.chute === 'menina' && <span className="chute-check">✓</span>}
                  </button>
                  <button
                    type="button"
                    className={`chute-btn chute-menino ${form.chute === 'menino' ? 'chute-ativo' : ''}`}
                    onClick={() => setForm(p => ({
                      ...p, chute: p.chute === 'menino' ? '' : 'menino'
                    }))}
                  >
                    <span className="chute-icon">🎈</span>
                    <span className="chute-label">Menino</span>
                    {form.chute === 'menino' && <span className="chute-check">✓</span>}
                  </button>
                </div>
              </div>

              {/* MENSAGEM */}
              <div className="input-group">
                <label htmlFor="mensagem">
                  Mensagem carinhosa <span className="opcional">(opcional)</span>
                </label>
                <textarea
                  id="mensagem" name="mensagem"
                  value={form.mensagem} onChange={handleChange}
                  placeholder="Deixe uma mensagem para os futuros papais... 🤍"
                />
              </div>

              {/* ERRO API */}
              {apiError && (
                <div className="alert alert-error" style={{ marginBottom: 20 }}>
                  ⚠ {apiError}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="btn btn-primary btn-full submit-btn"
                disabled={loading}
              >
                {loading ? '⏳ Enviando...' : '🐻 Confirmar Presença'}
              </button>

              <p className="form-nota">* Campos obrigatórios.</p>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}