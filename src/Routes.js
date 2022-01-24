import { Routes, Route } from 'react-router-dom'
import HomeView from './views/home/HomeView'
import ProducerView from './views/producer/ProducerView'
import ConsumerView from './views/consumer/ConsumerView';


export default function RoutesView() {

  return (
    <Routes>
      <Route path='/' element={<HomeView />} />
      <Route path='/broadcast' element={<ProducerView />} />
      <Route path='/watch' element={<ConsumerView />} />
      <Route path='/*' element={<div>Page not found</div>} />
    </Routes>
  )
}