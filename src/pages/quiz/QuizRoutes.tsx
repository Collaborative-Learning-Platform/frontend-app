import { Routes, Route } from "react-router-dom";
import CreateQuizPage from "./Createquiz";
import QuizAttemptPage from "./QuizAttemptPage";


export default function QuizRoutes() {
  return (
    <Routes>
      {/* Route for creating/editing quizzes */}
      <Route path="/" element={<CreateQuizPage />} />
      <Route path="/edit/:quizId" element={<CreateQuizPage />} />
      
      {/* Route for taking quizzes */}
      <Route path="/attempt/:quizId" element={<QuizAttemptPage />} />
    </Routes>
  );
}

