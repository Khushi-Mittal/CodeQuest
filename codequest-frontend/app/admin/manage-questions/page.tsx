"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../admin.css';

export default function ManageQuestions() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [active, setActive] = useState("");
  const [dataPool, setDataPool] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/categories")
      .then(res => res.json())
      .then(data => setCatalog(data));
  }, []);

  const onFilter = async (lang: string) => {
    setActive(lang);
    if (!lang) return setDataPool([]);
    const res = await fetch(`http://localhost:8000/quiz/${encodeURIComponent(lang)}`);
    const list = await res.json();
    setDataPool(list);
  };

  const onRemove = async (id: string) => {
    if (!confirm("Remove this question permanently?")) return;
    const res = await fetch(`http://localhost:8000/admin/delete-question/${id}`, { method: 'DELETE' });
    if (res.ok) onFilter(active);
  };

  return (
    <div className="admin-container" style={{maxWidth: '900px'}}>
      <button onClick={() => router.push('/admin')} className="back-btn">← Back to Dashboard</button>
      <h1 className="admin-title">Manage Questions</h1>
      
      <div className="admin-form" style={{marginBottom: '40px'}}>
        <select style={{width: '100%', padding: '15px', background: '#1e293b', color: 'white', borderRadius: '12px'}} onChange={(e) => onFilter(e.target.value)}>
          <option value="">-- Select Language to Manage --</option>
          {catalog.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
        </select>
      </div>

      <div className="hub-list">
        {dataPool.map((item, i) => (
          <div key={item.id} className="item-row" style={{padding: '20px'}}>
            <div style={{flex: 1}}>
              <span style={{color: '#ff4141', fontWeight: 'bold', marginRight: '10px'}}>Q{i + 1}</span>
              <p style={{display: 'inline', color: '#f8fafc'}}>{item.question}</p>
            </div>
            
            <div style={{display: 'flex', gap: '10px'}}>
              <Link href={`/admin/edit-single-question/${item.id}?lang=${encodeURIComponent(active)}`} className="btn-edit">Modify</Link>
              <button onClick={() => onRemove(item.id)} className="btn-delete" style={{padding: '8px 15px'}}>Wipe</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}