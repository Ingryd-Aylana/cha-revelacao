const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = process.env.PORT || 3001

// ===== MIDDLEWARES =====
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-key']
}))
app.use(express.json())

// ===== BANCO EM MEMÓRIA =====
let confirmacoes = []

let eventConfig = {
  nomeCasal: 'Os futuros papais',
  nomeBebe: 'Baby',
  data: '29 de Março de 2025',
  horario: '15h00',
  local: 'Espaço Felicitá Festas',
  endereco: 'R. Zanzibar, 132 — Paciência, Rio de Janeiro - RJ, 23585-818',
  dataLimiteConfirmacao: '2025-03-10',
  mensagemConvite: 'Venha descobrir com a gente!',
  sugestaoPresentes: 'Fralda + Um Mimo  ou  Fralda + Lenço Umedecido',
  marcasFraldas: 'Fraldas Huggies (Máxima Proteção), Turma da Mônica ou Babysec — Tamanhos M ou G',
  dresscode: 'Para deixar esse dia ainda mais especial, pedimos que venham com roupas em tons neutros: Branco, Bege ou Off-White.'
}

const ADMIN_KEY = process.env.ADMIN_KEY || 'cha2025admin'

// ===== MIDDLEWARE ADMIN =====
function verificarAdmin(req, res, next) {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Não autorizado.' })
  }
  next()
}

// ==========================================
// ROTAS — EVENTO
// ==========================================

// GET — buscar dados do evento (público)
app.get('/api/evento', (req, res) => {
  res.json({ success: true, data: eventConfig })
})

// PUT — atualizar dados do evento (admin)
app.put('/api/evento', verificarAdmin, (req, res) => {
  eventConfig = { ...eventConfig, ...req.body }
  res.json({
    success: true,
    data: eventConfig,
    message: 'Evento atualizado com sucesso!'
  })
})

// ==========================================
// ROTAS — CONFIRMAÇÕES
// ==========================================

// GET — listar todas as confirmações (admin)
app.get('/api/confirmacoes', verificarAdmin, (req, res) => {
  const stats = {
    total: confirmacoes.length,
    confirmados: confirmacoes.filter(c => c.presenca === 'sim').length,
    naoVao: confirmacoes.filter(c => c.presenca === 'nao').length,
    totalPessoas: confirmacoes
      .filter(c => c.presenca === 'sim')
      .reduce((acc, c) => acc + 1 + (c.acompanhantes || 0), 0),
    chuteMenino: confirmacoes.filter(c => c.chute === 'menino').length,
    chuteMenina: confirmacoes.filter(c => c.chute === 'menina').length,
  }
  res.json({ success: true, data: confirmacoes, stats })
})

// POST — criar nova confirmação (público)
app.post('/api/confirmacoes', (req, res) => {
  const { nome, email, telefone, presenca, acompanhantes, chute, mensagem } = req.body

  // Validações
  if (!nome || nome.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Informe seu nome completo.'
    })
  }

  if (!presenca || !['sim', 'nao'].includes(presenca)) {
    return res.status(400).json({
      success: false,
      message: 'Informe se vai ou não poderá comparecer.'
    })
  }

  if (chute && !['menino', 'menina'].includes(chute)) {
    return res.status(400).json({
      success: false,
      message: 'Chute inválido.'
    })
  }

  // Verifica e-mail duplicado
  if (email) {
    const jaConfirmou = confirmacoes.find(
      c => c.email?.toLowerCase() === email.toLowerCase()
    )
    if (jaConfirmou) {
      return res.status(409).json({
        success: false,
        message: 'Este e-mail já realizou uma confirmação.'
      })
    }
  }

  // Cria confirmação
  const nova = {
    id: uuidv4(),
    nome: nome.trim(),
    email: email?.trim() || null,
    telefone: telefone?.trim() || null,
    presenca,
    acompanhantes: parseInt(acompanhantes) || 0,
    chute: chute || null,
    mensagem: mensagem?.trim() || null,
    criadoEm: new Date().toISOString(),
  }

  confirmacoes.push(nova)

  const primeiroNome = nome.trim().split(' ')[0]

  res.status(201).json({
    success: true,
    message: presenca === 'sim'
      ? `Uhuu! Sua presença foi confirmada, ${primeiroNome}! Te esperamos no dia 29 de Março! 🐻🎈`
      : `Obrigado por avisar, ${primeiroNome}. Sentiremos muito sua falta! 🤍`,
    data: nova
  })
})

// GET — buscar confirmação por ID (admin)
app.get('/api/confirmacoes/:id', verificarAdmin, (req, res) => {
  const confirmacao = confirmacoes.find(c => c.id === req.params.id)
  if (!confirmacao) {
    return res.status(404).json({
      success: false,
      message: 'Confirmação não encontrada.'
    })
  }
  res.json({ success: true, data: confirmacao })
})

// DELETE — remover confirmação (admin)
app.delete('/api/confirmacoes/:id', verificarAdmin, (req, res) => {
  const index = confirmacoes.findIndex(c => c.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Confirmação não encontrada.'
    })
  }
  confirmacoes.splice(index, 1)
  res.json({ success: true, message: 'Confirmação removida com sucesso.' })
})

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Chá Revelação 🐻 funcionando!',
    confirmacoes: confirmacoes.length,
    timestamp: new Date().toISOString()
  })
})

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada.' })
})

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Erro interno do servidor.' })
})

// ===== START =====
app.listen(PORT, () => {
  console.log(`\n🐻 Chá Revelação API rodando na porta ${PORT}`)
  console.log(`📡 http://localhost:${PORT}/api`)
  console.log(`🔑 Admin key: ${ADMIN_KEY}\n`)
})

module.exports = app