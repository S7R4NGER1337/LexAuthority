import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const LINKS = [
  { to: '/practice-areas', label: 'Practice Areas' },
  { to: '/team',           label: 'Our Team'       },
  { to: '/insights',       label: 'Insights'       },
  { to: '/contact',        label: 'Contact'        },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const linkClass = ({ isActive }) =>
    isActive ? 'navbar__link navbar__link--active' : 'navbar__link';

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">
          <NavLink to="/" className="navbar__brand">LexAuthority</NavLink>

          {/* Desktop links */}
          <div className="navbar__links">
            {LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>{label}</NavLink>
            ))}
          </div>

          <button className="navbar__cta btn-primary" onClick={() => navigate('/contact')}>
            Book a Consultation
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="navbar__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <span className="material-symbols-outlined">
              {open ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className={`nav-overlay${open ? ' nav-overlay--open' : ''}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`nav-drawer${open ? ' nav-drawer--open' : ''}`} role="dialog" aria-modal="true">
        <div className="nav-drawer__links">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>{label}</NavLink>
          ))}
        </div>
        <button className="btn-primary nav-drawer__cta" onClick={() => navigate('/contact')}>
          Book a Consultation
        </button>
      </div>
    </>
  );
}
