import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Events from './config/Events'

jest.mock('socket.io-client')


describe('renders welcome to my rtc title with action buttons', () => {
  it('should render', async () => {

    render(<App />);
    const titleEl = screen.getByText(/Welcome to My RTC/i);
    expect(titleEl).toBeInTheDocument();

    // const castEl = screen.getByText(/broadcast/i)
    // expect(castEl).toBeInTheDocument()
    // await fireEvent.click(castEl)

    // const watchEl = screen.getByText(/watch/i)
    // expect(watchEl).toBeInTheDocument()
    // await fireEvent.click(watchEl)
  })
});
