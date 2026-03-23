"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import animationData from "../public/coding.json";
import "./home.css";
import { BASE_URL } from "@/utils/config";

export default function HomePage() {
  const [user, setUser] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setUser(localStorage.getItem("user"));

    fetch(`${BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  return (
    <div className="hero">
      <div className="hero-left">
        <h2 style={{ color: "#ff4141", letterSpacing: "2px" }}>READY TO LEVEL UP?</h2>
        <p className="main-text">Daily 🚀</p>
        <p className="main-text">Quizzes</p>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', width: '200px' }}>
              <span style={{color: '#ff4141', fontSize: '12px', fontWeight: 'bold'}}>{cat.tag}</span>
              <h4 style={{margin: '5px 0'}}>{cat.title}</h4>
              <p style={{fontSize: '12px', color: '#94a3b8'}}>{cat.desc}</p>
              {user && (
                <Link href={`/quiz?lang=${cat.id}`} style={{color: '#ff4141', fontSize: '13px', fontWeight: 'bold', display: 'block', marginTop: '10px'}}>
                  Start Quiz →
                </Link>
              )}
            </div>
          ))}
        </div>

        {!user && (
          <Link href="/login" className="hero-latest-btn" style={{ background: '#4f46e5', marginTop: '40px' }}>
            Login to Start →
          </Link>
        )}
      </div>

      <div className="hero-right">
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <Lottie animationData={animationData} loop={true} />
        </div>
      </div>
    </div>
  );
}