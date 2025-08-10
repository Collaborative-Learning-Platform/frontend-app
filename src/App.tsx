import './App.css'
import { Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import CreateQuiz from './pages/quiz/createquiz';
import { ThemeDemo } from './theme';
import  LoginPage from './pages/LoginPage';
import NotFound from './pages/404';
import About from './pages/About';
import Layout from './components/Layout';


function App() {
  
  return (
    <Routes>
      
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route path="about" element={<About />} />
        <Route path="create-quiz" element={<CreateQuiz />} />
        <Route path="theme-demo" element={<ThemeDemo />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
      
    </Routes>
    )
}

export default App


