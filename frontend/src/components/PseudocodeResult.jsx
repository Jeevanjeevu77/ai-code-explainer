/**
 * components/PseudocodeResult.jsx
 * ================================
 * Displays the pseudocode conversion result.
 */

import React, { useState } from 'react';

export default function PseudocodeResult({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📝</div>
        <p style={styles.emptyTitle}>Pseudocode Converter</p>
        <p style={styles.emptyText}>
          Click <strong>"📝 Pseudocode"</strong> to convert your code to plain English step-by-step instructions.
        </p>
        <div style={styles.exampleBox}>
          <p style={styles.exampleLabel}>Example output:</p>
          <pre style={styles.exampleCode}>{`START
  SET counter = 0
  FOR EACH number FROM 1 TO 10:
    ADD number to counter
  END FOR
  PRINT counter
END`}</pre>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.pseudocode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Overview */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>📖 What This Algorithm Does</span>
        </div>
        <p style={styles.explanationText}>{data.explanation}</p>
      </div>

      {/* Steps */}
      {data.steps && data.steps.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>🔢 Step-by-Step Breakdown</span>
          </div>
          <ol style={styles.stepList}>
            {data.steps.map((step, i) => (
              <li key={i} style={styles.stepItem}>
                <span style={styles.stepNum}>{i + 1}</span>
                <span style={styles.stepText}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Pseudocode */}
      {data.pseudocode && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>📝 Pseudocode</span>
            <button onClick={handleCopy} style={styles.copyBtn}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <pre style={styles.pseudocodeBlock}>{data.pseudocode}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
    gap: '12px',
  },
  emptyIcon: { fontSize: '3rem', marginBottom: '8px' },
  emptyTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#e8f0fe' },
  emptyText: { fontSize: '0.88rem', color: '#8896b3', lineHeight: 1.6, maxWidth: '300px' },
  exampleBox: {
    marginTop: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'left',
    maxWidth: '320px',
  },
  exampleLabel: {
    fontSize: '0.72rem',
    color: '#8896b3',
    marginBottom: '8px',
    fontFamily: 'Space Mono, monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  exampleCode: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '0.75rem',
    color: '#ffb020',
    lineHeight: 1.8,
  },
  card: {
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.01)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    borderLeft: '3px solid #ffb020',
  },
  cardTitle: { fontSize: '0.88rem', fontWeight: '600', color: '#e8f0fe' },
  explanationText: {
    fontSize: '0.9rem',
    color: '#c5d0e8',
    lineHeight: 1.75,
    padding: '16px',
  },
  stepList: {
    listStyle: 'none',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  stepItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  stepNum: {
    minWidth: '24px',
    height: '24px',
    background: 'rgba(255,176,32,0.15)',
    border: '1px solid rgba(255,176,32,0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    color: '#ffb020',
    fontFamily: 'Space Mono, monospace',
    fontWeight: '700',
    flexShrink: 0,
  },
  stepText: {
    fontSize: '0.87rem',
    color: '#c5d0e8',
    lineHeight: 1.6,
    paddingTop: '2px',
  },
  copyBtn: {
    background: 'rgba(255,176,32,0.1)',
    border: '1px solid rgba(255,176,32,0.3)',
    color: '#ffb020',
    borderRadius: '5px',
    padding: '3px 12px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
  pseudocodeBlock: {
    margin: 0,
    padding: '16px',
    fontFamily: 'Space Mono, monospace',
    fontSize: '0.82rem',
    color: '#ffb020',
    lineHeight: 2,
    background: 'rgba(255,176,32,0.03)',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
  },
};
