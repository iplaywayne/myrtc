import { render, screen } from '@testing-library/react'
import MockedSocket from 'socket.io-mock'
import ProducerView from '../producer/ProducerView'

const socket = new MockedSocket()

test('should render <ProducerView />', () => {
  const body = { room: 'myrtc' }

  socket.on('consumer', payload => expect(payload).toEqual(body))
  socket.socketClient.emit('consumer', body)

  render(<ProducerView />)

  const vidEl = screen.queryByRole('producer-video')
  expect(vidEl).toBeInTheDocument()
})