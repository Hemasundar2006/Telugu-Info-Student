import { Link } from 'react-router-dom';
import './PublicPages.css';

export default function Contact() {
  return (
    <div className="public-page">
      <section className="public-section">
        <h1 className="public-title">Contact</h1>
        <p className="public-desc">
          Have questions? Reach out to us. After registering, you can create support tickets for any help. We are here to support your career journey.
        </p>
        <div className="public-ctas">
          <Link to="/register" className="btn-create">Create Account</Link>
          <Link to="/login" className="btn-outline">Sign In</Link>
        </div>
      </section>
    </div>
  );
}
