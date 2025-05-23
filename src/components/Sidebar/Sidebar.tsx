'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <Link href="/" className={`${styles.sidebarItem} ${pathname === '/' ? styles.active : ''}`}>
          <div className={styles.icon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className={styles.label}>Главная</span>
        </Link>
        
        <Link href="/forecast" className={`${styles.sidebarItem} ${pathname === '/forecast' ? styles.active : ''}`}>
          <div className={styles.icon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"></path>
              <rect x="8" y="14" width="8" height="8" rx="2"></rect>
            </svg>
          </div>
          <span className={styles.label}>Прогноз</span>
        </Link>
        
        <Link href="/favorites" className={`${styles.sidebarItem} ${pathname === '/favorites' ? styles.active : ''}`}>
          <div className={styles.icon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <span className={styles.label}>Избранное</span>
        </Link>
      </div>
    </aside>
  );
}