import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import CreateQuiz from './pages/quiz/createquiz';
import { ThemeDemo } from './theme';
import  LoginPage from './pages/LoginPage';

function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page.</p>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/create-quiz">Create Quiz</Link> | <Link to="/theme-demo">Theme Demo</Link>
      </nav>
    </div>
  )
}

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The requested page could not be found.</p>
      <nav>
        <Link to="/">Go back to home</Link>
      </nav>
    </div>
  )
}

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/create-quiz" element={<CreateQuiz />} />
      <Route path="/theme-demo" element={<ThemeDemo />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    )
}

export default App


