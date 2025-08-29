import QuizAttempt from "./QuizAttempt";

// This is a wrapper component for the standalone quiz attempt page
// Used when students take actual quizzes (not preview mode)
export default function QuizAttemptPage() {
  return <QuizAttempt isPreview={false} />;
}
