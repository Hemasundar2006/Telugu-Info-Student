import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiBook, FiFileText, FiAward, FiStar, FiTrendingUp, FiBriefcase, FiUsers, FiZap } from 'react-icons/fi';
import { ScrollRevealGroup } from '../components/ScrollReveal';
import './Landing.css';

export default function Landing() {
  const [audience, setAudience] = useState('students'); // 'students' | 'recruiters'

  return (
    <div className="landing-page animate-page-fade-in">
      <section className="hero hero-with-video">
        <div className="landing-video-bg" aria-hidden="true">
          <video
            src="/background video.mp4"
            autoPlay
            muted
            loop
            playsInline
            title=""
          />
          <div className="landing-video-overlay" />
        </div>
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-audience-toggle" role="tablist" aria-label="Audience">
              <button
                type="button"
                role="tab"
                aria-selected={audience === 'students'}
                className={`hero-toggle-btn ${audience === 'students' ? 'active' : ''}`}
                onClick={() => setAudience('students')}
              >
                For Students
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={audience === 'recruiters'}
                className={`hero-toggle-btn ${audience === 'recruiters' ? 'active' : ''}`}
                onClick={() => setAudience('recruiters')}
              >
                For Recruiters
              </button>
            </div>
            {audience === 'students' ? (
              <>
                <p className="trust-badge animate-hero-title">
                  <span className="star" aria-hidden>★</span> For Andhra Pradesh & Telangana Students
                </p>
                <h1 className="hero-title animate-hero-title">
                  Your <span className="highlight">College & Career</span> Journey, Simplified
                </h1>
                <p className="hero-subtitle animate-hero-subtitle">
                  AI-driven career guidance, roadmaps, digital mark sheets, scholarships, and college reviews—all in one place. For students at every stage. Make informed decisions for your future.
                </p>
                <div className="hero-ctas">
                  <Link to="/register" className="btn-explore animate-btn animate-hero-cta">Get Started Free</Link>
                  <Link to="/services" className="btn-whatsapp animate-btn animate-hero-cta">Explore Services</Link>
                </div>
              </>
            ) : (
              <>
                <p className="trust-badge animate-hero-title">
                  <span className="star" aria-hidden>★</span> Hire from AP & Telangana Talent
                </p>
                <h1 className="hero-title animate-hero-title">
                  <span className="highlight">Post Jobs</span> & Reach Students Directly
                </h1>
                <p className="hero-subtitle animate-hero-subtitle">
                  One job board for Andhra Pradesh & Telangana students. Post roles, get applications, and notify qualified candidates—with plans from 1 free job to unlimited posts.
                </p>
                <div className="hero-ctas">
                  <Link to="/register" className="btn-explore animate-btn animate-hero-cta">Register as Recruiter</Link>
                  <Link to="/pricing" className="btn-whatsapp animate-btn animate-hero-cta">View Pricing</Link>
                </div>
              </>
            )}
          </div>
          <div className="hero-visual animate-hero-visual" aria-hidden>
            <div className="hero-visual-inner">
              {audience === 'students' ? (
                <img src="/student logo.jpeg" alt="" className="hero-visual-img" />
              ) : (
                <img src="/yellowish 💛.jpeg" alt="" className="hero-visual-img" />
              )}
            </div>
          </div>
        </div>
      </section>

      {audience === 'students' && (
        <section className="section-dark features-section">
          <h2 className="section-title">Everything You Need as a Student</h2>
          <p className="section-desc">
            One platform for career guidance, documents, and college decisions—at every stage of your journey.
          </p>
          <ScrollRevealGroup className="feature-grid">
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-1">
              <FiTarget className="feature-icon" size={28} aria-hidden />
              <h3>AI Career Guidance & Roadmaps</h3>
              <p>Personalised roadmaps and AI-driven guidance to choose the right stream, course, and career path.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-2">
              <FiTrendingUp className="feature-icon" size={28} aria-hidden />
              <h3>College & Course Finder</h3>
              <p>Explore colleges and courses by rank, category, and location. Make informed choices.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-3">
              <FiFileText className="feature-icon" size={28} aria-hidden />
              <h3>Digital Mark Sheets</h3>
              <p>Download hall tickets, results, and mark sheets. Quick and easy access for AP & TS.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-4">
              <FiAward className="feature-icon" size={28} aria-hidden />
              <h3>Scholarships & Updates</h3>
              <p>Stay updated on scholarships, exam notifications, and important deadlines.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-5">
              <FiStar className="feature-icon" size={28} aria-hidden />
              <h3>College Reviews</h3>
              <p>Read and share college reviews to choose the best fit for your goals.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-6">
              <FiBook className="feature-icon" size={28} aria-hidden />
              <h3>Vital Information</h3>
              <p>One place for all essential academic information and support when you need it.</p>
            </div>
          </ScrollRevealGroup>
        </section>
      )}

      {audience === 'recruiters' && (
        <section className="section-dark features-section">
          <h2 className="section-title">Why Recruit with Telugu Info</h2>
          <p className="section-desc">
            Reach students and graduates across AP & Telangana with targeted job posts and instant notifications.
          </p>
          <ScrollRevealGroup className="feature-grid">
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-1">
              <FiBriefcase className="feature-icon" size={28} aria-hidden />
              <h3>Post Jobs in Minutes</h3>
              <p>Create job listings with qualification filters. Students matching your criteria get notified automatically.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-2">
              <FiUsers className="feature-icon" size={28} aria-hidden />
              <h3>Reach Qualified Candidates</h3>
              <p>Target by stream, qualification, and location. Your posts appear in student dashboards and notification feeds.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-3">
              <FiZap className="feature-icon" size={28} aria-hidden />
              <h3>Instant Notifications</h3>
              <p>When you publish a job, eligible students are notified so you get applications faster.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-4">
              <FiTarget className="feature-icon" size={28} aria-hidden />
              <h3>Simple Dashboard</h3>
              <p>Manage job posts, view applications, and close roles—all from one place.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-5">
              <FiAward className="feature-icon" size={28} aria-hidden />
              <h3>Plans for Every Size</h3>
              <p>Start with 1 free job post. Scale to limited or unlimited posts with Pro and Premium.</p>
            </div>
            <div className="feature-card animate-on-scroll animate-card animate-on-scroll-delay-6">
              <FiStar className="feature-icon" size={28} aria-hidden />
              <h3>Trusted by Students</h3>
              <p>Telugu Info is the go-to platform for AP & TS students. Be where they already are.</p>
            </div>
          </ScrollRevealGroup>
        </section>
      )}

      {audience === 'students' && (
        <section className="section-dark plans-section">
          <h2 className="section-title">Simple, Affordable Plans</h2>
          <p className="section-desc">
            Start free. Upgrade when you need more. We believe quality guidance should be accessible.
          </p>
          <ScrollRevealGroup className="plans-grid">
            <div className="plan-card animate-on-scroll animate-card animate-on-scroll-delay-1">
              <h3>Free</h3>
              <p className="plan-price">₹0</p>
              <p>Access to documents, college predictor, and basic support. Perfect to get started.</p>
              <Link to="/register" className="btn-outline plan-btn animate-btn">Get Started</Link>
            </div>
            <div className="plan-card featured animate-on-scroll animate-card animate-on-scroll-delay-2">
              <span className="plan-badge">Popular</span>
              <h3>₹1 Plan</h3>
              <p className="plan-price">₹1</p>
              <p>Extended features and priority support for your college journey.</p>
              <Link to="/register" className="btn-create plan-btn animate-btn">Choose Plan</Link>
            </div>
            <div className="plan-card animate-on-scroll animate-card animate-on-scroll-delay-3">
              <h3>₹9 Plan</h3>
              <p className="plan-price">₹9</p>
              <p>Full access, premium support, and everything you need for exam success.</p>
              <Link to="/register" className="btn-outline plan-btn animate-btn">Choose Plan</Link>
            </div>
          </ScrollRevealGroup>
        </section>
      )}

      {audience === 'recruiters' && (
        <section className="section-dark plans-section">
          <h2 className="section-title">Recruiter Plans</h2>
          <p className="section-desc">
            Start with 1 free job post. Upgrade for more reach and unlimited posts.
          </p>
          <ScrollRevealGroup className="plans-grid">
            <div className="plan-card animate-on-scroll animate-card animate-on-scroll-delay-1">
              <h3>Free</h3>
              <p className="plan-price">₹0</p>
              <p>1 job post only. Student notifications and basic dashboard. Perfect to try.</p>
              <Link to="/register" className="btn-outline plan-btn animate-btn">Get Started</Link>
            </div>
            <div className="plan-card featured animate-on-scroll animate-card animate-on-scroll-delay-2">
              <span className="plan-badge">Popular</span>
              <h3>Pro</h3>
              <p className="plan-price">₹9</p>
              <p>Limited job posts (5 active). Priority notifications and extended visibility.</p>
              <Link to="/register" className="btn-create plan-btn animate-btn">Choose Pro</Link>
            </div>
            <div className="plan-card animate-on-scroll animate-card animate-on-scroll-delay-3">
              <h3>Premium</h3>
              <p className="plan-price">₹49 – ₹99</p>
              <p>Unlimited job posts. Featured listings and dedicated support.</p>
              <Link to="/pricing" className="btn-outline plan-btn animate-btn">View Pricing</Link>
            </div>
          </ScrollRevealGroup>
        </section>
      )}

      <section className="section-dark cta-section">
        <h2 className="section-title">Ready to Take the Next Step?</h2>
        <p className="section-desc">
          {audience === 'students'
            ? 'Join thousands of students making informed college and career choices with Telugu Info.'
            : 'Join recruiters reaching AP & Telangana students. Create your company account and post your first job.'}
        </p>
        <div className="section-ctas">
          <Link to="/register" className="btn-create animate-btn">{audience === 'students' ? 'Create Free Account' : 'Register as Recruiter'}</Link>
          <Link to="/login" className="btn-outline animate-btn">Sign In</Link>
        </div>
      </section>
    </div>
  );
}
