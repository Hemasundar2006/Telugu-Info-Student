import { Link } from 'react-router-dom';
import './PublicPages.css';

export default function Pricing() {
  return (
    <div className="public-page">
      <section className="public-section">
        <h1 className="public-title">Pricing</h1>
        <p className="public-desc">
          Choose a plan that works for you. We offer free access to essential resources and affordable premium plans for in-depth guidance and support.
        </p>
        <div className="public-cards">
          <div className="public-card">
            <h3>Free</h3>
            <p>Access to approved documents, college predictor, and support tickets.</p>
            <Link to="/register" className="btn-outline">Get Started Free</Link>
          </div>
          <div className="public-card">
            <h3>₹1 Plan</h3>
            <p>Extended features and priority support.</p>
            <Link to="/register" className="btn-create">Learn More</Link>
          </div>
          <div className="public-card">
            <h3>₹9 Plan</h3>
            <p>Full access and premium support for your journey.</p>
            <Link to="/register" className="btn-create">Learn More</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
