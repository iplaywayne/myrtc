import React from 'react'
import axios from 'axios'
import { socket } from '../../Socket'
import { iceConfig } from '../../config/iceConfig'
import { CONSUMER, PRODUCER, CANDIDATE } from '../../config/Events'


let pc
export default function ConsumerView() {
  const remoteVideo = React.useRef(null)
  const body = { room: 'myrtc' }

  React.useEffect(() => {
    socket.removeAllListeners()
    startConsuming()

    socket.emit(CONSUMER, body)
    socket.on(PRODUCER, payload => {
      startConsuming()
      // console.log('incoming producer', payload)
    })
    socket.on(CANDIDATE, payload => {
      onCandidate(payload)
    })
  }, [])


  function startConsuming() {
    setTimeout(() => {
      pc = createPC(body)
      pc.addTransceiver("video", { direction: "recvonly" })
      pc.addTransceiver("audio", { direction: "recvonly" })
    }, 2000)
  }

  function createPC() {
    pc = new RTCPeerConnection(iceConfig)

    pc.ontrack = onTrackEvent
    pc.onnegotiationneeded = () => onNegotiation(pc, body)
    pc.onicecandidate = ({ candidate }) => {
      if (candidate)
        socket.emit('candidate', { candidate, consumer: true })
    }
    return pc
  }

  function onTrackEvent(e) {
    remoteVideo.current.srcObject = e.streams[0]
  }

  async function onNegotiation(pc, body) {
    console.log('negotiating..')

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    const payload = { ...body, sdp: pc.localDescription }
    const result = await axios.post('/consumer', payload)

    const desc = new RTCSessionDescription(result.data.sdp)
    pc.setRemoteDescription(desc)
      .then(() => console.log('ready!', pc.signalingState))
      .catch(err => console.error('stream not ready.'))
  }

  async function onCandidate({ candidate }) {
    try {
      await pc.addIceCandidate(candidate)
    } catch (e) {

    }
  }


  return (
    <div>
      <video
        role='consumer-video'
        ref={remoteVideo}
        autoPlay playsInline muted
        style={{ backgroundColor: 'black', width: '100%', height: '100vh' }} />
    </div>
  )
}