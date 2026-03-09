import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BalloonDecor from '../components/FloralDecor'
import './SucessoPage.css'

export default function SucessoPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { mensagem, presenca, chute, nome } = location.state || {}
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (!location.state) {
      navigate('/')
      return
    }
    setTimeout(() => setShowConfetti(true), 300)
  }, [])

  const primeiroNome = nome ? nome.trim().split(' ')[0] : 'Você'
  const foi = presenca === 'sim'

  return (
    <div className="page-bg sucesso-page">
      <BalloonDecor />

      {/* CONFETTI */}
      {showConfetti && foi && (
        <div className="confetti-container" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2.5 + Math.random() * 2.5}s`,
                background: ['#d4b896','#c9a87a','#e8d4b8','#8b5e3c','#f0e8df'][
                  Math.floor(Math.random() * 5)
                ],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                width:  `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
              }}
            />
          ))}
        </div>
      )}

      <div className="page-content">
        <div className="container">
          <div className="sucesso-card card animate-fade-up animate-fade-up-delay-1">

            {/* ÍCONE */}
            <div className="sucesso-icon animate-fade-up animate-fade-up-delay-2">
              {foi ? '🎈' : '🤍'}
            </div>

            {/* TÍTULO */}
            <h1 className="sucesso-titulo animate-fade-up animate-fade-up-delay-3">
              {foi ? `Até lá, ${primeiroNome}!` : `Obrigado, ${primeiroNome}!`}
            </h1>

            {/* MENSAGEM */}
            <p className="sucesso-mensagem animate-fade-up animate-fade-up-delay-4">
              {mensagem}
            </p>

            {/* CHUTE */}
            {chute && (
              <div className={`chute-confirmado animate-fade-up animate-fade-up-delay-4 chute-${chute}`}>
                <span className="chute-emoji">
                  {chute === 'menina' ? '🎀' : '🎈'}
                </span>
                <div>
                  <p className="chute-label-small">Seu palpite:</p>
                  <p className="chute-valor">
                    {chute === 'menina' ? 'Menina 💗' : 'Menino 💙'}
                  </p>
                </div>
              </div>
            )}

            {/* LEMBRETE */}
            {foi && (
              <div className="sucesso-lembrete animate-fade-up animate-fade-up-delay-5">
                <p>📅 <strong>29 de Março</strong> às 15h00</p>
                <p>📍 Espaço Felicitá Festas — Paciência, RJ</p>
                <p>👔 Traje: <strong>tons neutros</strong> (Branco, Bege ou Off-White)</p>
              </div>
            )}

            {/* AÇÕES */}
            <div className="sucesso-acoes animate-fade-up animate-fade-up-delay-5">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                ← Ver convite
              </button>

              {foi && (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Chá Revelação 🐻',
                        text: 'Fui convidado para um Chá Revelação! Venha descobrir conosco!',
                        url: window.location.origin
                      })
                    }
                  }}
                >
                  📤 Compartilhar
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}