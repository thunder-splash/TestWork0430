import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const pathname = usePathname();
  
  return (
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
                  href="/forecast" 
                  className={`nav-link ${pathname === '/forecast' ? 'active' : ''}`}
                >
                  Прогноз
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
  );
};

export default Header;