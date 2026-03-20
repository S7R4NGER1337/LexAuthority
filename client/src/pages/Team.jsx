import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { apiFetch } from '../utils/api';
import './Team.css';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  const [gridRef, gridVisible] = useInView({ threshold: 0.05 });
  const [ctaRef, ctaVisible]   = useInView();

  useEffect(() => {
    apiFetch('/api/team')
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <header className="team-header container">
        <p className="team-header__eyebrow hero-anim hero-anim-1">Integrity &amp; Excellence</p>
        <h1 className="team-header__title hero-anim hero-anim-2">Our Legal Professionals</h1>
        <p className="team-header__lead hero-anim hero-anim-3">
          A multi-disciplinary team of advocates dedicated to precision, intellectual rigor, and the
          relentless pursuit of our clients' interests across global jurisdictions.
        </p>
      </header>

      <section className="team-grid-section container">
        {loading && <p className="page-loading">Loading…</p>}
        {error   && <p className="page-error">Unable to load team members. Please try again later.</p>}

        {!loading && !error && (
          <div className="team-grid" ref={gridRef}>
            {members.map((m, i) => (
              <article
                key={m._id}
                className={`team-card anim ${gridVisible ? 'is-visible' : ''}`}
                style={{ '--anim-delay': `${i * 70}ms` }}
              >
                <div className="team-card__photo">
                  <img src={m.imageUrl} alt={m.imageAlt} />
                </div>
                <h3 className="team-card__name">{m.name}</h3>
                <p className="team-card__title">{m.title}</p>
                <div className="team-card__rule"></div>
                <p className="team-card__bio">{m.bio}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="team-cta">
        <div
          ref={ctaRef}
          className={`container team-cta__inner anim anim--fade ${ctaVisible ? 'is-visible' : ''}`}
        >
          <div className="team-cta__text">
            <h2 className="team-cta__title">Seeking Legal Counsel?</h2>
            <p className="team-cta__body">
              Our team is available for initial consultations to discuss your specific requirements
              and objectives.
            </p>
          </div>
          <div className="team-cta__actions">
            <button className="btn-primary" onClick={() => navigate('/contact')}>Contact the Firm</button>
            <button className="btn-ghost">View Offices</button>
          </div>
        </div>
      </section>
    </main>
  );
}
