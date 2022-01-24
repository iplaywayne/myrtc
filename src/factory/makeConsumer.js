import { CONSUMER, PRODUCER, CANDIDATE } from '../config/Events'



export default async function makeConsumer(props) {
  const { socket, body } = props
  socket.removeAllListeners()

  socket.emit(CONSUMER, body)

  socket.on(PRODUCER, payload => {
    // console.log('incoming producer', payload)
    props.onProducer && props.onProducer(payload)
  })

  socket.on(CANDIDATE, payload => {
    // console.log('incoming candidate', payload)
    props.onCandidate && props.onCandidate(payload)
  })
}