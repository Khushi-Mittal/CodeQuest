"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import './details.css';

export default function LanguageDetail() {
  const params = useParams();
  const langId = params.lang ? decodeURIComponent(params.lang as string) : "";
  const router = useRouter();
  const [data, setData] = useState({ language: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!langId) return;
    setLoading(true);
    fetch(`http://localhost:8000/about/${encodeURIComponent(langId)}`)
      .then(res => res.json())
      .then(info => {
        setData(info);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [langId]);

  if (loading) return <div className="loading-state">Syncing Documentation...</div>;

  return (
    <div className="wiki-container">
      <button onClick={() => router.back()} className="back-link">
        ← Return to Library
      </button>

      <div className="doc-card">
        <h1 className="doc-title">
          About <span className="highlight">{langId}</span>
        </h1>
        
        <p className="doc-body">
          {data.description || "Detailed documentation is currently unavailable."}
        </p>

        <div className="quiz-prompt">
          <h4 className="prompt-text">Think you know {langId}?</h4>
          <Link href={`/quiz?lang=${encodeURIComponent(langId)}`} className="launch-btn">
            Start Assessment →
          </Link>
        </div>
      </div>
    </div>
  );
}