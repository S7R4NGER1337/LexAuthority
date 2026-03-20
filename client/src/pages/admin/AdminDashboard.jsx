import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminFetch } from '../../utils/adminApi';

const CARDS = [
  { key: 'insights',      label: 'Insights',        icon: 'article', to: '/admin/insights'       },
  { key: 'team',          label: 'Team Members',    icon: 'group',   to: '/admin/team'           },
  { key: 'practiceAreas', label: 'Practice Areas',  icon: 'gavel',   to: '/admin/practice-areas' },
  { key: 'inquiries',     label: 'Inquiries',       icon: 'mail',    to: '/admin/inquiries',  badgeKey: 'newInquiries' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminFetch('/api/admin/stats').then(setStats).catch(() => {});
  }, []);

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Dashboard</h1>
      </div>

      <div className="adm-stats-grid">
        {CARDS.map(({ key, label, icon, to, badgeKey }) => (
          <Link key={key} to={to} className="adm-stat-card">
            <span className="material-symbols-outlined adm-stat-card__icon">{icon}</span>
            <div className="adm-stat-card__value">{stats ? stats[key] : '—'}</div>
            <div className="adm-stat-card__label">{label}</div>
            {badgeKey && !!stats?.[badgeKey] && (
              <span className="adm-stat-card__badge">{stats[badgeKey]} new</span>
            )}
          </Link>
        ))}
      </div>

      <div className="adm-card" style={{ marginTop: '2rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>
          Welcome to the LexAuthority admin panel. Use the sidebar to manage insights,
          team members, practice areas, and incoming inquiries.
        </p>
      </div>
    </div>
  );
}
