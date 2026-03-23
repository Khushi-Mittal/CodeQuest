"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../admin.css';

export default function AddCategory() {
  const router = useRouter();
  const [form, setForm] = useState({ id: '', title: '', tag: 'NEW', desc: '', aboutText: '' });

  const onPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/admin/add-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) router.push("/");
  };

  return (
    <div className="admin-form-container">
      <button onClick={() => router.back()} className="back-btn">← Cancel</button>
      <h2>Register Subject</h2>
      <form onSubmit={onPublish} className="admin-form">
        <input placeholder="Unique ID (e.g. Python)" onChange={e => setForm({...form, id: e.target.value})} required />
        <input placeholder="Full Title" onChange={e => setForm({...form, title: e.target.value})} required />
        <input placeholder="Label Tag" onChange={e => setForm({...form, tag: e.target.value})} />
        <input placeholder="Short Summary" onChange={e => setForm({...form, desc: e.target.value})} required />
        <textarea placeholder="Main Documentation Body" rows={5} onChange={e => setForm({...form, aboutText: e.target.value})} required />
        <button type="submit" className="admin-submit-btn">Commit Changes</button>
      </form>
    </div>
  );
}