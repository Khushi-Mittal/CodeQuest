"use client";
import React from 'react';
import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrap">
      <Link href="/" className="footer-brand">
        <p>CODEQUEST</p>
      </Link>

      <ul className="footer-nav">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="footer-bottom">
        <hr className="footer-line" />
        <p className="copyright-text">© 2026 CodeQuest Engineering. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;