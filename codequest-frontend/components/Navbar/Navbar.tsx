"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BASE_URL } from '@/utils/config';
import './Navbar.css';

const NavigationContent = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [registry, setRegistry] = useState<any[]>([]);
  const [dropdown, setDropdown] = useState(false);

  const path = usePathname();
  const query = useSearchParams();
  const activeLang = query.get('lang');

  useEffect(() => {
    setAccount(localStorage.getItem("user"));
    fetch(`${BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setRegistry(data));
  }, []);

  const onLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const checkActive = (route: string, lang?: string) => {
    if (lang) return activeLang === lang;
    return path === route;
  };

  return (
    <nav className='nav'>
      <Link href="/" className="nav-logo">
        <p>CODEQUEST</p>
      </Link>
      
      <ul className="nav-menu">
        <li>
          <Link href='/' className={checkActive('/') ? 'active-link' : ''}>Home</Link>
        </li>
        <li>
          <Link href='/about' className={checkActive('/about') ? 'active-link' : ''}>About</Link>
        </li>

        {account && (
          <li 
            className="nav-dropdown-container"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <span className={activeLang ? 'active-link' : 'nav-link'}>
              Languages ▾
            </span>
            
            {dropdown && (
              <ul className="nav-dropdown-menu">
                {registry.map((sub) => (
                  <li key={sub.id}>
                    <Link 
                      href={`/quiz?lang=${encodeURIComponent(sub.id)}`}
                      className={checkActive('/quiz', sub.id) ? 'drop-active' : ''}
                      onClick={() => setDropdown(false)}
                    >
                      {sub.id}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}

        {account === "admin@codequest.com" && (
          <li>
            <Link href='/admin' className={checkActive('/admin') ? 'active-link' : ''}>Admin Panel</Link>
          </li>
        )}
      </ul>

      <div className="nav-login-cart">
        {account ? (
          <button onClick={onLogout}>Sign Out</button>
        ) : (
          <Link href='/login'><button>Sign In</button></Link>
        )}
      </div>
    </nav>
  );
};

export default function Navbar() {
    return (
        <Suspense fallback={<div className="nav"></div>}>
            <NavigationContent />
        </Suspense>
    );
}