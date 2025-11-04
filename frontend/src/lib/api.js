import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export async function predictSpam(email) {
  const { data } = await api.post('/predict', { email })
  return data
}

export async function getMetrics() {
  const { data } = await api.get('/metrics')
  return data
}

export default api
