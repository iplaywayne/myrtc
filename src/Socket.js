import io from 'socket.io-client'

const config = { transports: ['websocket', 'polling'] }
export const socket = io('http://localhost:3001', config)