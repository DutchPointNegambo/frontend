import Home from './pages/Home'
import EventManagement from './pages/eventManagement'
import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'  
import DayOutingRooms from './pages/DayOutingRooms'
import DeluxeRooms from './pages/deluxeRooms' 
import SemiLuxuryRooms from './pages/semiLuxuryRooms'
import LuxuryRooms from './pages/luxuryRooms'
import AddRoomForm from './components/admin_components/AddRoomForm'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/event" element={<EventManagement />} />
      <Route path="/DayOutingRooms" element={<DayOutingRooms />} />
      <Route path="/deluxeRooms" element={<DeluxeRooms />} />
      <Route path="/semiLuxuryRooms" element={<SemiLuxuryRooms />} />
      <Route path="/luxuryRooms" element={<LuxuryRooms />} />
      <Route path="/addRoom" element={<AddRoomForm />} />


    </Routes>
  )
}

export default App;