require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const { supabase } = require('./lib/supabase')

const app = express()
const PORT = process.env.PORT || 3001
const ADMIN_KEY = process.env.ADMIN_KEY || 'cha2025admin'

app.use(cors())
app.use(express.json())

function verificarAdmin(req, res, next) {
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Não autorizado.' })
  }
  next()
}

function mapEventoFromDb(row) {
  return {
    id: row.id,
    nomeCasal: row.nome_casal,
    nomeBebe: row.nome_bebe,
    data: row.data,
    horario: row.horario,
    local: row.local,
    endereco: row.endereco,
    dataLimiteConfirmacao: row.data_limite_confirmacao,
    mensagemConvite: row.mensagem_convite,
    sugestaoPresentes: row.sugestao_presentes,
    marcasFraldas: row.marcas_fraldas,
    dresscode: row.dresscode
  }
}

function mapEventoToDb(body) {
  return {
    nome_casal: body.nomeCasal,
    nome_bebe: body.nomeBebe,
    data: body.data,
    horario: body.horario,
    local: body.local,
    endereco: body.endereco,
    data_limite_confirmacao: body.dataLimiteConfirmacao,
    mensagem_convite: body.mensagemConvite,
    sugestao_presentes: body.sugestaoPresentes,
    marcas_fraldas: body.marcasFraldas,
    dresscode: body.dresscode
  }
}

/* =========================================
   EVENTO
========================================= */

app.get('/api/evento', async (req, res) => {
  const { data, error } = await supabase
    .from('evento_config')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Erro ao buscar evento.' })
  }

  res.json({ success: true, data: mapEventoFromDb(data) })
})

app.put('/api/evento', verificarAdmin, async (req, res) => {
  const { data: atual, error: erroBusca } = await supabase
    .from('evento_config')
    .select('*')
    .limit(1)
    .single()

  if (erroBusca) {
    console.error(erroBusca)
    return res.status(500).json({ success: false, message: 'Erro ao buscar evento.' })
  }

  const payload = {
    ...Object.fromEntries(
      Object.entries(mapEventoToDb(req.body)).filter(([, value]) => value !== undefined)
    ),
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('evento_config')
    .update(payload)
    .eq('id', atual.id)
    .select()
    .single()

  if (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Erro ao atualizar evento.' })
  }

  res.json({
    success: true,
    data: mapEventoFromDb(data),
    message: 'Evento atualizado com sucesso!'
  })
})

/* =========================================
   CONFIRMAÇÕES
========================================= */

app.get('/api/confirmacoes', verificarAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('confirmacoes')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Erro ao buscar confirmações.' })
  }

  const stats = {
    total: data.length,
    confirmados: data.filter(c => c.presenca === 'sim').length,
    naoVao: data.filter(c => c.presenca === 'nao').length,
    totalPessoas: data
      .filter(c => c.presenca === 'sim')
      .reduce((acc, c) => acc + 1 + (c.acompanhantes || 0), 0),
    chuteMenino: data.filter(c => c.chute === 'menino').length,
    chuteMenina: data.filter(c => c.chute === 'menina').length
  }

  const formatado = data.map(c => ({
    id: c.id,
    nome: c.nome,
    email: c.email,
    telefone: c.telefone,
    presenca: c.presenca,
    acompanhantes: c.acompanhantes,
    chute: c.chute,
    mensagem: c.mensagem,
    criadoEm: c.criado_em
  }))

  res.json({ success: true, data: formatado, stats })
})

app.post('/api/confirmacoes', async (req, res) => {
  const { nome, email, telefone, presenca, acompanhantes, chute, mensagem } = req.body

  if (!nome || nome.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Informe seu nome completo.' })
  }

  if (!presenca || !['sim', 'nao'].includes(presenca)) {
    return res.status(400).json({
      success: false,
      message: 'Informe se vai ou não poderá comparecer.'
    })
  }

  if (chute && !['menino', 'menina'].includes(chute)) {
    return res.status(400).json({ success: false, message: 'Chute inválido.' })
  }

  if (email) {
    const { data: existente, error: erroEmail } = await supabase
      .from('confirmacoes')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (erroEmail) {
      console.error(erroEmail)
      return res.status(500).json({ success: false, message: 'Erro ao validar e-mail.' })
    }

    if (existente) {
      return res.status(409).json({
        success: false,
        message: 'Este e-mail já realizou uma confirmação.'
      })
    }
  }

  const payload = {
    nome: nome.trim(),
    email: email ? email.trim().toLowerCase() : null,
    telefone: telefone?.trim() || null,
    presenca,
    acompanhantes: parseInt(acompanhantes, 10) || 0,
    chute: chute || null,
    mensagem: mensagem?.trim() || null
  }

  const { data, error } = await supabase
    .from('confirmacoes')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Erro ao salvar confirmação.' })
  }

  const primeiroNome = nome.trim().split(' ')[0]

  res.status(201).json({
    success: true,
    message:
      presenca === 'sim'
        ? `Uhuu! Sua presença foi confirmada, ${primeiroNome}!`
        : `Obrigado por avisar, ${primeiroNome}. Sentiremos sua falta!`,
    data: {
      id: data.id,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      presenca: data.presenca,
      acompanhantes: data.acompanhantes,
      chute: data.chute,
      mensagem: data.mensagem,
      criadoEm: data.criado_em
    }
  })
})

app.delete('/api/confirmacoes/:id', verificarAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('confirmacoes')
    .delete()
    .eq('id', req.params.id)
    .select()

  if (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Erro ao remover confirmação.' })
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ success: false, message: 'Confirmação não encontrada.' })
  }

  res.json({ success: true, message: 'Confirmação removida com sucesso.' })
})

/* =========================================
   HEALTH CHECK
========================================= */

app.get('/api/health', async (req, res) => {
  const { count, error } = await supabase
    .from('confirmacoes')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Erro no health check.' })
  }

  res.json({
    success: true,
    message: 'API funcionando!',
    confirmacoes: count ?? 0,
    timestamp: new Date().toISOString()
  })
})

/* =========================================
   FRONTEND BUILD
========================================= */

const frontendPath = path.join(__dirname, '../../frontend/dist')

app.use(express.static(frontendPath))

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(frontendPath, 'index.html'))
})

/* =========================================
   ERROR HANDLER
========================================= */

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ success: false, message: 'Erro interno do servidor.' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
})