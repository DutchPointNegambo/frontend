import Home from './pages/Home'
import EventManagement from './pages/eventManagement'
import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'  
import DayOutingRooms from './pages/DayOutingRooms'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/event" element={<EventManagement />} />
      <Route path="/DayOutingRooms" element={<DayOutingRooms />} />
    </Routes>
  )
}

export default App
