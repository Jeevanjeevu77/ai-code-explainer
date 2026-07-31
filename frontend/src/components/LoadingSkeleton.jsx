/**
 * components/LoadingSkeleton.jsx
 * ================================
 * Shows an animated "skeleton" placeholder while AI is processing.
 * Much better UX than a plain spinner!
 */

import React from 'react';

function SkeletonLine({ width = '100%', height = '14px', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% auto',
        animation: 'shimmer 1.5s linear infinite',
        borderRadius: '4px',
        ...style,
      }}
    />
  );
}

export default function LoadingSkeleton({ type = 'explain' }) {
  return (
    <div style={styles.container}>
      {/* Processing indicator */}
      <div style={styles.processingRow}>
        <div style={styles.spinner} />
        <span style={styles.processingText}>
          {type === 'explain' && 'AI is reading your code...'}
          {type === 'improve' && 'AI is suggesting improvements...'}
          {type === 'pseudocode' && 'Converting to pseudocode...'}
          {type === 'confusion' && 'Scanning for confusing patterns...'}
        </span>
      </div>

      {/* Skeleton content */}
      <div style={styles.skeletonCard}>
        <SkeletonLine width="40%" height="12px" />
        <div style={{ height: '12px' }} />
        <SkeletonLine width="100%" />
        <div style={{ height: '8px' }} />
        <SkeletonLine width="90%" />
        <div style={{ height: '8px' }} />
        <SkeletonLine width="75%" />
      </div>

      <div style={styles.skeletonCard}>
        <SkeletonLine width="30%" height="12px" />
        <div style={{ height: '12px' }} />
        {[100, 85, 92, 78].map((w, i) => (
          <div key={i} style={styles.lineSkeletonRow}>
            <SkeletonLine width="28px" height="28px" style={{ borderRadius: '4px', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <SkeletonLine width={`${w}%`} height="12px" />
              <SkeletonLine width={`${w - 15}%`} height="10px" />
            </div>
          </div>
        ))}
      </div>
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
  processingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    background: 'rgba(0,229,255,0.04)',
    border: '1px solid rgba(0,229,255,0.12)',
    borderRadius: '7px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(0,229,255,0.3)',
    borderTopColor: '#00e5ff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  },
  processingText: {
    fontSize: '0.82rem',
    color: '#00e5ff',
    fontFamily: 'Space Mono, monospace',
  },
  skeletonCard: {
    padding: '16px',
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  lineSkeletonRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
};
