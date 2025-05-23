import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <Link href="/" className="navbar-brand">
              Погодное приложение
            </Link>
            
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link 
                    href="/" 
                    className={`nav-link ${pathname === '/' ? 'active' : ''}`}
                  >
                    Главная
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    href="/favorites" 
                    className={`nav-link ${pathname === '/favorites' ? 'active' : ''}`}
                  >
                    Избранное
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      
      <main className={styles.main}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <div className="container">
          <div className="text-center py-3">
            <p>© 2023 Погодное приложение | Данные предоставлены OpenWeatherMap</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;