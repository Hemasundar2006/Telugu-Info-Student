import { Link } from 'react-router-dom';
import './PublicPages.css';

export default function About() {
  return (
    <div className="public-page">
      <section className="public-section">
        <h1 className="public-title">About Telugu Info</h1>
        <p className="public-desc">
          Telugu Info is an educational platform built for students in <strong>Andhra Pradesh and Telangana</strong>. Our goal is to help you make informed decisions about your future—whether you’re in school, choosing a stream, picking a college, or planning your career.
        </p>
        <p className="public-desc">
          We combine <strong>AI-driven career guidance and roadmaps</strong> with practical tools: digital mark sheet downloads, scholarship information, and college reviews. Everything you need to choose the right college and course is in one place.
        </p>
        <p className="public-desc">
          We believe quality guidance should be accessible to every student. That’s why we offer a <strong>freemium model</strong>—start free, and upgrade to our ₹1 or ₹9 plans when you need more support. No heavy fees, no barriers.
        </p>
        <h2 className="public-subtitle">Our Mission</h2>
        <p className="public-desc">
          To empower students with the information and tools they need to navigate their academic journey with confidence—from mark sheets and hall tickets to college prediction and career roadmaps.
        </p>
        <div className="public-ctas">
          <Link to="/services" className="btn-create">See Our Services</Link>
          <Link to="/contact" className="btn-outline">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
