import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEvento } from '../hooks/useApi'
import BalloonDecor from '../components/FloralDecor'
import './ConvitePage.css'

export default function ConvitePage() {
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getEvento()
      .then(setEvento)
      .catch(() => setEvento({
        data: '29 de Março de 2025',
        horario: '15h00',
        local: 'Espaço Felicitá Festas',
        endereco: 'R. Zanzibar, 132 — Paciência, Rio de Janeiro - RJ, 23585-818',
        mensagemConvite: 'Venha descobrir com a gente!',
        sugestaoPresente: 'Fralda + Um Mimo | Fralda + Lenço Umedecido',
        marcasFraldas: 'Fraldas Huggies (Máxima Proteção), Turma da Mônica ou Babysec — Tamanhos M ou G',
        dresscode: 'Para deixar esse dia ainda mais especial, pedimos que venham com roupas em tons neutros: Branco, Bege ou Off-White.'
      }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-bear">🐻</div>
    </div>
  )

  return (
    <div className="page-bg convite-page">
      <BalloonDecor />

      <div className="page-content">
        <div className="container">

          <div className="convite-card animate-fade-up animate-fade-up-delay-1">

            {/* NUVENS DECORATIVAS TOPO */}
            <div className="nuvens-topo" aria-hidden="true">
              <div className="nuvem nuvem-1"></div>
              <div className="nuvem nuvem-2"></div>
              <div className="nuvem nuvem-3"></div>
            </div>

            {/* TÍTULO SCRIPT */}
            <div className="convite-titulo-wrap animate-fade-up animate-fade-up-delay-2">
              <h1 className="convite-titulo-script">Chá</h1>
              <h1 className="convite-titulo-script convite-titulo-script-2">revelação</h1>
            </div>

            {/* SUBTÍTULO */}
            <p className="convite-sub animate-fade-up animate-fade-up-delay-3">
              {evento.mensagemConvite}
            </p>

            {/* LINHA */}
            <div className="convite-linha animate-fade-up animate-fade-up-delay-3"></div>

            {/* MENINA OU MENINO */}
            <div className="menina-menino animate-fade-up animate-fade-up-delay-3">
              MENINA OU MENINO
            </div>

            <div className="convite-linha animate-fade-up animate-fade-up-delay-3"></div>

            {/* DATA E HORA */}
            <div className="data-hora animate-fade-up animate-fade-up-delay-4">
              <span className="data-script">29 de Março</span>
              <span className="hora-texto">ÀS 15 HORAS</span>
            </div>

            {/* LOCAL */}
            <div className="local-info animate-fade-up animate-fade-up-delay-4">
              <p className="local-endereco">{evento.endereco}</p>
              <p className="local-nome">ESPAÇO: {evento.local?.toUpperCase()}</p>
            </div>

            {/* URSO */}
            <div className="urso-container animate-fade-up animate-fade-up-delay-4" aria-hidden="true">
              <div className="urso-emoji">🐻</div>
            </div>

            {/* SUGESTÃO PRESENTES */}
            {evento.sugestaoPresentes && (
              <div className="presentes-box animate-fade-up animate-fade-up-delay-5">
                <p className="presentes-titulo">SUGESTÃO DE PRESENTES:</p>
                <p className="presentes-texto">{evento.sugestaoPresentes}</p>
                {evento.marcasFraldas && (
                  <p className="presentes-marcas">{evento.marcasFraldas}</p>
                )}
              </div>
            )}

            {/* DRESSCODE */}
            {evento.dresscode && (
              <div className="dresscode-box animate-fade-up animate-fade-up-delay-5">
                <p>{evento.dresscode}</p>
              </div>
            )}

            {/* CTA */}
            <div className="cta-area animate-fade-up animate-fade-up-delay-5">
              <button
                className="btn btn-primary btn-full convite-cta"
                onClick={() => navigate('/confirmar')}
              >
                🎈 Confirmar Presença
              </button>
              <p className="cta-hint">
                Clique acima para confirmar sua presença e registrar seu palpite!
              </p>
            </div>

          </div>

          {/* LINK ADMIN */}
          <div className="admin-link-area">
            <a href="/admin" className="admin-link">⚙ Área dos anfitriões</a>
          </div>

        </div>
      </div>
    </div>
  )
}