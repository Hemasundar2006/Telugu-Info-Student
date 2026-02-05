import { Link } from 'react-router-dom';
import { FiTarget, FiBook, FiFileText, FiAward, FiStar, FiTrendingUp } from 'react-icons/fi';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      <section className="hero">
        <p className="trust-badge">
          <span className="star">★</span> For Andhra Pradesh & Telangana Students
        </p>
        <h1 className="hero-title">
          Your <span className="highlight">College & Career</span> Journey, Simplified
        </h1>
        <p className="hero-subtitle">
          AI-driven career guidance, roadmaps, digital mark sheets, scholarships, and college reviews—all in one place. For students at every stage. Make informed decisions for your future.
        </p>
        <div className="hero-ctas">
          <Link to="/register" className="btn-explore">Get Started Free</Link>
          <Link to="/services" className="btn-whatsapp">Explore Services</Link>
        </div>
      </section>

      <section className="section-dark features-section">
        {/* <div className="wave-sep" aria-hidden="true" /> */}
        <h2 className="section-title">Everything You Need as a Student</h2>
        <p className="section-desc">
          One platform for career guidance, documents, and college decisions—at every stage of your journey.
        </p>
        <div className="feature-grid">
          <div className="feature-card">
            <FiTarget className="feature-icon" size={28} />
            <h3>AI Career Guidance & Roadmaps</h3>
            <p>Personalised roadmaps and AI-driven guidance to choose the right stream, course, and career path.</p>
          </div>
          <div className="feature-card">
            <FiTrendingUp className="feature-icon" size={28} />
            <h3>College & Course Finder</h3>
            <p>Explore colleges and courses by rank, category, and location. Make informed choices.</p>
          </div>
          <div className="feature-card">
            <FiFileText className="feature-icon" size={28} />
            <h3>Digital Mark Sheets</h3>
            <p>Download hall tickets, results, and mark sheets. Quick and easy access for AP & TS.</p>
          </div>
          <div className="feature-card">
            <FiAward className="feature-icon" size={28} />
            <h3>Scholarships & Updates</h3>
            <p>Stay updated on scholarships, exam notifications, and important deadlines.</p>
          </div>
          <div className="feature-card">
            <FiStar className="feature-icon" size={28} />
            <h3>College Reviews</h3>
            <p>Read and share college reviews to choose the best fit for your goals.</p>
          </div>
          <div className="feature-card">
            <FiBook className="feature-icon" size={28} />
            <h3>Vital Information</h3>
            <p>One place for all essential academic information and support when you need it.</p>
          </div>
        </div>
      </section>

      <section className="section-dark plans-section">
        <h2 className="section-title">Simple, Affordable Plans</h2>
        <p className="section-desc">
          Start free. Upgrade when you need more. We believe quality guidance should be accessible.
        </p>
        <div className="plans-grid">
          <div className="plan-card">
            <h3>Free</h3>
            <p className="plan-price">₹0</p>
            <p>Access to documents, college predictor, and basic support. Perfect to get started.</p>
            <Link to="/register" className="btn-outline plan-btn">Get Started</Link>
          </div>
          <div className="plan-card featured">
            <span className="plan-badge">Popular</span>
            <h3>₹1 Plan</h3>
            <p className="plan-price">₹1</p>
            <p>Extended features and priority support for your college journey.</p>
            <Link to="/register" className="btn-create plan-btn">Choose Plan</Link>
          </div>
          <div className="plan-card">
            <h3>₹9 Plan</h3>
            <p className="plan-price">₹9</p>
            <p>Full access, premium support, and everything you need for exam success.</p>
            <Link to="/register" className="btn-outline plan-btn">Choose Plan</Link>
          </div>
        </div>
      </section>

      <section className="section-dark cta-section">
        <h2 className="section-title">Ready to Take the Next Step?</h2>
        <p className="section-desc">
          Join thousands of students making informed college and career choices with Telugu Info.
        </p>
        <div className="section-ctas">
          <Link to="/register" className="btn-create">Create Free Account</Link>
          <Link to="/login" className="btn-outline">Sign In</Link>
        </div>
      </section>
    </div>
  );
}
