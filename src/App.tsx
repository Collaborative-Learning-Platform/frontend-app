import './App.css'
import { Routes, Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import { ThemeDemo } from './theme';
import  LoginPage from './pages/LoginPage';
import NotFound from './pages/404';
import About from './pages/About';
import Layout from './components/Layout';
import QuizRoutes from './pages/quiz/QuizRoutes';
import AdminDashboard from "./pages/AdminDashboard";
import { UserManagement } from "./components/AdminDashboard/UserManagement";
import { WorkspaceManagement } from "./components/AdminDashboard/WorkspaceMAnagement";
import { AnalyticsDashboard } from "./components/AdminDashboard/AnalyticsDashboard";
import UserDashboard from "./pages/UserDashboard";
import { UserOverview } from "./components/UserDashboard/UserOverview";
import { UserWorkspaces } from "./components/UserDashboard/UserWorkspaces";
import { UserStudyPlan } from "./components/UserDashboard/UserStudyPlan";
import { UserAnalytics } from "./components/UserDashboard/UseAnalytics";
import { AdminOverview } from "./components/AdminDashboard/AdminOverview";
import { SystemSettings } from "./components/AdminDashboard/SystemSettings";
import ProfilePage from "./pages/ProfilePage";
import { Whiteboard } from "./pages/Whiteboard";
import { DocumentEditor } from "./pages/DocumentEditor";
import AddUsers from './pages/AddUsers';

function App() {
  return (
<Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route path="user-profile" element={<ProfilePage />} />
        <Route path="about" element={<About />} />
        <Route path="/quiz/*" element={<QuizRoutes />} />
        <Route path="theme-demo" element={<ThemeDemo />} />
        <Route path="add-users" element={<AddUsers />} />

        <Route element={<UserDashboard />}>
          <Route path="/user-dashboard" element={<UserOverview />} />
          <Route path="/user-workspaces" element={<UserWorkspaces />} />
          <Route path="/study-plans" element={<UserStudyPlan />} />
          <Route path="/analytics" element={<UserAnalytics />} />
        </Route>

        <Route element={<AdminDashboard />}>
          <Route path="admin-dashboard" element={<AdminOverview />} />
          <Route path="admin-users" element={<UserManagement />} />
          <Route path="admin-workspaces" element={<WorkspaceManagement />} />
          <Route path="admin-analytics" element={<AnalyticsDashboard />} />
          <Route path="admin-settings" element={<SystemSettings />} />
        </Route>
      </Route>

      <Route path="/Whiteboard" element={<Whiteboard />} />
      <Route path="/DocumentEditor" element={<DocumentEditor />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
