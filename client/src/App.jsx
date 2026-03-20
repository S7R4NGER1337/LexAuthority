import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './components/PublicLayout';

// Public pages
import Home           from './pages/Home';
import PracticeAreas  from './pages/PracticeAreas';
import Team           from './pages/Team';
import Insights       from './pages/Insights';
import InsightDetail  from './pages/InsightDetail';
import Contact        from './pages/Contact';

// Admin pages
import AdminLogin         from './pages/admin/AdminLogin';
import AdminLayout        from './pages/admin/AdminLayout';
import AdminDashboard     from './pages/admin/AdminDashboard';
import AdminInsights      from './pages/admin/AdminInsights';
import AdminTeam          from './pages/admin/AdminTeam';
import AdminPracticeAreas from './pages/admin/AdminPracticeAreas';
import AdminInquiries     from './pages/admin/AdminInquiries';

function isTokenValid() {
  const token = localStorage.getItem('admin_token');
  if (!token) return false;
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function RequireAdmin({ children }) {
  return isTokenValid() ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── Admin (no Navbar / Footer) ─────────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index                 element={<AdminDashboard />} />
          <Route path="insights"       element={<AdminInsights />} />
          <Route path="team"           element={<AdminTeam />} />
          <Route path="practice-areas" element={<AdminPracticeAreas />} />
          <Route path="inquiries"      element={<AdminInquiries />} />
        </Route>

        {/* ── Public (with Navbar / Footer) ─────────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/"                   element={<Home />} />
          <Route path="/practice-areas"     element={<PracticeAreas />} />
          <Route path="/team"               element={<Team />} />
          <Route path="/insights"           element={<Insights />} />
          <Route path="/insights/:slug"     element={<InsightDetail />} />
          <Route path="/contact"            element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}
