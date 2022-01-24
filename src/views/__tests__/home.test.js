import { render, screen, fireEvent } from '@testing-library/react'
import HomeView from '../home/HomeView'


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));


describe('<HomeView />', () => {
  it('should render', async () => {
    render(<HomeView />)

    const castEl = screen.queryByTestId('broadcast-button')
    fireEvent.click(castEl)

    const watchEl = screen.queryByTestId('watch-button')
    fireEvent.click(watchEl)
  })
})