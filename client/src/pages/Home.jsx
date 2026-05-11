import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: '📝',
    title: 'Easy Publishing',
    desc: 'Write and publish your articles in minutes with our simple editor.',
  },
  {
    icon: '👥',
    title: 'Build Your Audience',
    desc: 'Grow your follower base and connect with readers who love your content.',
  },
  {
    icon: '📊',
    title: 'Track Performance',
    desc: 'See how your posts perform with built-in analytics and insights.',
  },
];

function Home() {
  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title">
          Share Your Stories <br />
          <span className="hero-accent">with the World</span>
        </h1>
        <p className="hero-sub">
          BlogHub is a platform for writers to publish, connect, and grow their
          audience — all in one place.
        </p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary">
            Get Started Free
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="section-title">Why BlogHub?</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;