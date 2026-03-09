import { useState } from 'react'
import { getConfirmacoes, deletarConfirmacao, updateEvento, getEvento } from '../hooks/useApi'
import BalloonDecor from '../components/FloralDecor'
import './AdminPage.css'

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [senhaInput, setSenhaInput] = useState('')
  const [senhaError, setSenhaError] = useState('')

  const [confirmacoes, setConfirmacoes] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aba, setAba] = useState('confirmacoes')
  const [eventoForm, setEventoForm] = useState({})
  const [salvoMsg, setSalvoMsg] = useState('')

  async function login() {
    setSenhaError('')
    setLoading(true)
    try {
      const data = await getConfirmacoes(senhaInput)
      setAdminKey(senhaInput)
      setConfirmacoes(data.data)
      setStats(data.stats)
      setAutenticado(true)
      const ev = await getEvento()
      setEventoForm(ev)
    } catch {
      setSenhaError('Senha incorreta')
    } finally {
      setLoading(false)
    }
  }

  async function recarregar() {
    const data = await getConfirmacoes(adminKey)
    setConfirmacoes(data.data)
    setStats(data.stats)
  }

  async function deletar(id) {
    if (!confirm('Remover esta confirmação?')) return
    try {
      await deletarConfirmacao(id, adminKey)
      await recarregar()
    } catch (err) {
      alert(err.message)
    }
  }

  async function salvarEvento() {
    try {
      await updateEvento(eventoForm, adminKey)
      setSalvoMsg('✓ Salvo com sucesso!')
      setTimeout(() => setSalvoMsg(''), 3000)
    } catch (err) {
      alert(err.message)
    }
  }

  // ===== TELA DE LOGIN =====
  if (!autenticado) {
    return (
      <div className="page-bg admin-login-page">
        <BalloonDecor />
        <div className="page-content">
          <div className="container">
            <div className="card admin-login-card">
              <div className="admin-icon">🐻</div>
              <h1 className="admin-titulo">Área dos Anfitriões</h1>
              <p className="admin-subtitulo">Acesse para gerenciar as confirmações</p>

              <div className="input-group">
                <label>Senha de acesso</label>
                <input
                  type="password"
                  value={senhaInput}
                  onChange={e => { setSenhaInput(e.target.value); setSenhaError('') }}
                  onKeyDown={e => e.key === 'Enter' && login()}
                  placeholder="••••••••"
                  className={senhaError ? 'input-error' : ''}
                />
                {senhaError && <span className="error-msg">⚠ {senhaError}</span>}
              </div>

              <button
                className="btn btn-primary btn-full"
                onClick={login}
                disabled={loading || !senhaInput}
              >
                {loading ? '⏳ Entrando...' : '→ Entrar'}
              </button>

              <p className="admin-hint">
                Senha padrão: <code>cha2025admin</code>
              </p>

              <a href="/" className="admin-voltar">← Voltar ao convite</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===== DASHBOARD =====
  return (
    <div className="page-bg admin-page">
      <div className="page-content">
        <div className="container-wide">

          {/* HEADER */}
          <div className="admin-header">
            <div>
              <h1 className="admin-titulo-dash">🐻 Painel Chá Revelação</h1>
              <p className="admin-sub">Gerencie as confirmações do seu evento</p>
            </div>
            <div className="admin-header-actions">
              <button className="btn btn-outline" onClick={recarregar}>↻ Atualizar</button>
              <a href="/" className="btn btn-secondary">← Convite</a>
            </div>
          </div>

          {/* STATS */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-num">{stats.total}</span>
                <span className="stat-label">Total de Respostas</span>
              </div>
              <div className="stat-card stat-confirmados">
                <span className="stat-num">{stats.confirmados}</span>
                <span className="stat-label">✓ Confirmados</span>
              </div>
              <div className="stat-card stat-nao">
                <span className="stat-num">{stats.naoVao}</span>
                <span className="stat-label">✗ Não vão</span>
              </div>
              <div className="stat-card stat-pessoas">
                <span className="stat-num">{stats.totalPessoas}</span>
                <span className="stat-label">👥 Total de Pessoas</span>
              </div>
              <div className="stat-card stat-menina">
                <span className="stat-num">🎀 {stats.chuteMenina}</span>
                <span className="stat-label">Chutes: Menina</span>
              </div>
              <div className="stat-card stat-menino">
                <span className="stat-num">🎈 {stats.chuteMenino}</span>
                <span className="stat-label">Chutes: Menino</span>
              </div>
            </div>
          )}

          {/* ABAS */}
          <div className="admin-abas">
            <button
              className={`aba-btn ${aba === 'confirmacoes' ? 'aba-ativa' : ''}`}
              onClick={() => setAba('confirmacoes')}
            >
              📋 Confirmações ({confirmacoes.length})
            </button>
            <button
              className={`aba-btn ${aba === 'evento' ? 'aba-ativa' : ''}`}
              onClick={() => setAba('evento')}
            >
              ✏ Editar Evento
            </button>
          </div>

          {/* ABA CONFIRMAÇÕES */}
          {aba === 'confirmacoes' && (
            <div className="admin-tabela-wrapper">
              {confirmacoes.length === 0 ? (
                <div className="sem-dados">
                  <p>🎈 Nenhuma confirmação ainda. Compartilhe o link do convite!</p>
                </div>
              ) : (
                <table className="admin-tabela">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Presença</th>
                      <th>Acomp.</th>
                      <th>Chute</th>
                      <th>Contato</th>
                      <th>Mensagem</th>
                      <th>Data</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmacoes.map(c => (
                      <tr key={c.id}>
                        <td className="td-nome">{c.nome}</td>
                        <td>
                          <span className={`badge ${c.presenca === 'sim' ? 'badge-confirmado' : 'badge-nao'}`}>
                            {c.presenca === 'sim' ? '✓ Sim' : '✗ Não'}
                          </span>
                        </td>
                        <td className="td-center">{c.acompanhantes || '—'}</td>
                        <td>
                          {c.chute ? (
                            <span className={`badge ${c.chute === 'menina' ? 'badge-rosa' : 'badge-azul'}`}>
                              {c.chute === 'menina' ? '🎀 Menina' : '🎈 Menino'}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="td-contato">
                          {c.email    && <span>{c.email}</span>}
                          {c.telefone && <span>{c.telefone}</span>}
                          {!c.email && !c.telefone && '—'}
                        </td>
                        <td className="td-msg">{c.mensagem || '—'}</td>
                        <td className="td-data">
                          {new Date(c.criadoEm).toLocaleDateString('pt-BR', {
                            day: '2-digit', month: '2-digit',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td>
                          <button
                            className="btn-deletar"
                            onClick={() => deletar(c.id)}
                            title="Remover"
                          >🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ABA EDITAR EVENTO */}
          {aba === 'evento' && (
            <div className="card evento-form">
              <h2 className="evento-form-titulo">Editar dados do evento</h2>

              <div className="evento-form-grid">
                {[
                  { key: 'nomeCasal',               label: 'Nome do casal',                     placeholder: 'Os futuros papais' },
                  { key: 'data',                     label: 'Data',                              placeholder: '25 de Março de 2025' },
                  { key: 'horario',                  label: 'Horário',                           placeholder: '15h00' },
                  { key: 'local',                    label: 'Local',                             placeholder: 'Espaço Felicitá Festas' },
                  { key: 'endereco',                 label: 'Endereço',                          placeholder: 'Rua, número — Cidade' },
                  { key: 'dataLimiteConfirmacao',    label: 'Data limite (DD-MM-AAAA)',           placeholder: '20-03-2025' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="input-group">
                    <label>{label}</label>
                    <input
                      type="text"
                      value={eventoForm[key] || ''}
                      onChange={e => setEventoForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                    />
                  </div>
                ))}

                <div className="input-group span-2">
                  <label>Mensagem do convite</label>
                  <textarea
                    value={eventoForm.mensagemConvite || ''}
                    onChange={e => setEventoForm(p => ({ ...p, mensagemConvite: e.target.value }))}
                    placeholder="Texto que aparece no convite..."
                    style={{ minHeight: 80 }}
                  />
                </div>

                <div className="input-group span-2">
                  <label>Sugestão de presentes</label>
                  <textarea
                    value={eventoForm.sugestaoPresentes || ''}
                    onChange={e => setEventoForm(p => ({ ...p, sugestaoPresentes: e.target.value }))}
                    placeholder="Fralda + Um Mimo ou Fralda + Lenço Umedecido"
                    style={{ minHeight: 80 }}
                  />
                </div>

                <div className="input-group span-2">
                  <label>Dresscode</label>
                  <textarea
                    value={eventoForm.dresscode || ''}
                    onChange={e => setEventoForm(p => ({ ...p, dresscode: e.target.value }))}
                    placeholder="Pedimos roupas em tons neutros..."
                    style={{ minHeight: 80 }}
                  />
                </div>
              </div>

              <div className="evento-form-actions">
                <button className="btn btn-primary" onClick={salvarEvento}>
                  💾 Salvar alterações
                </button>
                {salvoMsg && <span className="salvo-msg">{salvoMsg}</span>}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}