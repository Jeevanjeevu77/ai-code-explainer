/**
 * components/Header.jsx
 * ======================
 * The top navigation bar of the app.
 * Displays the logo, title, and mode toggle (Beginner/Intermediate).
 */

import React from 'react';

// SVG icon for the logo - a simple code bracket with a sparkle
const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="rgba(0,229,255,0.1)" stroke="rgba(0,229,255,0.3)" strokeWidth="1"/>
    <path d="M10 11L6 16L10 21" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 11L26 16L22 21" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 9L13 23" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Header({ mode, onModeChange }) {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        {/* Logo + Title */}
        <div style={styles.brand}>
          <LogoIcon />
          <div>
            <h1 style={styles.title}>AI Code Explainer</h1>
            <p style={styles.subtitle}>Understand any code, instantly</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={styles.modeToggle}>
          <span style={styles.modeLabel}>Mode:</span>
          <div style={styles.toggleContainer}>
            <button
              style={{
                ...styles.toggleBtn,
                ...(mode === 'beginner' ? styles.toggleBtnActive : {}),
              }}
              onClick={() => onModeChange('beginner')}
              title="Simple explanations, perfect for beginners"
            >
              🌱 Beginner
            </button>
            <button
              style={{
                ...styles.toggleBtn,
                ...(mode === 'intermediate' ? styles.toggleBtnActiveAlt : {}),
              }}
              onClick={() => onModeChange('intermediate')}
              title="More technical explanations with terminology"
            >
              ⚡ Intermediate
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: 'rgba(15, 22, 36, 0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '0 24px',
  },
  inner: {
    maxWidth: '1400px',
    margin: '0 auto',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#e8f0fe',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '0.72rem',
    color: '#8896b3',
    fontFamily: 'Space Mono, monospace',
    letterSpacing: '0.05em',
  },
  modeToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  modeLabel: {
    fontSize: '0.8rem',
    color: '#8896b3',
    fontFamily: 'Space Mono, monospace',
  },
  toggleContainer: {
    display: 'flex',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '3px',
    gap: '2px',
  },
  toggleBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    color: '#8896b3',
    fontSize: '0.8rem',
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    fontWeight: '500',
  },
  toggleBtnActive: {
    background: 'rgba(0, 229, 255, 0.15)',
    color: '#00e5ff',
    boxShadow: '0 0 12px rgba(0,229,255,0.1)',
  },
  toggleBtnActiveAlt: {
    background: 'rgba(124, 58, 237, 0.2)',
    color: '#a78bfa',
    boxShadow: '0 0 12px rgba(124,58,237,0.15)',
  },
};
