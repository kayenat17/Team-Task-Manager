import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="page-content" style={{ textAlign: 'left' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
        <div>
          <h1 className="lux-title" style={{ fontSize: '12rem', letterSpacing: '-0.08em', marginBottom: '1rem' }}>
            FOCUS
          </h1>
          <h1 className="lux-title" style={{ fontSize: '8rem', letterSpacing: '-0.06em', textAlign: 'right', marginTop: '-2rem' }}>
            YOUR TIME
          </h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', maxWidth: '500px', marginTop: '2rem', fontWeight: 500, lineHeight: 1.2 }}>
            Track your most important tasks as they are intelligently prioritized and scheduled by our system.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
            <Link href="/register" className="btn-lux btn-lux-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Get Started
            </Link>
            <Link href="/login" className="btn-lux btn-lux-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              How It Works
            </Link>
          </div>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div className="bento-item" style={{ padding: '3rem', background: 'var(--primary)', color: 'white', transform: 'rotate(2deg)', zIndex: 1 }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚡️</div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Today's Tasks</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.9 }}>To-do list for today is ready to be executed.</p>
          </div>
          <div className="bento-item" style={{ padding: '2rem', marginTop: '-2rem', marginLeft: '-2rem', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <h4 style={{ fontWeight: 800 }}>Mobile App Design</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>4 Hours Per Task • In Progress</p>
          </div>
        </div>
      </div>

      <div className="bento-grid">
        <div className="bento-item" style={{ gridColumn: 'span 2' }}>
          <h3 className="widget-title">Smart Scheduling</h3>
          <p style={{ color: 'var(--text-muted)' }}>Our AI-driven system organizes your day based on your energy levels and priority.</p>
        </div>
        <div className="bento-item">
          <div className="lux-stat-val">24/7</div>
          <p className="lux-stat-label">Support</p>
        </div>
        <div className="bento-item">
          <div className="lux-stat-val">10x</div>
          <p className="lux-stat-label">Efficiency</p>
        </div>
      </div>
    </main>
  );
}
