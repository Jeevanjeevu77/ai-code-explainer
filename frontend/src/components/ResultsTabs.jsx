/**
 * components/ResultsTabs.jsx
 * ===========================
 * Tab navigation for the results panel.
 * Shows which tab is active and allows switching between:
 * - Explanation
 * - Improvements
 * - Pseudocode
 * - Confusion Detector
 * - Chat
 */

import React from 'react';

const TABS = [
  { id: 'explain',    label: '✨ Explanation',   shortLabel: 'Explain' },
  { id: 'improve',    label: '🔧 Improvements',  shortLabel: 'Improve' },
  { id: 'pseudocode', label: '📝 Pseudocode',    shortLabel: 'Pseudo' },
  { id: 'confusion',  label: '🔍 Confusion',     shortLabel: 'Confused?' },
  { id: 'chat',       label: '💬 Ask AI',        shortLabel: 'Chat' },
];

export default function ResultsTabs({ activeTab, onTabChange, results, loading }) {
  return (
    <div style={styles.tabBar}>
      {TABS.map(tab => {
        const hasResult = results[tab.id] !== null && results[tab.id] !== undefined;
        const isLoading = loading[tab.id];
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              ...styles.tab,
              ...(isActive ? styles.tabActive : {}),
              ...(hasResult && !isActive ? styles.tabHasResult : {}),
            }}
            title={tab.label}
          >
            {/* Loading spinner inside tab */}
            {isLoading ? (
              <span style={styles.tabSpinner} />
            ) : (
              /* Green dot if tab has results */
              hasResult && <span style={styles.resultDot} />
            )}
            <span style={styles.tabLabel}>{tab.label}</span>
            <span style={styles.tabLabelShort}>{tab.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.01)',
    overflowX: 'auto',
    padding: '0 4px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  tab: {
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#8896b3',
    fontSize: '0.82rem',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    position: 'relative',
  },
  tabActive: {
    color: '#00e5ff',
    borderBottomColor: '#00e5ff',
    background: 'rgba(0,229,255,0.04)',
  },
  tabHasResult: {
    color: '#a8d8b9',
  },
  resultDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00d97e',
    flexShrink: 0,
  },
  tabSpinner: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    border: '2px solid currentColor',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  },
  tabLabel: {
    // Show on larger screens
  },
  tabLabelShort: {
    display: 'none', // Hidden by default, could show on mobile via media query
  },
};
