import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const client = axios.create({ baseURL: API_BASE })

export async function fetchRoomContent(roomId) {
  const { data } = await client.get(`/${roomId}`)
  return data
}
