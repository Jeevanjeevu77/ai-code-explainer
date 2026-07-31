/**
 * components/ImproveResult.jsx
 * =============================
 * Shows code improvement suggestions.
 * Displays the improved code side-by-side with a list of changes.
 */

import React, { useState } from 'react';

export default function ImproveResult({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🔧</div>
        <p style={styles.emptyTitle}>Code Improvement</p>
        <p style={styles.emptyText}>
          Click <strong>"🔧 Improve"</strong> to get suggestions for making your code cleaner and better.
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.improved_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Overall Explanation */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>📋 Summary of Improvements</span>
        </div>
        <p style={styles.explanationText}>{data.explanation}</p>
      </div>

      {/* Changes Made */}
      {data.changes_made && data.changes_made.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>✅ Changes Made</span>
          </div>
          <ul style={styles.changeList}>
            {data.changes_made.map((change, i) => (
              <li key={i} style={styles.changeItem}>
                <span style={styles.changeBullet}>→</span>
                <span style={styles.changeText}>{change}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improved Code */}
      {data.improved_code && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>⚡ Improved Code</span>
            <button onClick={handleCopy} style={styles.copyBtn}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <pre style={styles.codeBlock}>
            <code style={styles.code}>{data.improved_code}</code>
          </pre>
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
    padding: '60px 20px',
    textAlign: 'center',
    gap: '12px',
  },
  emptyIcon: { fontSize: '3rem', marginBottom: '8px' },
  emptyTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#e8f0fe' },
  emptyText: { fontSize: '0.88rem', color: '#8896b3', lineHeight: 1.6, maxWidth: '300px' },
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
    borderLeft: '3px solid #00d97e',
  },
  cardTitle: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#e8f0fe',
  },
  explanationText: {
    fontSize: '0.9rem',
    color: '#c5d0e8',
    lineHeight: 1.75,
    padding: '16px',
  },
  changeList: {
    listStyle: 'none',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  changeItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  changeBullet: {
    color: '#00d97e',
    fontFamily: 'Space Mono, monospace',
    fontWeight: '700',
    flexShrink: 0,
    marginTop: '1px',
  },
  changeText: {
    fontSize: '0.87rem',
    color: '#c5d0e8',
    lineHeight: 1.6,
  },
  copyBtn: {
    background: 'rgba(0,217,126,0.1)',
    border: '1px solid rgba(0,217,126,0.3)',
    color: '#00d97e',
    borderRadius: '5px',
    padding: '3px 12px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'all 150ms ease',
  },
  codeBlock: {
    margin: 0,
    padding: '16px',
    overflowX: 'auto',
    background: 'rgba(0,0,0,0.2)',
  },
  code: {
    fontFamily: 'Space Mono, monospace',
    fontSize: '0.8rem',
    color: '#a8d8b9',
    lineHeight: 1.75,
  },
};
