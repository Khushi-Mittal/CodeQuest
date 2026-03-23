"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../admin.css';
import { BASE_URL } from '@/utils/config';

export default function AddMultipleQuestions() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<any[]>([]);
  const [selection, setSelection] = useState('');
  const [payload, setPayload] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);

  useEffect(() => {
    fetch(`${BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCatalog(Array.isArray(data) ? data : []));
  }, []);

  const addSlot = () => setPayload([...payload, { question: '', options: ['', '', '', ''], answer: '' }]);
  const popSlot = (i: number) => setPayload(payload.filter((_, idx) => idx !== i));

  const updateRoot = (i: number, key: string, val: string) => {
    const next = [...payload];
    next[i] = { ...next[i], [key]: val };
    setPayload(next);
  };

  const updateChoice = (i: number, oi: number, val: string) => {
    const next = [...payload];
    const choices = [...next[i].options];
    choices[oi] = val;
    next[i].options = choices;
    setPayload(next);
  };

  const onFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection) return alert("Please select a language.");

    for (const q of payload) {
      await fetch(`${BASE_URL}/admin/add-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selection, ...q })
      });
    }
    router.push("/admin");
  };

  return (
    <div className="admin-form-container wide-view">
      <button onClick={() => router.back()} className="back-btn">← Back</button>
      <h2 style={{marginBottom: '20px'}}>Add Multiple Questions</h2>
      
      <div style={{marginBottom: '30px'}}>
        <select className="admin-select" style={{width: '100%', padding: '15px', background: '#0f172a', color: 'white', borderRadius: '12px'}} onChange={e => setSelection(e.target.value)} value={selection} required>
          <option value="">-- Select Language Category --</option>
          {catalog.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <form onSubmit={onFinalize} className="admin-form">
        {payload.map((item, i) => (
          <div key={i} className="entry-card">
            <div className="card-header">
                <h4 style={{color: '#ff4141'}}>Question #{i + 1}</h4>
                {payload.length > 1 && <button type="button" onClick={() => popSlot(i)} className="remove-btn">Remove 🗑️</button>}
            </div>
            <textarea placeholder="The Question Text" value={item.question} onChange={e => updateRoot(i, 'question', e.target.value)} required />
            <div className="grid-options">
                {item.options.map((o, oi) => (
                    <input key={oi} placeholder={`Option ${oi+1}`} value={o} onChange={e => updateChoice(i, oi, e.target.value)} required />
                ))}
            </div>
            <input className="valid-answer" placeholder="Correct Answer (Must match an option exactly)" value={item.answer} onChange={e => updateRoot(i, 'answer', e.target.value)} required />
          </div>
        ))}
        <div className="action-bar">
            <button type="button" onClick={addSlot} className="secondary-btn">+ Add One More</button>
            <button type="submit" className="admin-submit-btn no-margin">Publish All Questions</button>
        </div>
      </form>
    </div>
  );
}