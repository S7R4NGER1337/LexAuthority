import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PracticeAreas.css';

export default function PracticeAreas() {
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/practice-areas')
      .then((r) => r.json())
      .then(setAreas)
      .catch(console.error);
  }, []);

  return (
    <main>
      <div className="pa-page container">
        {/* Header */}
        <header className="pa-header">
          <span className="pa-header__eyebrow">Expertise</span>
          <h1 className="pa-header__title">Our Practice Areas</h1>
          <p className="pa-header__lead">
            LexAuthority provides comprehensive legal solutions across a global spectrum of
            industries. We combine technical excellence with commercial insight to navigate your
            most complex legal challenges.
          </p>
        </header>

        {/* Grid */}
        <div className="pa-grid">
          {areas.map((area) => (
            <div key={area._id} className="pa-card">
              <div className="pa-card__icon">
                <span className="material-symbols-outlined">{area.icon}</span>
              </div>
              <h3 className="pa-card__title">{area.title}</h3>
              <p className="pa-card__body">{area.description}</p>
              <a href="#" className="pa-card__link">
                Explore practice
                <span className="material-symbols-outlined pa-card__arrow">arrow_forward</span>
              </a>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pa-cta">
          <div className="pa-cta__text">
            <h2 className="pa-cta__title">Can't find what you're looking for?</h2>
            <p className="pa-cta__body">
              Our expertise spans across numerous niche sectors and industries globally. Contact our
              team to discuss your specific requirements.
            </p>
          </div>
          <div className="pa-cta__actions">
            <button className="btn-ghost" onClick={() => navigate('/practice-areas')}>
              View All Expertise
            </button>
            <button className="btn-primary" onClick={() => navigate('/contact')}>
              Speak to a Partner
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
