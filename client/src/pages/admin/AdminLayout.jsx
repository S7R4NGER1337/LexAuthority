import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './admin.css';

const NAV = [
  { to: '/admin',                end: true,  icon: 'dashboard',  label: 'Dashboard'       },
  { to: '/admin/insights',       end: false, icon: 'article',    label: 'Insights'        },
  { to: '/admin/team',           end: false, icon: 'group',      label: 'Team'            },
  { to: '/admin/practice-areas', end: false, icon: 'gavel',      label: 'Practice Areas'  },
  { to: '/admin/inquiries',      end: false, icon: 'mail',       label: 'Inquiries'       },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }

  return (
    <div className="adm-wrap">
      <aside className="adm-sidebar">
        <div className="adm-sidebar__brand">LexAuthority</div>

        <nav className="adm-nav">
          {NAV.map(({ to, end, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `adm-nav__link${isActive ? ' adm-nav__link--active' : ''}`
              }
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="adm-logout" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </aside>

      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}
