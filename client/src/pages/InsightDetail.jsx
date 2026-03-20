import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { apiFetch } from '../utils/api';
import { useInView } from '../hooks/useInView';
import './InsightDetail.css';

const PURIFY_CONFIG = {
  ALLOWED_TAGS: ['h2', 'h3', 'p', 'ul', 'li', 'div'],
  ALLOWED_ATTR: ['class'],
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function InsightDetail() {
  const { slug } = useParams();
  const [insight, setInsight] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [articleRef, articleVisible] = useInView({ threshold: 0.03 });
  const [sidebarRef, sidebarVisible] = useInView({ threshold: 0.03 });

  useEffect(() => {
    setLoading(true);
    setError(null);
    setInsight(null);
    setRelated([]);

    apiFetch(`/api/insights/${slug}`)
      .then((data) => {
        setInsight(data);
        return apiFetch(`/api/insights?category=${encodeURIComponent(data.category)}`);
      })
      .then((all) => setRelated(all.filter((i) => i.slug !== slug).slice(0, 3)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="page-loading">Loading…</p>;
  if (error)   return <p className="page-error">Unable to load this insight. Please try again later.</p>;
  if (!insight) return null;

  return (
    <main className="insight-detail container">
      <Link to="/insights" className="insight-detail__back">
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Insights
      </Link>

      <div className="insight-detail__layout">
        {/* ── Article ──────────────────────────────────────────── */}
        <article
          ref={articleRef}
          className={`insight-detail__article anim ${articleVisible ? 'is-visible' : ''}`}
        >
          <header className="insight-detail__header">
            <span className="insight-detail__category">{insight.category}</span>

            <h1 className="insight-detail__title">{insight.title}</h1>

            <div className="insight-detail__meta">
              {insight.author   && <span>By {insight.author}</span>}
              {insight.author   && <span className="insight-detail__meta-dot" />}
              <span>{formatDate(insight.publishedAt)}</span>
              {insight.readTime && <span className="insight-detail__meta-dot" />}
              {insight.readTime && <span>{insight.readTime}</span>}
            </div>

            <p className="insight-detail__lead">{insight.excerpt}</p>
          </header>

          {insight.imageUrl && (
            <figure className="insight-detail__hero">
              <img src={insight.imageUrl} alt={insight.imageAlt || insight.title} />
            </figure>
          )}

          {insight.body && (
            <div
              className="insight-detail__body"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(insight.body, PURIFY_CONFIG) }}
            />
          )}

          <footer className="insight-detail__footer">
            {insight.tags?.length > 0 && (
              <div className="insight-detail__tags">
                {insight.tags.map((tag) => (
                  <span key={tag} className="insight-detail__tag">{tag}</span>
                ))}
              </div>
            )}

            <div className="insight-detail__share">
              <span className="insight-detail__share-label">Share</span>
              <button
                className="material-symbols-outlined insight-detail__share-btn"
                aria-label="Share article"
                onClick={() =>
                  navigator.share?.({ title: insight.title, url: window.location.href })
                }
              >
                share
              </button>
              <button
                className="material-symbols-outlined insight-detail__share-btn"
                aria-label="Copy link"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
              >
                content_copy
              </button>
            </div>
          </footer>
        </article>

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside
          ref={sidebarRef}
          className={`insight-detail__sidebar anim anim--right ${sidebarVisible ? 'is-visible' : ''}`}
        >
          {/* CTA */}
          <div className="insight-cta">
            <h3 className="insight-cta__title">Secure Your Legal Position</h3>
            <p className="insight-cta__body">
              Our specialized team provides bespoke advisory services for complex legal
              matters across jurisdictions.
            </p>
            <Link to="/contact" className="insight-cta__btn">
              Request a Consultation
            </Link>
          </div>

          {/* Related insights */}
          {related.length > 0 && (
            <div className="insight-related">
              <h3 className="insight-related__heading">Related Insights</h3>
              <div className="insight-related__list">
                {related.map((item) => (
                  <Link
                    key={item._id}
                    to={`/insights/${item.slug}`}
                    className="insight-related__item"
                  >
                    <span className="insight-related__cat">{item.category}</span>
                    <h4 className="insight-related__title">{item.title}</h4>
                    <p className="insight-related__date">{formatDate(item.publishedAt)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author */}
          {insight.author && (
            <div className="insight-author">
              <h3 className="insight-author__heading">Article Author</h3>
              <div className="insight-author__info">
                <div className="insight-author__avatar" aria-hidden="true">
                  {insight.author.charAt(0)}
                </div>
                <div>
                  <p className="insight-author__name">{insight.author}</p>
                  {insight.authorTitle && (
                    <p className="insight-author__role">{insight.authorTitle}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
