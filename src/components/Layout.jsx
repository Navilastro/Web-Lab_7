import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../store/cartStore';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function Layout() {
  const { user, logoutUser } = useAuth();
  const totalCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app-wrapper ${theme}`}>
      <header className="navbar">
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Cart ({totalCount})
          </NavLink>
        </nav>

        <div className="nav-actions">
          <button type="button" onClick={toggleTheme} className="btn">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>

          {user ? (
            <div className="user-box">
              <span>{user.username}</span>
              <button type="button" onClick={logoutUser} className="btn">
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active-link' : '')}>
              Login
            </NavLink>
          )}
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>Online Shop Assignment - Web Programming Fall 2026</p>
      </footer>
    </div>
  );
}