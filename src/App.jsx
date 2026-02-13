
import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'  

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  )
}

export default App
