import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { apiFetch } from '../utils/api';
import './PracticeAreas.css';

export default function PracticeAreas() {
  const [areas, setAreas]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  const [gridRef, gridVisible] = useInView();
  const [ctaRef, ctaVisible]   = useInView();

  useEffect(() => {
    apiFetch('/api/practice-areas')
      .then(setAreas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <div className="pa-page container">
        <header className="pa-header">
          <span className="pa-header__eyebrow hero-anim hero-anim-1">Expertise</span>
          <h1 className="pa-header__title hero-anim hero-anim-2">Our Practice Areas</h1>
          <p className="pa-header__lead hero-anim hero-anim-3">
            LexAuthority provides comprehensive legal solutions across a global spectrum of
            industries. We combine technical excellence with commercial insight to navigate your
            most complex legal challenges.
          </p>
        </header>

        {loading && <p className="page-loading">Loading…</p>}
        {error   && <p className="page-error">Unable to load practice areas. Please try again later.</p>}

        {!loading && !error && (
          <div className="pa-grid" ref={gridRef}>
            {areas.map((area, i) => (
              <div
                key={area._id}
                className={`pa-card anim ${gridVisible ? 'is-visible' : ''}`}
                style={{ '--anim-delay': `${i * 80}ms` }}
              >
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
        )}

        <div ref={ctaRef} className={`pa-cta anim ${ctaVisible ? 'is-visible' : ''}`}>
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
