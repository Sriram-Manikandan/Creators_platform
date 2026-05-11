import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-brand">✍️ BlogHub</p>
        <p className="footer-copy">
          © {new Date().getFullYear()} BlogHub. Built with React & Node.js.
        </p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;