import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import { ThemeDemo } from './theme';

function About() {
  return <div>About Page</div>
}

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/theme-demo" element={<ThemeDemo />} />
    </Routes>
    )
}

export default App


