import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { apiFetch } from '../utils/api';
import './Home.css';

const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGaRu6n1Ej07sgPAPad6_DnwyRCvHX81wX2gwYUT0FxaQ4VimpuHxMUusgotcL9xLQoEYO_XgQeTtG6LxaxTE1z3_Evlt3HJnnWw1hwxtyG6iEst1tXu1CrmRhyggM6RyEFxpHpNzY9a-QNlRlJ6GO_JQvwi5tsr21Bd2cF8PGF9gUDO266IXQ-oYVYlEhxrGkf4WTOUZKVTXeaPmgFxom4derOhWL2z6lnEn5zoTEufFvpXcctjB3h3f7msegonH2EhT7z2K0Dg';
const ABOUT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpUfDQTqdrrHqNpttzmiF4Qw9V_orfJIqv_4wnJmoIqe4LhonUWU2l6RY2Rna0GOnZoBEfVfem7DiQAx7ECqt7zHwuYIUgEFC5krowYC5S9qaXtnzcMWXjrUj4ZhsboXR-BwjvbWOlGwlgWfw0ZfR62mQAY821xWv6YaDcw223DV0TwpzdXrpjNzKi3Ne4ahV4FhlVyW0ejFk70h5ik_Nt-sjS6BDtX8q9QOs6D-u0abiUZmbkVTeQ5VUqAEB8rBnX832K3LxXiA';

const STATS = [
  { target: 25,  suffix: '+',  label: 'Years of Excellence' },
  { target: 400, suffix: '+',  label: 'Partners Globally' },
  { target: 12,  suffix: 'k+', label: 'Cases Resolved' },
  { target: 98,  suffix: '%',  label: 'Client Satisfaction' },
];

function StatItem({ stat, isVisible, delay }) {
  const value = useCountUp(stat.target, { active: isVisible, duration: 1800 });
  return (
    <div
      className={`home-stats__item anim ${isVisible ? 'is-visible' : ''}`}
      style={{ '--anim-delay': `${delay}ms` }}
    >
      <span className="home-stats__value">{value}{stat.suffix}</span>
      <span className="home-stats__label">{stat.label}</span>
    </div>
  );
}

export default function Home() {
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  const [statsRef, statsVisible]     = useInView();
  const [areasRef, areasVisible]     = useInView();
  const [aboutRef, aboutVisible]     = useInView();
  const [sectionRef, sectionVisible] = useInView();

  useEffect(() => {
    apiFetch('/api/practice-areas').then(setAreas).catch(console.error);
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="home-hero section-pad-lg">
        <div className="container home-hero__inner">
          <div className="home-hero__text">
            <h1 className="home-hero__title hero-anim hero-anim-1">Your Trusted Legal Partner</h1>
            <p className="home-hero__body hero-anim hero-anim-2">
              Providing sophisticated legal solutions for complex challenges. Our heritage of
              excellence ensures your interests are protected with precision and integrity.
            </p>
            <button
              className="btn-primary home-hero__cta hero-anim hero-anim-3"
              onClick={() => navigate('/contact')}
            >
              Book a Consultation
            </button>
          </div>
          <div className="home-hero__image hero-anim-img">
            <img src={HERO_IMG} alt="Modern professional law office boardroom" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="home-stats section-pad">
        <div className="container">
          <div className="home-stats__grid" ref={statsRef}>
            {STATS.map((s, i) => (
              <StatItem key={s.label} stat={s} isVisible={statsVisible} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Practice Areas ── */}
      <section className="section-pad">
        <div className="container">
          <div
            ref={sectionRef}
            className={`section-header anim ${sectionVisible ? 'is-visible' : ''}`}
          >
            <h2 className="section-title">Core Practice Areas</h2>
            <div className="section-rule"></div>
          </div>
          <div className="home-areas__grid" ref={areasRef}>
            {areas.slice(0, 6).map((area, i) => (
              <div
                key={area._id}
                className={`home-area-card anim ${areasVisible ? 'is-visible' : ''}`}
                style={{ '--anim-delay': `${i * 80}ms` }}
              >
                <span className="material-symbols-outlined home-area-card__icon">{area.icon}</span>
                <h3 className="home-area-card__title">{area.title}</h3>
                <p className="home-area-card__body">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="home-about section-pad" ref={aboutRef}>
        <div className="container home-about__inner">
          <div className={`home-about__text anim anim--left ${aboutVisible ? 'is-visible' : ''}`}>
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
            <Link to="/team" className="home-about__link">Learn More About Our History</Link>
          </div>
          <div
            className={`home-about__image anim anim--right ${aboutVisible ? 'is-visible' : ''}`}
            style={{ '--anim-delay': '120ms' }}
          >
            <img src={ABOUT_IMG} alt="Professional law team meeting" />
          </div>
        </div>
      </section>
    </main>
  );
}
