import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGaRu6n1Ej07sgPAPad6_DnwyRCvHX81wX2gwYUT0FxaQ4VimpuHxMUusgotcL9xLQoEYO_XgQeTtG6LxaxTE1z3_Evlt3HJnnWw1hwxtyG6iEst1tXu1CrmRhyggM6RyEFxpHpNzY9a-QNlRlJ6GO_JQvwi5tsr21Bd2cF8PGF9gUDO266IXQ-oYVYlEhxrGkf4WTOUZKVTXeaPmgFxom4derOhWL2z6lnEn5zoTEufFvpXcctjB3h3f7msegonH2EhT7z2K0Dg';
const ABOUT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpUfDQTqdrrHqNpttzmiF4Qw9V_orfJIqv_4wnJmoIqe4LhonUWU2l6RY2Rna0GOnZoBEfVfem7DiQAx7ECqt7zHwuYIUgEFC5krowYC5S9qaXtnzcMWXjrUj4ZhsboXR-BwjvbWOlGwlgWfw0ZfR62mQAY821xWv6YaDcw223DV0TwpzdXrpjNzKi3Ne4ahV4FhlVyW0ejFk70h5ik_Nt-sjS6BDtX8q9QOs6D-u0abiUZmbkVTeQ5VUqAEB8rBnX832K3LxXiA';

const STATS = [
  { value: '25+', label: 'Years of Excellence' },
  { value: '400+', label: 'Partners Globally' },
  { value: '12k+', label: 'Cases Resolved' },
  { value: '98%', label: 'Client Satisfaction' },
];

export default function Home() {
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
      {/* ── Hero ── */}
      <section className="home-hero section-pad-lg">
        <div className="container home-hero__inner">
          <div className="home-hero__text">
            <h1 className="home-hero__title">Your Trusted Legal Partner</h1>
            <p className="home-hero__body">
              Providing sophisticated legal solutions for complex challenges. Our heritage of
              excellence ensures your interests are protected with precision and integrity.
            </p>
            <button className="btn-primary home-hero__cta" onClick={() => navigate('/contact')}>
              Book a Consultation
            </button>
          </div>
          <div className="home-hero__image">
            <img src={HERO_IMG} alt="Modern professional law office boardroom" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="home-stats section-pad">
        <div className="container">
          <div className="home-stats__grid">
            {STATS.map((s) => (
              <div key={s.label} className="home-stats__item">
                <span className="home-stats__value">{s.value}</span>
                <span className="home-stats__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Practice Areas ── */}
      <section className="section-pad">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Core Practice Areas</h2>
            <div className="section-rule"></div>
          </div>
          <div className="home-areas__grid">
            {areas.slice(0, 6).map((area) => (
              <div key={area._id} className="home-area-card">
                <span className="material-symbols-outlined home-area-card__icon">{area.icon}</span>
                <h3 className="home-area-card__title">{area.title}</h3>
                <p className="home-area-card__body">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="home-about section-pad">
        <div className="container home-about__inner">
          <div className="home-about__text">
            <h2 className="home-about__title">Uncompromising Standard of Excellence</h2>
            <p className="home-about__body">
              Founded on the principles of integrity and intellectual rigor, LexAuthority has spent
              decades navigating the complexities of the legal landscape. We don't just provide
              advice; we build long-term strategic partnerships.
            </p>
            <p className="home-about__body">
              Our multidisciplinary approach allows us to see beyond the immediate legal challenge to
              the broader business objective, ensuring our clients remain ahead in an ever-evolving
              world.
            </p>
            <Link to="/team" className="home-about__link">
              Learn More About Our History
            </Link>
          </div>
          <div className="home-about__image">
            <img src={ABOUT_IMG} alt="Professional law team meeting" />
          </div>
        </div>
      </section>
    </main>
  );
}
