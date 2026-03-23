"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './browse.css';
import { BASE_URL } from '@/utils/config';

export default function AboutIndex() {
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setSubjects(data));
  }, []);

  return (
    <div className="browse-layout">
      <h1 className="browse-title">
        Tech <span className="highlight">Encyclopedia</span>
      </h1>
      <p className="browse-subtitle">Explore the core concepts behind modern software development.</p>

      <div className="subject-grid">
        {subjects.map((item) => (
          <div key={item.id} className="subject-card">
            <h3 className="subject-name">{item.id}</h3>
            <p className="subject-desc">{item.desc}</p>
            <Link href={`/about/${encodeURIComponent(item.id)}`} className="detail-link">
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}