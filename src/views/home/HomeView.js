import { useNavigate } from 'react-router-dom'
import logo from '../../logo.svg';


export default function HomeView() {
  const navigate = useNavigate()


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to My RTC
        </p>
        <a
          data-testid='broadcast-button'
          className="App-link btn mb-1"
          onClick={() => navigate('/broadcast')}
          rel="noopener noreferrer"
        >
          Broadcast
        </a>
        <a
          data-testid='watch-button'
          className="App-link btn"
          onClick={() => navigate('/watch')}
          rel="noopener noreferrer"
        >
          Watch
        </a>
      </header>
    </div>
  );
}