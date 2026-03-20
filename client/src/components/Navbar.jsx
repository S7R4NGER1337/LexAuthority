import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar__inner container">
        <NavLink to="/" className="navbar__brand">LexAuthority</NavLink>

        <div className="navbar__links">
          <NavLink to="/practice-areas" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
            Practice Areas
          </NavLink>
          <NavLink to="/team" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
            Our Team
          </NavLink>
          <NavLink to="/insights" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
            Insights
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
            Contact
          </NavLink>
        </div>

        <button className="navbar__cta btn-primary" onClick={() => navigate('/contact')}>
          Book a Consultation
        </button>
      </div>
    </nav>
  );
}
