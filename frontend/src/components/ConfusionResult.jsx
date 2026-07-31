/**
 * components/ConfusionResult.jsx
 * ================================
 * Shows the confusion analysis: highlights complex patterns and explains them.
 */

import React from 'react';

const DIFFICULTY_COLORS = {
  mild: { bg: 'rgba(0,217,126,0.08)', border: 'rgba(0,217,126,0.25)', text: '#00d97e', label: 'Mild' },
  moderate: { bg: 'rgba(255,176,32,0.08)', border: 'rgba(255,176,32,0.25)', text: '#ffb020', label: 'Moderate' },
  complex: { bg: 'rgba(255,77,109,0.08)', border: 'rgba(255,77,109,0.25)', text: '#ff4d6d', label: 'Complex' },
};

const COMPLEXITY_BADGE = {
  easy: { color: '#00d97e', bg: 'rgba(0,217,126,0.1)', border: 'rgba(0,217,126,0.3)', icon: '🟢' },
  medium: { color: '#ffb020', bg: 'rgba(255,176,32,0.1)', border: 'rgba(255,176,32,0.3)', icon: '🟡' },
  hard: { color: '#ff4d6d', bg: 'rgba(255,77,109,0.1)', border: 'rgba(255,77,109,0.3)', icon: '🔴' },
};

export default function ConfusionResult({ data }) {
  if (!data) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🔍</div>
        <p style={styles.emptyTitle}>Confusion Detector</p>
        <p style={styles.emptyText}>
          Click <strong>"🔍 Confusion Scan"</strong> to find the parts of your code that are typically
          hardest for beginners to understand.
        </p>
      </div>
    );
  }

  const complexityStyle = COMPLEXITY_BADGE[data.overall_complexity] || COMPLEXITY_BADGE.medium;

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Overall complexity badge */}
      <div style={styles.complexityRow}>
        <div
          style={{
            ...styles.complexityBadge,
            background: complexityStyle.bg,
            border: `1px solid ${complexityStyle.border}`,
            color: complexityStyle.color,
          }}
        >
          {complexityStyle.icon} Complexity: <strong>{data.overall_complexity?.toUpperCase()}</strong>
        </div>
      </div>

      {/* Summary */}
      <div style={styles.summaryBox}>
        <p style={styles.summaryText}>{data.summary}</p>
      </div>

      {/* No confusing parts */}
      {(!data.confusion_items || data.confusion_items.length === 0) && (
        <div style={styles.clearBox}>
          <span style={styles.clearIcon}>✅</span>
          <div>
            <p style={styles.clearTitle}>Great news! No confusing patterns found.</p>
            <p style={styles.clearText}>This code is clean and easy to follow.</p>
          </div>
        </div>
      )}

      {/* Confusion items */}
      {data.confusion_items && data.confusion_items.map((item, i) => {
        const diffStyle = DIFFICULTY_COLORS[item.difficulty_level] || DIFFICULTY_COLORS.moderate;

        return (
          <div
            key={i}
            style={{
              ...styles.confusionCard,
              background: diffStyle.bg,
              border: `1px solid ${diffStyle.border}`,
            }}
          >
            {/* Card header */}
            <div style={styles.confusionHeader}>
              <div style={styles.confusionMeta}>
                <span
                  style={{
                    ...styles.difficultyBadge,
                    background: diffStyle.bg,
                    color: diffStyle.text,
                    borderColor: diffStyle.border,
                  }}
                >
                  {diffStyle.label}
                </span>
                {item.line_numbers && item.line_numbers.length > 0 && (
                  <span style={styles.linesBadge}>
                    Line{item.line_numbers.length > 1 ? 's' : ''}: {item.line_numbers.join(', ')}
                  </span>
                )}
              </div>
            </div>

            {/* Code snippet */}
            {item.code_snippet && (
              <pre style={styles.snippet}>
                <code>{item.code_snippet}</code>
              </pre>
            )}

            {/* Why confusing */}
            <div style={styles.confusionSection}>
              <p style={styles.confusionLabel}>🤔 Why this is confusing:</p>
              <p style={styles.confusionText}>{item.why_confusing}</p>
            </div>

            {/* Simplified explanation */}
            <div style={styles.simplifiedSection}>
              <p style={styles.confusionLabel}>💡 Simpler way to think about it:</p>
              <p style={styles.simplifiedText}>{item.simplified_explanation}</p>
            </div>
          </div>
        );
      })}
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
  emptyText: { fontSize: '0.88rem', color: '#8896b3', lineHeight: 1.6, maxWidth: '320px' },
  complexityRow: {
    display: 'flex',
    alignItems: 'center',
  },
  complexityBadge: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontFamily: 'Space Mono, monospace',
  },
  summaryBox: {
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    borderLeft: '3px solid #8896b3',
  },
  summaryText: {
    fontSize: '0.9rem',
    color: '#c5d0e8',
    lineHeight: 1.7,
  },
  clearBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    background: 'rgba(0,217,126,0.06)',
    border: '1px solid rgba(0,217,126,0.2)',
    borderRadius: '8px',
  },
  clearIcon: { fontSize: '1.5rem', flexShrink: 0 },
  clearTitle: { fontSize: '0.95rem', fontWeight: '600', color: '#00d97e', marginBottom: '4px' },
  clearText: { fontSize: '0.85rem', color: '#8896b3' },
  confusionCard: {
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  confusionHeader: {
    padding: '12px 16px 8px',
  },
  confusionMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    padding: '2px 10px',
    borderRadius: '4px',
    fontSize: '0.72rem',
    fontFamily: 'Space Mono, monospace',
    fontWeight: '700',
    border: '1px solid',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  linesBadge: {
    fontSize: '0.75rem',
    color: '#8896b3',
    fontFamily: 'Space Mono, monospace',
    background: 'rgba(0,0,0,0.2)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  snippet: {
    margin: '0 16px 12px',
    padding: '10px 14px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '6px',
    fontFamily: 'Space Mono, monospace',
    fontSize: '0.78rem',
    color: '#a8d8b9',
    overflowX: 'auto',
  },
  confusionSection: {
    padding: '0 16px 10px',
  },
  simplifiedSection: {
    padding: '10px 16px 14px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.1)',
  },
  confusionLabel: {
    fontSize: '0.75rem',
    color: '#8896b3',
    fontFamily: 'Space Mono, monospace',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  confusionText: {
    fontSize: '0.87rem',
    color: '#c5d0e8',
    lineHeight: 1.65,
  },
  simplifiedText: {
    fontSize: '0.87rem',
    color: '#e8f0fe',
    lineHeight: 1.65,
  },
};
