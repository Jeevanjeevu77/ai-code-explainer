/**
 * components/ExplainResult.jsx
 * =============================
 * Displays the code explanation results.
 *
 * Shows:
 * 1. Simple overview explanation
 * 2. Line-by-line breakdown
 * 3. Key concepts used
 */

import React, { useState } from 'react';

// A collapsible section component
function Section({ title, children, defaultOpen = true, accent = '#00e5ff' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={styles.section}>
      <button
        style={{ ...styles.sectionHeader, borderLeftColor: accent }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={styles.sectionTitle}>{title}</span>
        <span style={styles.chevron}>{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && <div style={styles.sectionBody}>{children}</div>}
    </div>
  );
}

export default function ExplainResult({ data }) {
  if (!data) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>✨</div>
        <p style={styles.emptyTitle}>Ready to explain!</p>
        <p style={styles.emptyText}>
          Paste your code on the left and click <strong>"Explain Code"</strong> to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Language badge */}
      <div style={styles.badge}>
        <span style={styles.badgeLabel}>Language detected:</span>
        <span style={styles.badgeValue}>{data.language_detected || 'Unknown'}</span>
      </div>

      {/* Simple explanation */}
      <Section title="📖 Simple Explanation" accent="#00e5ff">
        <p style={styles.explanationText}>{data.simple_explanation}</p>
      </Section>

      {/* Key concepts */}
      {data.key_concepts && data.key_concepts.length > 0 && (
        <Section title="🧠 Key Concepts" accent="#7c3aed" defaultOpen={true}>
          <div style={styles.conceptList}>
            {data.key_concepts.map((concept, i) => (
              <span key={i} style={styles.conceptTag}>
                {concept}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Line-by-line breakdown */}
      {data.line_by_line && data.line_by_line.length > 0 && (
        <Section title="🔢 Line-by-Line Breakdown" accent="#00d97e" defaultOpen={true}>
          <div style={styles.lineList}>
            {data.line_by_line.map((item, i) => (
              <div key={i} style={styles.lineItem}>
                {/* Line number */}
                <div style={styles.lineNum}>{item.line_number}</div>

                {/* Code */}
                <div style={styles.lineContent}>
                  <code style={styles.lineCode}>{item.code}</code>
                  <p style={styles.lineExplanation}>{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
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
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '8px',
    filter: 'grayscale(0.3)',
  },
  emptyTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#e8f0fe',
  },
  emptyText: {
    fontSize: '0.88rem',
    color: '#8896b3',
    lineHeight: 1.6,
    maxWidth: '300px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '6px',
    width: 'fit-content',
  },
  badgeLabel: {
    fontSize: '0.75rem',
    color: '#8896b3',
    fontFamily: 'Space Mono, monospace',
  },
  badgeValue: {
    fontSize: '0.78rem',
    color: '#00e5ff',
    fontFamily: 'Space Mono, monospace',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  section: {
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.01)',
  },
  sectionHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    borderLeft: '3px solid #00e5ff',
    cursor: 'pointer',
    color: '#e8f0fe',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'background 150ms ease',
  },
  sectionTitle: {
    fontSize: '0.88rem',
    fontWeight: '600',
  },
  chevron: {
    fontSize: '0.65rem',
    color: '#8896b3',
  },
  sectionBody: {
    padding: '16px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
  },
  explanationText: {
    fontSize: '0.9rem',
    color: '#e8f0fe',
    lineHeight: 1.75,
  },
  conceptList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  conceptTag: {
    padding: '4px 12px',
    background: 'rgba(124,58,237,0.15)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '20px',
    fontSize: '0.78rem',
    color: '#a78bfa',
    fontFamily: 'Space Mono, monospace',
  },
  lineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  lineItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  lineNum: {
    minWidth: '28px',
    height: '28px',
    background: 'rgba(0,229,255,0.1)',
    border: '1px solid rgba(0,229,255,0.2)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    color: '#00e5ff',
    fontFamily: 'Space Mono, monospace',
    fontWeight: '700',
    flexShrink: 0,
    marginTop: '2px',
  },
  lineContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  lineCode: {
    display: 'block',
    fontFamily: 'Space Mono, monospace',
    fontSize: '0.78rem',
    color: '#a8d8b9',
    background: 'rgba(0,0,0,0.3)',
    padding: '4px 10px',
    borderRadius: '4px',
    overflowX: 'auto',
  },
  lineExplanation: {
    fontSize: '0.85rem',
    color: '#c5d0e8',
    lineHeight: 1.6,
  },
};
