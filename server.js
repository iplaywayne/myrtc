const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const wrtc = require('wrtc')
const iceConfig = require('./src/config/iceConfig')
const { DISCONNECT, PRODUCER, CONSUMER, CANDIDATE } = require('./src/config/Events')


// SETUP
let ppc, cpc;
const producerStream = {}
app.use(express.json())


io.on('connection', socket => {
  // IO ENDPOINTS
  socket.on(PRODUCER, payload => {
    socket.join(payload.room)
    console.log('producer connected')
    socket.broadcast.to(payload.room).emit('producer', { ...payload, id: socket.id })
  })

  socket.on(CONSUMER, payload => {
    socket.join(payload.room)
    console.log('consumer connected')
    socket.broadcast.to(payload.room).emit('consumer', { ...payload, id: socket.id })
  })

  socket.on(CANDIDATE, async payload => {
    try {
      if (payload.consumer && cpc?.signalingState === 'have-remote-offer') {
        await cpc.addIceCandidate(payload.candidate)
      } else if (ppc?.signalingState === 'have-remote-offer') {
        await ppc?.addIceCandidate(payload.candidate)
      }
    } catch (e) {

    }
  })

  socket.on(DISCONNECT, () => {
    socket.leave(socket.id)
    console.log('socket disconnected', socket.id)
  })
  ///

  // API ENDPOINTS
  app.post('/producer', async (req, res, next) => {
    const { room } = req.body
    ppc = new wrtc.RTCPeerConnection(iceConfig)
    ppc.ontrack = e => onTrackEvent(e, req.body.room)

    const desc = new wrtc.RTCSessionDescription(req.body.sdp)
    await ppc.setRemoteDescription(desc)

    const answer = await ppc.createAnswer()
    await ppc.setLocalDescription(answer)

    ppc.onicecandidate = ({ candidate }) => {
      console.log('iceing producer client!')
      if (candidate)
        socket.broadcast.to(room).emit('candidate', { candidate })
    }

    ppc.onconnectionstatechange = () => console.log('/producer', ppc.connectionState)

    const payload = { sdp: ppc.localDescription, room: req.body.room }
    res.send(payload)
  })

  app.post('/consumer', async (req, res, next) => {
    const { room } = req.body
    cpc = new wrtc.RTCPeerConnection(iceConfig)
    const desc = new wrtc.RTCSessionDescription(req.body.sdp)
    await cpc.setRemoteDescription(desc)

    producerStream[room]?.getTracks().forEach(track => cpc.addTrack(track, producerStream[room]))
    const answer = await cpc.createAnswer()
    await cpc.setLocalDescription(answer)

    cpc.onicecandidate = ({ candidate }) => {
      console.log('iceing consumer client!')
      if (candidate)
        socket.broadcast.to(room).emit('candidate', { candidate })
    }

    cpc.onconnectionstatechange = () => console.log('/consumer', cpc.connectionState)

    const payload = { sdp: cpc.localDescription, room }
    res.send(payload)
  })
  ///
})

// TRACK EVENT
function onTrackEvent(e, room) {
  if (producerStream[room] !== e.streams[0]) {
    producerStream[room] = e.streams[0]
    console.log('[onTrackEvent] streaming..')
  }
}

// SERVER LISTENER
server.listen(3001, () => console.log('server listening on 3001'))