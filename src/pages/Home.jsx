import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="page-container">
      <h1>Welcome to Our Online Shop</h1>
      <p>Browse our collection of products, filter by category, and manage your shopping cart.</p>
      <Link to="/products" className="btn">
        Explore Products
      </Link>
    </div>
  );
}