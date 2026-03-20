import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useInView } from '../hooks/useInView';
import './PracticeAreaDetail.css';

export default function PracticeAreaDetail() {
  const { slug } = useParams();
  const [area, setArea]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [expertiseRef, expertiseVisible] = useInView({ threshold: 0.05 });
  const [sectorsRef,   sectorsVisible]   = useInView({ threshold: 0.05 });
  const [ctaRef,       ctaVisible]       = useInView({ threshold: 0.1  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch(`/api/practice-areas/${slug}`)
      .then(setArea)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="page-loading">Loading…</p>;
  if (error)   return <p className="page-error">Unable to load this practice area. Please try again later.</p>;
  if (!area)   return null;

  return (
    <main className="pad-page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pad-hero container">
        <div className="pad-hero__text">
          <Link to="/practice-areas" className="pad-back">
            <span className="material-symbols-outlined">arrow_back</span>
            All Practice Areas
          </Link>
          <h1 className="pad-hero__title hero-anim hero-anim-1">{area.title}</h1>
          <p className="pad-hero__desc hero-anim hero-anim-2">
            {area.fullDescription || area.description}
          </p>
          <Link to="/contact" className="btn-primary hero-anim hero-anim-3">
            Consult a Partner
          </Link>
        </div>

        {area.imageUrl && (
          <div className="pad-hero__image hero-anim hero-anim-img">
            <img src={area.imageUrl} alt={area.title} />
          </div>
        )}
      </section>

      {/* ── Core Expertise ───────────────────────────────────── */}
      {area.services?.length > 0 && (
        <section
          ref={expertiseRef}
          className={`pad-expertise anim anim--fade ${expertiseVisible ? 'is-visible' : ''}`}
        >
          <div className="container">
            <div className="pad-expertise__eyebrow">Core Expertise</div>
            <div className="pad-expertise__grid">
              {area.services.map((s, i) => (
                <div
                  key={i}
                  className="pad-service"
                  style={{ '--anim-delay': `${i * 100}ms` }}
                >
                  <span className="material-symbols-outlined pad-service__icon">{s.icon}</span>
                  <h3 className="pad-service__title">{s.title}</h3>
                  <p className="pad-service__body">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Sector Specialization ────────────────────────────── */}
      {area.sectors?.length > 0 && (
        <section
          ref={sectorsRef}
          className={`pad-sectors anim anim--fade ${sectorsVisible ? 'is-visible' : ''}`}
        >
          <div className="container pad-sectors__inner">
            <div className="pad-sectors__intro">
              <h2 className="pad-sectors__title">Sector Specialisation</h2>
              <p className="pad-sectors__body">
                Deep industry knowledge allowing for bespoke legal strategies tailored
                to specific market dynamics.
              </p>
            </div>
            <div className="pad-sectors__grid">
              {area.sectors.map((s, i) => (
                <div key={i} className="pad-sector">
                  <span className="pad-sector__label">
                    Sector {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="pad-sector__title">{s.title}</h4>
                  <p className="pad-sector__desc">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        className={`pad-cta anim anim--fade ${ctaVisible ? 'is-visible' : ''}`}
      >
        <div className="container pad-cta__inner">
          <h2 className="pad-cta__title">Strategizing Your Next Move?</h2>
          <p className="pad-cta__body">
            Engage with our senior partners to discuss your firm's objectives and how our
            bespoke legal frameworks can accelerate your growth.
          </p>
          <Link to="/contact" className="btn-primary">Consult a Partner</Link>
        </div>
      </section>
    </main>
  );
}
