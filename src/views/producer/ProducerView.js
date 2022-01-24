import React from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { socket } from '../../Socket'
import { iceConfig } from '../../config/iceConfig'


let pc
export default function ProducerView() {
  const localVideo = React.useRef(null)
  const body = { room: 'myrtc' }

  React.useEffect(() => {
    socket.removeAllListeners()
    startProducing()

    socket.emit('producer', body)
    socket.on('consumer', payload => {
      startProducing()
      // console.log('incoming consumer', payload)
    })
    socket.on('candidate', payload => {
      onCandidate(payload)
    })
  }, [])


  async function getStream() {
    if (window.stream) return window.stream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    window.stream = stream
    localVideo.current.srcObject = window.stream
    return stream
  }

  async function startProducing() {
    console.clear()
    setTimeout(async () => {
      const stream = await getStream()

      pc = createPC()
      stream.getTracks().forEach(track => pc.addTrack(track, stream))
    }, 1000)
  }

  function createPC() {
    pc = new RTCPeerConnection(iceConfig)

    pc.onnegotiationneeded = () => onNegotiation(pc, body)
    pc.onicecandidate = ({ candidate }) => {
      if (candidate)
        socket.emit('candidate', { candidate })
    }
    return pc
  }

  async function onNegotiation(pc, body) {
    console.log('negotiating..')

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    const payload = { ...body, sdp: pc.localDescription }
    const result = await axios.post('/producer', payload)

    const desc = new RTCSessionDescription(result.data.sdp)
    pc.setRemoteDescription(desc)
      .then(() => console.log('ready!', pc.signalingState))
      .catch(err => console.error('setup incomplete.'))
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
        role='producer-video'
        ref={localVideo}
        autoPlay playsInline
        style={{ backgroundColor: 'black', width: '100%', height: '100vh' }} />
    </div>
  )
}