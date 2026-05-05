"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        const signRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (signRes?.error) {
          setError(signRes.error);
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        const data = await res.json();
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '0' }}>
      <div className="bento-item" style={{ maxWidth: '480px', width: '100%', padding: '4rem 3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="logo-dot" style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem', fontSize: '1.25rem' }}>T</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.06em' }}>JOIN TASKFLOW</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 600 }}>START YOUR JOURNEY</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '1rem', marginBottom: '2rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="lux-stat-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Full Name</label>
            <input 
              type="text" 
              className="lux-input" 
              placeholder="John Doe"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="lux-stat-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Email Address</label>
            <input 
              type="email" 
              className="lux-input" 
              placeholder="name@company.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="lux-stat-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Password</label>
            <input 
              type="password" 
              className="lux-input" 
              placeholder="Min. 6 characters"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
            />
          </div>
          <button type="submit" className="btn-lux btn-lux-primary" style={{ width: '100%', marginTop: '1rem', padding: '1.25rem', justifyContent: 'center' }}>
            CREATE ACCOUNT
          </button>
        </form>

        <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9375rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          ALREADY A MEMBER? <Link href="/login" style={{ color: 'var(--text-main)', fontWeight: 800, marginLeft: '0.5rem' }}>SIGN IN</Link>
        </p>
      </div>
    </div>
  );
}
