import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="page-container">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn">
        Return to Home
      </Link>
    </div>
  );
}