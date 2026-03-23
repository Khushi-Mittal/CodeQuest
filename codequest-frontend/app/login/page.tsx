"use client";
import { useState } from "react";
import Link from "next/link";
import { BASE_URL } from "@/utils/config";
import "./login.css";

export default function LoginPage() {
  const [creds, setCreds] = useState({ email: "", password: "" });

  const onAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds)
      });

      if (res.ok) {
        localStorage.setItem("user", creds.email);
        window.location.href = "/"; 
      } else {
        alert("Access Denied: Invalid Credentials");
      }
    } catch (error) {
      alert("Connectivity Error: Backend unreachable");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <h1 className="auth-title">Login</h1>
        <p className="auth-hint">Welcome back! Please enter your details.</p>
        
        <form onSubmit={onAuth} className="auth-fields">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={creds.email}
            onChange={(e) => setCreds({...creds, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={creds.password}
            onChange={(e) => setCreds({...creds, password: e.target.value})} 
            required 
          />
          <button type="submit" className="auth-btn">Login</button>
        </form>
        
        <p className="auth-switch">
          New here? <Link href="/signup">Create account</Link>
        </p>
      </div>
    </div>
  );
}