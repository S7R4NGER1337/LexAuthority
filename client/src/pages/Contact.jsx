import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { apiFetch } from '../utils/api';
import './Contact.css';

const MAP_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuByeX5j60qvBM5hINbNyqNVRDMlUxVxio-vsY45PWi_Hvm9PDh2hCa77qZffkD44fFtmoBcDpOw-jVjHjprC8jRYZsE2ZxPFkac8f8tMqRQTzE86sBTFLLsiZXv9KwUk2E2lwMt7q2dQIFsSWpYAmEWKnXKtOuXlmtY-aQ26Xnh6eZPlGtYscnsnjDHUiBkbNXk4Bvklmx1rcb0GkPV6bZlVlLohqftoJ1nw11xvLaRy7q9UZjB4slaXf0T2_G6rJTvTr9_natnxw';

const INITIAL = { name: '', email: '', practiceArea: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  if (!form.name.trim())        return 'Full name is required.';
  if (form.name.trim().length > 120) return 'Name must be 120 characters or fewer.';
  if (!form.email.trim())       return 'Email address is required.';
  if (!EMAIL_RE.test(form.email)) return 'Please enter a valid email address.';
  if (!form.practiceArea)       return 'Please select a practice area.';
  if (!form.message.trim())     return 'Please describe your inquiry.';
  if (form.message.trim().length > 4000) return 'Message must be 4000 characters or fewer.';
  return null;
}

export default function Contact() {
  const [form, setForm]     = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const [infoRef, infoVisible] = useInView();
  const [formRef, formVisible] = useInView();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validate(form);
    if (validationError) {
      setStatus('error');
      setErrorMsg(validationError);
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    try {
      await apiFetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('success');
      setForm(INITIAL);
    } catch (err) {
      setStatus('error');
      // Show only safe server messages; apiFetch already sanitises status codes
      setErrorMsg(err.message || 'Submission failed. Please try again.');
    }
  }

  return (
    <main className="contact-page container">
      <div className="contact-grid">
        {/* Left — Firm info */}
        <section
          ref={infoRef}
          className={`contact-info anim anim--left ${infoVisible ? 'is-visible' : ''}`}
        >
          <div className="contact-info__intro">
            <h1 className="contact-info__title">
              Connect with our<br />legal counsel.
            </h1>
            <p className="contact-info__lead">
              Our partners are available for international consultations across our global network
              of offices.
            </p>
          </div>

          <div className="contact-info__details">
            <div className="contact-info__block">
              <h3 className="contact-info__label">London — Primary Office</h3>
              <p className="contact-info__value">
                One Chancery Plaza, Suite 400<br />London, UK EC4A 1BL
              </p>
            </div>
            <div className="contact-info__block">
              <h3 className="contact-info__label">New York Office</h3>
              <p className="contact-info__value">
                340 Madison Avenue, 18th Floor<br />New York, NY 10173, USA
              </p>
            </div>
            <div className="contact-info__row">
              <div className="contact-info__block">
                <h3 className="contact-info__label">Inquiries</h3>
                <p className="contact-info__value">+44 (0) 20 7946 0358</p>
                <p className="contact-info__value">contact@lexauthority.law</p>
              </div>
              <div className="contact-info__block">
                <h3 className="contact-info__label">Operating Hours</h3>
                <p className="contact-info__value">Mon — Fri: 08:00 – 19:00</p>
                <p className="contact-info__value">Sat: By Appointment</p>
              </div>
            </div>
          </div>

          <div className="contact-map">
            <img src={MAP_IMG} alt="Map location of London office" />
          </div>
        </section>

        {/* Right — Form */}
        <section
          ref={formRef}
          className={`contact-form-wrap anim anim--right ${formVisible ? 'is-visible' : ''}`}
          style={{ '--anim-delay': '120ms' }}
        >
          <div className="contact-form-box">
            <h2 className="contact-form__title">Submit an Inquiry</h2>

            {status === 'success' ? (
              <div className="contact-success">
                <span className="material-symbols-outlined contact-success__icon">check_circle</span>
                <p>Your inquiry has been submitted. We will be in touch shortly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label htmlFor="name" className="contact-form__label">Full Name</label>
                    <input
                      id="name" name="name" type="text"
                      className="contact-form__input"
                      placeholder="Johnathan Doe"
                      value={form.name} onChange={handleChange}
                      maxLength={120}
                    />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="email" className="contact-form__label">Email Address</label>
                    <input
                      id="email" name="email" type="email"
                      className="contact-form__input"
                      placeholder="j.doe@enterprise.com"
                      value={form.email} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="contact-form__field">
                  <label htmlFor="practiceArea" className="contact-form__label">Practice Area</label>
                  <select
                    id="practiceArea" name="practiceArea"
                    className="contact-form__input contact-form__select"
                    value={form.practiceArea} onChange={handleChange}
                  >
                    <option value="" disabled>Select an area of interest</option>
                    <option value="corporate">Corporate &amp; M&amp;A</option>
                    <option value="litigation">Commercial Litigation</option>
                    <option value="intellectual">Intellectual Property</option>
                    <option value="private">Private Wealth</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="employment">Employment Law</option>
                  </select>
                </div>

                <div className="contact-form__field">
                  <label htmlFor="message" className="contact-form__label">
                    Nature of Inquiry
                    <span className="contact-form__counter">
                      {form.message.length}/4000
                    </span>
                  </label>
                  <textarea
                    id="message" name="message"
                    className="contact-form__input contact-form__textarea"
                    placeholder="Briefly describe your legal requirements…"
                    rows={4}
                    value={form.message} onChange={handleChange}
                    maxLength={4000}
                  />
                </div>

                {status === 'error' && (
                  <p className="contact-form__error" role="alert">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  className="btn-primary contact-form__submit"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Sending…' : 'Send Inquiry'}
                </button>

                <p className="contact-form__disclaimer">
                  By submitting this form, you acknowledge that our receipt of your message does not
                  create an attorney-client relationship. Please do not send confidential information.
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
