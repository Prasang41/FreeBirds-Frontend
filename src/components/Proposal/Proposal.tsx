// Proposal.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

// ─── Types matching your Spring Boot DTOs ─────────────────────────────────────
interface UserData {
  id: number
  role: 'FREELANCER' | 'CLIENT'
  freelancerId?: number   // ← adjust field name to match your UserDTO
  clientId?: number       // ← adjust field name to match your UserDTO
}

interface Proposal {
  id: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  coverLetter?: string
  bidAmount?: number
  jobId?: number
  jobTitle?: string
  createdAt?: string
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .p-root {
    min-height: 100vh;
    background: #f0f2f5;
    padding: 2rem 1rem;
    font-family: 'DM Sans', sans-serif;
  }

  /* center states */
  .p-state {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px; min-height: 65vh; text-align: center;
  }
  .p-state__icon { font-size: 2.8rem; }
  .p-state__title { font-size: 1.5rem; font-weight: 600; color: #111827; }
  .p-state__sub { color: #6b7280; font-size: 0.9rem; max-width: 320px; line-height: 1.6; }

  /* spinner */
  .p-spin {
    width: 40px; height: 40px;
    border: 3px solid #e5e7eb;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* error */
  .p-err-box {
    background: #fef2f2; border: 1px solid #fecaca;
    color: #dc2626; padding: 10px 16px;
    border-radius: 8px; font-size: 0.85rem; max-width: 400px;
  }
  .p-retry {
    background: #4f46e5; color: #fff; border: none;
    border-radius: 8px; padding: 8px 20px;
    font-size: 0.875rem; font-weight: 600;
    cursor: pointer; transition: background 0.15s;
  }
  .p-retry:hover { background: #4338ca; }

  /* debug box */
  .p-debug {
    background: #1e293b; color: #94a3b8;
    font-family: monospace; font-size: 0.75rem;
    border-radius: 8px; padding: 12px 16px;
    max-width: 600px; margin: 0 auto 1.5rem;
    white-space: pre-wrap; word-break: break-all;
  }

  /* layout */
  .p-wrap { max-width: 860px; margin: 0 auto; }
  .p-header {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 1.25rem;
  }
  .p-header h2 { font-size: 1.35rem; font-weight: 600; color: #111827; }
  .p-role {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; padding: 3px 10px; border-radius: 999px;
  }
  .p-role--FREELANCER { background: #ede9fe; color: #6d28d9; }
  .p-role--CLIENT     { background: #dbeafe; color: #1d4ed8; }
  .p-count {
    background: #fff; border: 1px solid #e5e7eb;
    color: #374151; font-size: 0.8rem; font-weight: 500;
    padding: 3px 12px; border-radius: 999px;
  }

  /* cards */
  .p-list { display: flex; flex-direction: column; gap: 12px; }
  .p-card {
    background: #fff; border: 1px solid #e5e7eb;
    border-radius: 12px; padding: 1.1rem 1.4rem;
    display: flex; flex-direction: column; gap: 8px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    transition: box-shadow 0.18s, transform 0.18s;
  }
  .p-card:hover { box-shadow: 0 4px 16px rgba(79,70,229,0.1); transform: translateY(-1px); }
  .p-card__row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .p-card__title { font-size: 0.95rem; font-weight: 600; color: #111827; }
  .p-status {
    flex-shrink: 0; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 2px 9px; border-radius: 999px;
  }
  .p-status--PENDING  { background: #fef9c3; color: #854d0e; }
  .p-status--ACCEPTED { background: #dcfce7; color: #166534; }
  .p-status--REJECTED { background: #fee2e2; color: #991b1b; }
  .p-card__desc { font-size: 0.85rem; color: #6b7280; line-height: 1.55; }
  .p-card__meta {
    display: flex; flex-wrap: wrap; gap: 14px;
    font-size: 0.78rem; color: #9ca3af;
    padding-top: 8px; border-top: 1px solid #f3f4f6;
  }

  /* empty */
  .p-empty {
    text-align: center; padding: 2.5rem;
    border: 1.5px dashed #d1d5db;
    border-radius: 12px; background: #fff;
    color: #9ca3af; font-size: 0.9rem;
  }
  .p-empty span { display: block; font-size: 2rem; margin-bottom: 8px; }
`

// ─── Component ────────────────────────────────────────────────────────────────
export default function Proposal() {
  const { id } = useParams<{ id: string }>()
  const token   = localStorage.getItem('authToken')

  const [user,    setUser]    = useState<UserData | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [step,    setStep]    = useState<'idle' | 'user' | 'proposals' | 'done'>('idle')
  const [error,   setError]   = useState<string | null>(null)
  const [debugLog, setDebugLog] = useState<string[]>([])

  const log = (msg: string) => {
    console.log('[Proposal]', msg)
    setDebugLog(prev => [...prev, msg])
  }

  // ── Step 1: fetch user data (role + profileId) ──────────────────────────────
  const fetchUser = async () => {
    if (!id || id === 'undefined') return
    try {
      setStep('user')
      setError(null)
      setDebugLog([])

      const url = `${API_URL}/api/users/${id}`
      log(`GET ${url}`)

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      log(`Response status: ${res.status}`)
      if (!res.ok) throw new Error(`User fetch failed — ${res.status} ${res.statusText}`)

      const json = await res.json()
      log(`User payload: ${JSON.stringify(json)}`)

      // Adjust these paths to match YOUR Spring Boot UserDTO structure:
      //   json.data.role, json.data.freelancerId, json.data.clientId
      const userData: UserData = {
        id:           json.data.id,
        role:         json.data.role,
        freelancerId: json.data.freelancerId ?? json.data.id, // fallback to userId
        clientId:     json.data.clientId     ?? json.data.id, // fallback to userId
      }

      log(`Parsed user: role=${userData.role}, freelancerId=${userData.freelancerId}, clientId=${userData.clientId}`)
      setUser(userData)
      await fetchProposals(userData)  // immediately chain

    } catch (e: any) {
      log(`ERROR: ${e.message}`)
      setError(e.message)
      setStep('idle')
    }
  }

  // ── Step 2: fetch proposals using profileId (NOT userId) ───────────────────
  const fetchProposals = async (u: UserData) => {
    try {
      setStep('proposals')

      // ← This is the critical fix: use freelancerId/clientId, not the URL id
      const profileId = u.role === 'FREELANCER' ? u.freelancerId : u.clientId
      const segment   = u.role === 'FREELANCER' ? 'freelancer' : 'client'
      const url       = `${API_URL}/api/proposals/${segment}/${profileId}`

      log(`GET ${url}`)

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      log(`Response status: ${res.status}`)
      if (!res.ok) throw new Error(`Proposals fetch failed — ${res.status} ${res.statusText}`)

      const json = await res.json()
      log(`Proposals payload keys: ${Object.keys(json).join(', ')}`)

      // Spring Boot Response — check which field your DTO uses
      const list: Proposal[] = json.data ?? json.result ?? json.payload ?? json.proposals ?? []
      log(`Parsed ${list.length} proposals`)

      setProposals(list)
      setStep('done')
    } catch (e: any) {
      log(`ERROR: ${e.message}`)
      setError(e.message)
      setStep('idle')
    }
  }

  useEffect(() => {
    if (id && id !== 'undefined') fetchUser()
  }, [id])

  // ── Not logged in ───────────────────────────────────────────────────────────
  if (!id || id === 'undefined') {
    return (
      <>
        <style>{css}</style>
        <div className="p-root">
          <div className="p-state">
            <span className="p-state__icon">🔐</span>
            <h1 className="p-state__title">Login required</h1>
            <p className="p-state__sub">Please log in to view your proposals.</p>
          </div>
        </div>
      </>
    )
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (step === 'user' || step === 'proposals') {
    return (
      <>
        <style>{css}</style>
        <div className="p-root">
          <div className="p-state">
            <div className="p-spin" />
            <p className="p-state__sub">
              {step === 'user' ? 'Loading user profile…' : 'Fetching proposals…'}
            </p>
          </div>
        </div>
      </>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <>
        <style>{css}</style>
        <div className="p-root">
          <div className="p-state">
            <span className="p-state__icon">⚠️</span>
            <div className="p-err-box">{error}</div>

            {/* Debug log — remove this after fixing */}
            {debugLog.length > 0 && (
              <div className="p-debug">{debugLog.join('\n')}</div>
            )}

            <button className="p-retry" onClick={fetchUser}>Try Again</button>
          </div>
        </div>
      </>
    )
  }

  // ── Proposals list ──────────────────────────────────────────────────────────
  if (step === 'done' && user) {
    return (
      <>
        <style>{css}</style>
        <div className="p-root">
          <div className="p-wrap">

            <div className="p-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2>{user.role === 'FREELANCER' ? 'My Proposals' : 'Received Proposals'}</h2>
                <span className={`p-role p-role--${user.role}`}>{user.role}</span>
              </div>
              <span className="p-count">{proposals.length} total</span>
            </div>

            <div className="p-list">
              {proposals.length === 0 ? (
                <div className="p-empty">
                  <span>📭</span>
                  {user.role === 'FREELANCER'
                    ? "You haven't submitted any proposals yet."
                    : 'No proposals received yet.'}
                </div>
              ) : (
                proposals.map(p => (
                  <div key={p.id} className="p-card">
                    <div className="p-card__row">
                      <h3 className="p-card__title">
                        {p.jobTitle ?? `Job #${p.jobId ?? '—'}`}
                      </h3>
                      <span className={`p-status p-status--${p.status}`}>
                        {p.status}
                      </span>
                    </div>
                    {p.coverLetter && (
                      <p className="p-card__desc">{p.coverLetter}</p>
                    )}
                    <div className="p-card__meta">
                      {p.bidAmount != null && <span>💰 ${p.bidAmount.toLocaleString()}</span>}
                      {p.jobId     != null && <span>🗂 Job #{p.jobId}</span>}
                      {p.createdAt         && <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </>
    )
  }

  return null
}