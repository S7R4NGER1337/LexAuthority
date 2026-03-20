import { useEffect, useState } from 'react';
import './Insights.css';

const CATEGORIES = ['All Insights', 'Corporate Law', 'Litigation', 'Regulatory Affairs', 'Intellectual Property'];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Insights');

  useEffect(() => {
    const url = activeCategory === 'All Insights'
      ? '/api/insights'
      : `/api/insights?category=${encodeURIComponent(activeCategory)}`;
    fetch(url)
      .then((r) => r.json())
      .then(setInsights)
      .catch(console.error);
  }, [activeCategory]);

  return (
    <main className="insights-page container">
      {/* Header */}
      <header className="insights-header">
        <h1 className="insights-header__title">Insights &amp; Legal Perspectives</h1>
        <p className="insights-header__lead">
          Critical analysis on evolving regulatory landscapes, global market trends, and
          precedent-setting judicial developments.
        </p>
      </header>

      {/* Filter */}
      <nav className="insights-filter">
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

      {/* Grid */}
      <section className="insights-grid">
        {insights.map((item) => (
          <article key={item._id} className="insight-card">
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
          </article>
        ))}
      </section>

      {/* Pagination placeholder */}
      <div className="insights-pagination">
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
