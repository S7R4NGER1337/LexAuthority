import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { apiFetch } from '../utils/api';
import './Insights.css';

const CATEGORIES = ['All Insights', 'Corporate Law', 'Litigation', 'Regulatory Affairs', 'Intellectual Property'];

function formatDate(iso) {
  return new Date(iso)
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase();
}

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [activeCategory, setActiveCategory] = useState('All Insights');

  const [gridRef, gridVisible]   = useInView({ threshold: 0.05 });
  const [pagerRef, pagerVisible] = useInView();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = activeCategory === 'All Insights'
      ? '/api/insights'
      : `/api/insights?category=${encodeURIComponent(activeCategory)}`;
    apiFetch(url)
      .then(setInsights)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <main className="insights-page container">
      <header className="insights-header">
        <h1 className="insights-header__title hero-anim hero-anim-1">
          Insights &amp; Legal Perspectives
        </h1>
        <p className="insights-header__lead hero-anim hero-anim-2">
          Critical analysis on evolving regulatory landscapes, global market trends, and
          precedent-setting judicial developments.
        </p>
      </header>

      <nav className="insights-filter hero-anim hero-anim-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`insights-filter__btn${activeCategory === cat ? ' insights-filter__btn--active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      {loading && <p className="page-loading">Loading…</p>}
      {error   && <p className="page-error">Unable to load insights. Please try again later.</p>}

      {!loading && !error && (
        <section className="insights-grid" ref={gridRef}>
          {insights.map((item, i) => (
            <Link
              key={item._id}
              to={`/insights/${item.slug}`}
              className={`insight-card anim ${gridVisible ? 'is-visible' : ''}`}
              style={{ '--anim-delay': `${i * 80}ms` }}
            >
              <div className="insight-card__image">
                <img src={item.imageUrl} alt={item.imageAlt} />
              </div>
              <div className="insight-card__body">
                <span className="insight-card__category">{item.category}</span>
                <h3 className="insight-card__title">{item.title}</h3>
                <p className="insight-card__excerpt">{item.excerpt}</p>
                <div className="insight-card__footer">
                  <time className="insight-card__date">{formatDate(item.publishedAt)}</time>
                  <span className="material-symbols-outlined insight-card__arrow">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      <div
        ref={pagerRef}
        className={`insights-pagination anim anim--fade ${pagerVisible ? 'is-visible' : ''}`}
      >
        <button className="insights-pagination__btn" disabled>
          <span className="material-symbols-outlined">chevron_left</span>
          Previous
        </button>
        <div className="insights-pagination__pages">
          <span className="insights-pagination__page insights-pagination__page--active">1</span>
          <span className="insights-pagination__page">2</span>
          <span className="insights-pagination__page">3</span>
        </div>
        <button className="insights-pagination__btn">
          Next
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </main>
  );
}
