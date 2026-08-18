'use client';

import { useState } from 'react';

export function EarningsPrep({ projectId, userId }: { projectId: string; userId: string }) {
  const [ticker, setTicker] = useState('');
  const [quarter, setQuarter] = useState('');
  const [question, setQuestion] = useState(
    'What should I focus on for the upcoming earnings call?'
  );
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runPrep() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/earnings-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, projectId, ticker, quarter, question })
      });
      const json = await res.json();
      if (res.ok) {
        setBrief(json.brief?.brief ?? json.brief);
      } else {
        setError(json.error || 'Unknown error');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Earnings Prep</h2>

      <div className="grid gap-2 md:grid-cols-3">
        <input
          className="rounded border border-slate-700 bg-slate-900 p-2"
          placeholder="Ticker (e.g., AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
        <input
          className="rounded border border-slate-700 bg-slate-900 p-2"
          placeholder="Quarter (optional, e.g., Q3 2026)"
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
        />
        <input
          className="rounded border border-slate-700 bg-slate-900 p-2"
          placeholder="Your focus question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <button
        onClick={runPrep}
        disabled={loading}
        className="rounded bg-indigo-500 px-4 py-2 text-sm font-medium"
      >
        {loading ? 'Running earnings prep…' : 'Run earnings prep'}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {brief && (
        <div className="mt-4 space-y-3 rounded border border-slate-700 bg-slate-900 p-4 text-sm">
          <section>
            <h3 className="font-semibold">Snapshot</h3>
            <p>{brief.snapshot?.summary}</p>
          </section>

          <section>
            <h3 className="font-semibold">Key Numbers</h3>
            <ul className="list-disc pl-5">
              {brief.key_numbers?.map((k: any, idx: number) => (
                <li key={idx}>
                  <span className="font-medium">{k.label}:</span> {k.current} (prior: {k.prior}) —{' '}
                  {k.comment}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-semibold">Drivers & Risks</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-medium">Drivers</p>
                <ul className="list-disc pl-5">
                  {brief.drivers_and_risks?.drivers?.map((d: string, idx: number) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">Risks</p>
                <ul className="list-disc pl-5">
                  {brief.drivers_and_risks?.risks?.map((r: string, idx: number) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold">Scenarios</h3>
            <ul className="space-y-2">
              {brief.scenarios?.map((s: any, idx: number) => (
                <li key={idx} className="rounded bg-slate-800 p-2">
                  <p className="font-medium">{s.name}</p>
                  <p>{s.description}</p>
                  <p className="mt-1 text-xs text-slate-300">
                    Watch items: {s.key_watch_items?.join(', ')}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
