"use client";
import { useState } from "react";
import Link from "next/link";
import { BASE_URL } from "@/utils/config";
import "./signup.css";

export default function SignupPage() {
  const [fields, setFields] = useState({ email: "", password: "" });

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields)
    });

    if (res.ok) {
      alert("Account Created Successfully");
      window.location.href = "/login";
    } else {
      alert("Registration failed: Try a different email.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <h1 className="auth-title">Join Us</h1>
        <p className="auth-hint">Start your coding journey with a free account.</p>
        
        <form onSubmit={onRegister} className="auth-fields">
          <input 
            type="email" 
            placeholder="Choose Email" 
            value={fields.email}
            onChange={(e) => setFields({...fields, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Strong Password" 
            value={fields.password}
            onChange={(e) => setFields({...fields, password: e.target.value})} 
            required 
          />
          <button type="submit" className="auth-btn">Create Account</button>
        </form>
        
        <p className="auth-switch">
          Already registered? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}