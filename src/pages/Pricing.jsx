import { Link } from 'react-router-dom';
import './PublicPages.css';
import './Pricing.css';

export default function Pricing() {
  return (
    <div className="public-page pricing-page">
      <section className="public-section">
        <h1 className="public-title">Pricing</h1>
        <p className="public-desc">
          Choose a plan that works for you. Free access for students and flexible job-posting plans for recruiters.
        </p>
      </section>

      {/* Recruiter / Company plans */}
      <section className="pricing-section pricing-recruiters">
        <h2 className="pricing-section-title">For Recruiters & Companies</h2>
        <p className="pricing-section-desc">
          Post jobs and reach students across Andhra Pradesh & Telangana. Upgrade as you grow.
        </p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free</h3>
            <p className="pricing-price">₹0</p>
            <p className="pricing-period">forever</p>
            <ul className="pricing-features">
              <li><strong>1 job post</strong> only</li>
              <li>Student notifications</li>
              <li>Basic dashboard</li>
              <li>Email support</li>
            </ul>
            <Link to="/register" className="btn-outline pricing-btn">Get Started Free</Link>
          </div>

          <div className="pricing-card pricing-card-featured">
            <span className="pricing-badge">Popular</span>
            <h3>Pro</h3>
            <p className="pricing-price">₹9</p>
            <p className="pricing-period">per month</p>
            <ul className="pricing-features">
              <li><strong>Limited job posts</strong> (5 active)</li>
              <li>All Free features</li>
              <li>Priority notifications</li>
              <li>Extended visibility</li>
            </ul>
            <Link to="/register" className="btn-create pricing-btn">Choose Pro</Link>
          </div>

          <div className="pricing-card pricing-card-unlimited">
            <h3>Premium</h3>
            <p className="pricing-price">₹49</p>
            <p className="pricing-period">per month</p>
            <ul className="pricing-features">
              <li><strong>Unlimited job posts</strong></li>
              <li>All Pro features</li>
              <li>Featured listings</li>
              <li>Priority support</li>
            </ul>
            <Link to="/register" className="btn-outline pricing-btn">Choose Premium</Link>
          </div>

          <div className="pricing-card pricing-card-unlimited">
            <h3>Premium+</h3>
            <p className="pricing-price">₹99</p>
            <p className="pricing-period">per month</p>
            <ul className="pricing-features">
              <li><strong>Unlimited job posts</strong></li>
              <li>Top placement & branding</li>
              <li>Dedicated support</li>
              <li>Best for growing teams</li>
            </ul>
            <Link to="/register" className="btn-create pricing-btn">Choose Premium+</Link>
          </div>
        </div>
      </section>

      {/* Student plans */}
      <section className="pricing-section pricing-students">
        <h2 className="pricing-section-title">For Students</h2>
        <p className="pricing-section-desc">
          Access documents, career guidance, and job alerts. Always free to get started.
        </p>
        <div className="pricing-grid pricing-grid-students">
          <div className="pricing-card">
            <h3>Free</h3>
            <p className="pricing-price">₹0</p>
            <ul className="pricing-features">
              <li>Approved documents & hall tickets</li>
              <li>College predictor</li>
              <li>Job listings & notifications</li>
              <li>Support tickets</li>
            </ul>
            <Link to="/register" className="btn-outline pricing-btn">Get Started</Link>
          </div>
          <div className="pricing-card pricing-card-featured">
            <span className="pricing-badge">Popular</span>
            <h3>₹1 Plan</h3>
            <p className="pricing-price">₹1</p>
            <ul className="pricing-features">
              <li>Everything in Free</li>
              <li>Extended features</li>
              <li>Priority support</li>
            </ul>
            <Link to="/register" className="btn-create pricing-btn">Learn More</Link>
          </div>
          <div className="pricing-card">
            <h3>₹9 Plan</h3>
            <p className="pricing-price">₹9</p>
            <ul className="pricing-features">
              <li>Full access</li>
              <li>Premium support</li>
              <li>Exam success tools</li>
            </ul>
            <Link to="/register" className="btn-outline pricing-btn">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="public-section pricing-cta">
        <p className="public-desc">Not sure which plan to pick? Create a free account and upgrade anytime.</p>
        <div className="public-ctas">
          <Link to="/register" className="btn-create">Create Free Account</Link>
          <Link to="/contact" className="btn-outline">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
