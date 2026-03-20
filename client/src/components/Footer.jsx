import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid container">
        <div className="footer__brand">
          <span className="footer__logo">LexAuthority</span>
          <p className="footer__tagline">
            Global legal advisors providing elite counsel for the modern enterprise.
            Built on heritage, driven by precision.
          </p>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Expertise</h4>
          <ul className="footer__list">
            <li><Link to="/practice-areas">Practice Areas</Link></li>
            <li><Link to="/team">Our Team</Link></li>
            <li><Link to="/insights">Insights</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Governance</h4>
          <ul className="footer__list">
            <li><a href="#">Legal Notice</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookie Strategy</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Engagement</h4>
          <ul className="footer__list">
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Accessibility</a></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom container">
        <span>© 2024 LexAuthority LLP. All rights reserved.</span>
        <div className="footer__social">
          <a href="#">LinkedIn</a>
          <a href="#">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
