import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <main className="notfound">
      <h1 className="notfound-code">404</h1>
      <p className="notfound-title">Page Not Found</p>
      <p className="notfound-sub">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="notfound-btn">
        ← Back to Home
      </Link>
    </main>
  );
}

export default NotFound;