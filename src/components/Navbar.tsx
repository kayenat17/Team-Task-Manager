"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="nav-bar">
      <Link href="/" className="nav-logo">
        <div className="logo-dot"></div>
        TaskFlow
      </Link>
      <div className="nav-links">
        {session ? (
          <>
            <Link href="/dashboard" className="nav-link">Home</Link>
            <Link href="/projects" className="nav-link">Projects</Link>
            <button 
              onClick={() => signOut()} 
              className="btn-lux btn-lux-outline"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link">Sign In</Link>
            <Link href="/register" className="btn-lux btn-lux-primary" style={{ padding: '0.625rem 1.25rem' }}>Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
}
