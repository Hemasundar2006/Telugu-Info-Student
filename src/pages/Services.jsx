import { Link } from 'react-router-dom';
import { FiTarget, FiTrendingUp, FiFileText, FiAward, FiStar, FiHelpCircle } from 'react-icons/fi';
import './PublicPages.css';

const services = [
  {
    href: '/ai-career',
    icon: FiTarget,
    title: 'AI Career Guidance & Roadmaps',
    desc: 'Personalised, AI-driven guidance and roadmaps to help you choose the right stream, course, and career direction at any stage.',
  },
  {
    icon: FiTrendingUp,
    title: 'College & Course Finder',
    desc: 'Explore colleges and courses by rank, category, and location. Our college predictor helps you find the best options for your scores and goals.',
  },
  {
    icon: FiFileText,
    title: 'Digital Mark Sheet Downloads',
    desc: 'Quick access to hall tickets, results, and mark sheets for Andhra Pradesh and Telangana. Download what you need, when you need it.',
  },
  {
    icon: FiAward,
    title: 'Scholarships & Updates',
    desc: 'Stay updated on scholarships, government and private exam notifications, and important deadlines so you never miss an opportunity.',
  },
  {
    icon: FiStar,
    title: 'College Reviews',
    desc: 'Read and share honest college reviews to compare campuses, faculty, and placements before you decide.',
  },
  {
    icon: FiHelpCircle,
    title: 'Dedicated Support',
    desc: 'Create support tickets and get help from our team whenever you have questions about documents, college choices, or your account.',
  },
];

export default function Services() {
  return (
    <div className="public-page">
      <section className="public-section">
        <h1 className="public-title">Our Services</h1>
        <p className="public-desc">
          Everything you need—career guidance, documents, scholarships, and college reviews—for students at every stage, delivered through a simple freemium model.
        </p>
        <div className="services-grid">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="service-card">
              <Icon className="service-icon" size={26} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <h2 className="public-subtitle">Plans</h2>
        <p className="public-desc">
          <strong>Free</strong>—Get started with documents, college predictor, and basic support. <strong>₹1 Plan</strong>—Extended features and priority support. <strong>₹9 Plan</strong>—Full access and premium support for your entire journey.
        </p>
        <div className="public-ctas">
          <Link to="/register" className="btn-create">Create Free Account</Link>
          <Link to="/pricing" className="btn-outline">View Pricing</Link>
        </div>
      </section>
    </div>
  );
}
