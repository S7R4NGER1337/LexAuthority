import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Team.css';

export default function Team() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then(setMembers)
      .catch(console.error);
  }, []);

  return (
    <main>
      {/* Header */}
      <header className="team-header container">
        <p className="team-header__eyebrow">Integrity &amp; Excellence</p>
        <h1 className="team-header__title">Our Legal Professionals</h1>
        <p className="team-header__lead">
          A multi-disciplinary team of advocates dedicated to precision, intellectual rigor, and the
          relentless pursuit of our clients' interests across global jurisdictions.
        </p>
      </header>

      {/* Grid */}
      <section className="team-grid-section container">
        <div className="team-grid">
          {members.map((m) => (
            <article key={m._id} className="team-card">
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
      </section>

      {/* CTA */}
      <section className="team-cta">
        <div className="container team-cta__inner">
          <div className="team-cta__text">
            <h2 className="team-cta__title">Seeking Legal Counsel?</h2>
            <p className="team-cta__body">
              Our team is available for initial consultations to discuss your specific requirements
              and objectives.
            </p>
          </div>
          <div className="team-cta__actions">
            <button className="btn-primary" onClick={() => navigate('/contact')}>
              Contact the Firm
            </button>
            <button className="btn-ghost">View Offices</button>
          </div>
        </div>
      </section>
    </main>
  );
}
