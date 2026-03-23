"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../../admin.css';
import { BASE_URL } from '@/utils/config';

export default function EditLanguagePage() {
  const params = useParams();
  const id = params.id ? decodeURIComponent(params.id as string) : "";
  const router = useRouter();
  const [data, setData] = useState({ id: '', title: '', tag: '', desc: '', aboutText: '' });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!id) return;
    const sync = async () => {
      const [listRes, docRes] = await Promise.all([
        fetch(`${BASE_URL}/categories`),
        fetch(`${BASE_URL}/about/${encodeURIComponent(id)}`)
      ]);
      const list = await listRes.json();
      const doc = await docRes.json();
      const match = list.find((c: any) => c.id === id);
      if (match) setData({ ...match, aboutText: doc.description || "" });
      setReady(true);
    };
    sync();
  }, [id]);

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${BASE_URL}/admin/edit-category/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    router.push("/admin");
  };

  if (!ready) return <div className="sync-text">Fetching Records...</div>;

  return (
    <div className="admin-form-container">
      <button onClick={() => router.back()} className="back-btn">← Cancel</button>
      <h2>Modify Subject: {id}</h2>
      <form onSubmit={onUpdate} className="admin-form">
        <input value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="Title" required />
        <input value={data.tag} onChange={e => setData({...data, tag: e.target.value})} placeholder="Label Tag" />
        <input value={data.desc} onChange={e => setData({...data, desc: e.target.value})} placeholder="Dashboard Summary" required />
        <textarea value={data.aboutText} onChange={e => setData({...data, aboutText: e.target.value})} placeholder="Full Wiki Content" rows={8} required />
        <button type="submit" className="admin-submit-btn">Apply Updates</button>
      </form>
    </div>
  );
}