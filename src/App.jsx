import Home from './pages/Home'
import EventManagement from './pages/eventManagement'
import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'  

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/event" element={<EventManagement />} />
    </Routes>
  )
}

export default App
