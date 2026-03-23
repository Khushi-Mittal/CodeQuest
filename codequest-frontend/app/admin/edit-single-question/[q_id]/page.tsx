"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import '../../admin.css';

export default function EditSingleQuestion() {
  const { q_id } = useParams();
  const search = useSearchParams();
  const lang = search.get('lang');
  const router = useRouter();
  const [state, setState] = useState({ language: lang || '', question: '', options: ['', '', '', ''], answer: '' });

  useEffect(() => {
    if (!lang) return;
    fetch(`http://localhost:8000/quiz/${encodeURIComponent(lang)}`)
      .then(res => res.json())
      .then(pool => {
        const item = pool.find((q: any) => q.id === q_id);
        if (item) setState({ ...item, language: lang });
      });
  }, [q_id, lang]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:8000/admin/edit-question/${q_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
    router.back();
  };

  return (
    <div className="admin-form-container">
      {/* ADDED BACK BUTTON */}
      <button onClick={() => router.back()} className="back-btn">← Back</button>
      <h2>Edit Question</h2>
      <form onSubmit={onSave} className="admin-form">
        <textarea value={state.question} onChange={e => setState({...state, question: e.target.value})} placeholder="Question Statement" required />
        {state.options.map((val, i) => (
          <input key={i} value={val} onChange={e => {
            let next = [...state.options]; next[i] = e.target.value; setState({...state, options: next});
          }} placeholder={`Option ${i+1}`} required />
        ))}
        <input value={state.answer} style={{borderColor: '#22c55e'}} onChange={e => setState({...state, answer: e.target.value})} placeholder="Correct Answer" required />
        <button type="submit" className="admin-submit-btn">Update Unit</button>
      </form>
    </div>
  );
}