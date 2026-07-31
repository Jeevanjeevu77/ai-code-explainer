/**
 * components/ErrorBanner.jsx
 * ===========================
 * Displays error messages with a suggestion for how to fix them.
 * Automatically dismisses after 8 seconds or when user clicks X.
 */

import React, { useEffect } from 'react';

export default function ErrorBanner({ error, onDismiss }) {
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);  // Cleanup on unmount
  }, [error, onDismiss]);

  if (!error) return null;

  const message = error.message || error.detail || String(error);
  const suggestion = error.suggestion || '';

  return (
    <div style={styles.banner} className="animate-fade-in" role="alert">
      <div style={styles.iconWrapper}>⚠️</div>
      <div style={styles.content}>
        <p style={styles.message}>{message}</p>
        {suggestion && <p style={styles.suggestion}>💡 {suggestion}</p>}
      </div>
      <button
        onClick={onDismiss}
        style={styles.dismiss}
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </div>
  );
}

const styles = {
  banner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    background: 'rgba(255,77,109,0.08)',
    border: '1px solid rgba(255,77,109,0.3)',
    borderRadius: '8px',
    margin: '0 0 16px 0',
  },
  iconWrapper: {
    fontSize: '1.1rem',
    flexShrink: 0,
    marginTop: '1px',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: '0.88rem',
    color: '#ff4d6d',
    fontWeight: '500',
    lineHeight: 1.5,
    marginBottom: '4px',
  },
  suggestion: {
    fontSize: '0.82rem',
    color: '#8896b3',
    lineHeight: 1.5,
  },
  dismiss: {
    background: 'none',
    border: 'none',
    color: '#8896b3',
    cursor: 'pointer',
    fontSize: '0.85rem',
    padding: '2px 4px',
    flexShrink: 0,
    lineHeight: 1,
  },
};
