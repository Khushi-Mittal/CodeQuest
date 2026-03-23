"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './admin.css';

export default function AdminDashboard() {
  const [items, setItems] = useState<any[]>([]);

  const pull = () => {
    fetch("http://localhost:8000/categories")
      .then(res => res.json())
      .then(data => setItems(data));
  };

  useEffect(() => { pull(); }, []);

  const onWipe = async (slug: string) => {
    if (!confirm(`Permanently remove ${slug}?`)) return;
    const res = await fetch(`http://localhost:8000/admin/delete-category/${encodeURIComponent(slug)}`, { method: 'DELETE' });
    if (res.ok) pull();
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      
      <div className="admin-grid">
        <Link href="/admin/add-category" className="admin-card">
          <div className="admin-card-icon">📁</div>
          <h3>Add Language</h3>
        </Link>

        <Link href="/admin/add-question" className="admin-card">
          <div className="admin-card-icon">📝</div>
          <h3>Add Questions</h3>
        </Link>

        <Link href="/admin/manage-questions" className="admin-card">
          <div className="admin-card-icon">⚙️</div>
          <h3>Manage Questions</h3>
        </Link>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h2 style={{ borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '30px' }}>
          Manage Existing Languages
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {items.map((cat) => (
            <div key={cat.id} className="item-row">
              <div>
                <h4 style={{ margin: 0, fontSize: '18px' }}>{cat.title} ({cat.id})</h4>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>{cat.tag}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/admin/edit-lang/${encodeURIComponent(cat.id)}`} className="btn-edit">
                  Edit Info
                </Link>
                <button onClick={() => onWipe(cat.id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}