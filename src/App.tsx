import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/404';
import About from './pages/About';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import { UserManagement } from './components/AdminDashboard/UserManagement';
import { WorkspaceManagement } from './components/AdminDashboard/AdminWorkspaces';
import { AnalyticsDashboard } from './components/AdminDashboard/AnalyticsDashboard';
import UserDashboard from './pages/UserDashboard';
import { UserOverview } from './components/UserDashboard/UserOverview';
import { UserWorkspaces } from './components/UserDashboard/UserWorkspaces';
import { UserStudyPlan } from './components/UserDashboard/UserStudyPlan';
import { UserAnalytics } from './components/UserDashboard/UseAnalytics';
import { UserDocuments } from './pages/UserDocuments';
import { AdminOverview } from './components/AdminDashboard/AdminOverview';
import { SystemSettings } from './components/AdminDashboard/SystemSettings';
import ProfilePage from './pages/ProfilePage';
import WhiteboardPage from './pages/Whiteboard';
import { FlashCardGenerator } from './pages/FlashCardGenerator';
import { FlashCardLibrary } from './pages/FlashCardLibrary';
import { FlashCardLayout } from './pages/FlashCardLayout';
import AddUsers from './pages/AddUsers';
import WorkspacePage from './pages/WorkspacePage';
import GroupPage from './pages/GroupPage';
import SignInLayout from './pages/Auth/SignInLayout';
import ForgotPasswordPage from './pages/Auth/ForgotPassword';
import PasswordResetPage from './pages/Auth/PasswordResetPage';
import FirstTimeLoginPage from './pages/Auth/FirstTimeLoginPage';
import TutorAnalytics from './components/TutorDashboard/TutorAnalytics';
import TutorOverview from './components/TutorDashboard/TutorOverview';
import ProtectedRoute from './pages/ProtectedRoutes';
import CreateQuizPage from './pages/quiz/Createquiz';
import QuizAttempt from './pages/quiz/QuizAttempt';
import Unauthorized from './pages/Unauthorized';
import Settings from './pages/Settings';
import EditorApp from './components/DocumentEditor/EditorApp/EditorApp';
import WorkspaceManagementPage from './pages/WorkspaceManagementPage';
import ViewFlashCards from './pages/ViewFlashCards';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<SignInLayout />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<PasswordResetPage />} />
      <Route path="about" element={<About />} />

      {/* For now, add it as a protected route later */}
      {/* All authenticated users */}
      <Route
        element={<ProtectedRoute allowedRoles={['user', 'admin', 'tutor']} />}
      >
        <Route path="/first-time-login" element={<FirstTimeLoginPage />} />
      </Route>
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
          <Route path="/quiz" element={<CreateQuizPage />} />
          <Route path="/tutor-analytics" element={<TutorAnalytics />} />
        </Route>

        {/* All authenticated users */}
        <Route
          element={<ProtectedRoute allowedRoles={['user', 'admin', 'tutor']} />}
        >
          <Route path="user-profile" element={<ProfilePage />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="workspace/:workspaceId/:workspaceName"
            element={<WorkspacePage />}
          />
          <Route
            path="workspace/:workspaceId/group/:groupId"
            element={<GroupPage />}
          />
        </Route>

        {/* Protected Routes for user and tutor */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'tutor']} />}>
          <Route element={<UserDashboard />}>
            <Route path="/user-dashboard" element={<UserOverview />} />
            <Route path="/tutor-dashboard" element={<TutorOverview />} />
            <Route path="/analytics" element={<UserAnalytics />} />
          </Route>
          <Route path="/study-plans" element={<UserStudyPlan />} />
          <Route path="/user-workspaces" element={<UserWorkspaces />} />
          <Route path="/quiz/attempt/:quizId" element={<QuizAttempt />} />
          <Route path="/user-documents" element={<UserDocuments />} />
          <Route element={<FlashCardLayout />}>
            <Route
              path="/flashcard/view/:flashcardId"
              element={<ViewFlashCards />}
            />
            <Route
              path="/flashcard-generator"
              element={<FlashCardGenerator />}
            />
            <Route path="/flashcard-library" element={<FlashCardLibrary />} />
          </Route>
        </Route>

        {/* Admin only routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="add-users" element={<AddUsers />} />
          <Route element={<AdminDashboard />}>
            <Route path="admin-dashboard" element={<AdminOverview />} />
            <Route path="admin-users" element={<UserManagement />} />
            <Route path="admin-workspaces" element={<WorkspaceManagement />} />
            <Route
              path="admin-workspaces/manage/:workspaceId"
              element={<WorkspaceManagementPage />}
            />
            <Route path="admin-analytics" element={<AnalyticsDashboard />} />
            <Route path="admin-settings" element={<SystemSettings />} />
          </Route>
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['user', 'tutor']} />}>
        <Route path="/whiteboard/:roomId" element={<WhiteboardPage />} />
        <Route path="/document-editor/:room" element={<EditorApp />} />
      </Route>
      {/* Catch-all route for 404 Not Found */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
