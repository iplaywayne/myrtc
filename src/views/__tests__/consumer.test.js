import { render, screen } from '@testing-library/react'
import MockedSocket from 'socket.io-mock'
import ConsumerView from '../consumer/ConsumerView'
import { renderIgnoringUnstableFlushDiscreteUpdates } from '../../../utils/test-utils'

const socket = new MockedSocket()

test('should render <ConsumerView />', async () => {
  const body = { room: 'myrtc' }

  socket.on('producer', payload => expect(payload).toEqual(body))
  socket.socketClient.emit('producer', body)

  renderIgnoringUnstableFlushDiscreteUpdates(<ConsumerView />)

  const vidEl = screen.queryByRole('consumer-video')
  expect(vidEl).toBeInTheDocument()
})