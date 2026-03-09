const API_BASE = '/api'

async function handleResponse(res) {
  const text = await res.text()

  if (!text) {
    throw new Error('Servidor não retornou resposta. Verifique se o backend está rodando.')
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Resposta inválida do servidor.')
  }

  if (!data.success) {
    throw new Error(data.message || 'Erro desconhecido.')
  }

  return data
}

export async function getEvento() {
  const res = await fetch(`${API_BASE}/evento`)
  const data = await handleResponse(res)
  return data.data
}

export async function confirmarPresenca(payload) {
  const res = await fetch(`${API_BASE}/confirmacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return await handleResponse(res)
}

export async function getConfirmacoes(adminKey) {
  const res = await fetch(`${API_BASE}/confirmacoes`, {
    headers: { 'x-admin-key': adminKey }
  })
  return await handleResponse(res)
}

export async function deletarConfirmacao(id, adminKey) {
  const res = await fetch(`${API_BASE}/confirmacoes/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey }
  })
  return await handleResponse(res)
}

export async function updateEvento(payload, adminKey) {
  const res = await fetch(`${API_BASE}/evento`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey
    },
    body: JSON.stringify(payload)
  })
  return await handleResponse(res)
}