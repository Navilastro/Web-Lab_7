import { Outlet } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { NavBar } from './NavBar';

export function Layout() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app-wrapper ${theme}`}>
      <NavBar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Online Shop Assignment - Web Programming Fall 2026</p>
      </footer>
    </div>
  );
}