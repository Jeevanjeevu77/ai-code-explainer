/**
 * components/CodeEditor.jsx
 * ==========================
 * The left panel where users paste their code.
 *
 * Features:
 * - Syntax-highlighted textarea (using a styled textarea + line numbers)
 * - Language selector
 * - Action buttons for all features
 * - Loading states on buttons
 * - Sample code snippets to try
 */

import React, { useRef, useEffect } from 'react';

// Sample code snippets users can try
const SAMPLE_CODES = {
  python: `# Fibonacci sequence generator
def fibonacci(n):
    if n <= 1:
        return n
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    
    return b

# Print first 10 Fibonacci numbers
for i in range(10):
    print(f"fibonacci({i}) = {fibonacci(i)}")`,

  javascript: `// Async function to fetch user data
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}`,

  java: `// Binary search implementation
public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return -1; // Not found
    }
}`,

  cpp: `// Merge sort implementation
#include <vector>
using namespace std;

void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}`,
};

const LANGUAGES = [
  { value: 'auto', label: '🔍 Auto-detect' },
  { value: 'python', label: '🐍 Python' },
  { value: 'javascript', label: '🟨 JavaScript' },
  { value: 'java', label: '☕ Java' },
  { value: 'cpp', label: '⚙️ C++' },
  { value: 'typescript', label: '🔷 TypeScript' },
  { value: 'go', label: '🐹 Go' },
  { value: 'rust', label: '🦀 Rust' },
  { value: 'php', label: '🐘 PHP' },
];

// A simple spinner icon
const Spinner = () => (
  <span style={{
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid currentColor',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  }} />
);

export default function CodeEditor({
  code, onCodeChange,
  language, onLanguageChange,
  loading,
  onExplain, onImprove, onPseudocode, onConfusion,
  onClear,
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [code]);

  const loadSample = (lang) => {
    const sampleLang = lang === 'auto' ? 'python' : lang;
    if (SAMPLE_CODES[sampleLang]) {
      onCodeChange(SAMPLE_CODES[sampleLang]);
    }
  };

  const isAnyLoading = Object.values(loading).some(Boolean);
  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div style={styles.panel}>
      {/* Panel Header */}
      <div style={styles.panelHeader}>
        <div style={styles.panelTitle}>
          <span style={styles.dot} />
          <span style={styles.dot2} />
          <span style={styles.dot3} />
          <span style={styles.panelTitleText}>code_input.txt</span>
        </div>

        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          style={styles.select}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Code Textarea */}
      <div style={styles.editorWrapper}>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={`// Paste your code here...\n// Supports Python, JavaScript, Java, C++, and more!\n\n// Click "Load Example" below to try a sample`}
          style={styles.textarea}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>

      {/* Stats bar */}
      {code && (
        <div style={styles.statsBar}>
          <span style={styles.stat}>{lineCount} lines</span>
          <span style={styles.statSep}>·</span>
          <span style={styles.stat}>{charCount} chars</span>
          <button
            onClick={() => loadSample(language)}
            style={styles.sampleBtn}
          >
            Load Example
          </button>
          <button onClick={onClear} style={styles.clearBtn}>
            Clear
          </button>
        </div>
      )}

      {!code && (
        <div style={styles.statsBar}>
          <button
            onClick={() => loadSample(language)}
            style={styles.sampleBtn}
          >
            📋 Load Example Code
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.actions}>
        {/* Primary: Explain */}
        <button
          onClick={onExplain}
          disabled={isAnyLoading}
          style={{
            ...styles.btnPrimary,
            ...(isAnyLoading && !loading.explain ? styles.btnDisabled : {}),
          }}
        >
          {loading.explain ? <><Spinner /> Explaining...</> : '✨ Explain Code'}
        </button>

        {/* Secondary actions row */}
        <div style={styles.secondaryActions}>
          <button
            onClick={onImprove}
            disabled={isAnyLoading}
            style={{
              ...styles.btnSecondary,
              ...(loading.improve ? styles.btnSecondaryActive : {}),
            }}
          >
            {loading.improve ? <><Spinner /> Working...</> : '🔧 Improve'}
          </button>

          <button
            onClick={onPseudocode}
            disabled={isAnyLoading}
            style={{
              ...styles.btnSecondary,
              ...(loading.pseudocode ? styles.btnSecondaryActive : {}),
            }}
          >
            {loading.pseudocode ? <><Spinner /> Converting...</> : '📝 Pseudocode'}
          </button>

          <button
            onClick={onConfusion}
            disabled={isAnyLoading}
            style={{
              ...styles.btnSecondary,
              ...(loading.confusion ? styles.btnSecondaryActive : {}),
            }}
          >
            {loading.confusion ? <><Spinner /> Scanning...</> : '🔍 Confusion Scan'}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div style={styles.tips}>
        <p style={styles.tipText}>
          💡 <strong>Tip:</strong> Select Beginner or Intermediate mode in the header to adjust explanation depth.
        </p>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    background: '#0f1624',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  },
  panelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dot: {
    width: '10px', height: '10px', borderRadius: '50%',
    background: '#ff5f57',
  },
  dot2: {
    width: '10px', height: '10px', borderRadius: '50%',
    background: '#febc2e',
  },
  dot3: {
    width: '10px', height: '10px', borderRadius: '50%',
    background: '#28c840',
  },
  panelTitleText: {
    marginLeft: '8px',
    fontSize: '0.78rem',
    color: '#8896b3',
    fontFamily: 'Space Mono, monospace',
  },
  select: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: '#e8f0fe',
    fontSize: '0.8rem',
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    outline: 'none',
  },
  editorWrapper: {
    flex: 1,
    position: 'relative',
    minHeight: '280px',
  },
  textarea: {
    width: '100%',
    minHeight: '280px',
    background: 'transparent',
    border: 'none',
    color: '#a8d8b9',
    fontFamily: 'Space Mono, monospace',
    fontSize: '0.82rem',
    lineHeight: '1.7',
    padding: '16px',
    resize: 'vertical',
    outline: 'none',
    tabSize: 2,
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(255,255,255,0.01)',
  },
  stat: {
    fontSize: '0.72rem',
    color: '#4a5568',
    fontFamily: 'Space Mono, monospace',
  },
  statSep: {
    color: '#4a5568',
    fontSize: '0.72rem',
  },
  sampleBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: '1px solid rgba(0,229,255,0.2)',
    color: '#00e5ff',
    fontSize: '0.72rem',
    padding: '2px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'all 150ms ease',
  },
  clearBtn: {
    background: 'none',
    border: '1px solid rgba(255,77,109,0.2)',
    color: '#ff4d6d',
    fontSize: '0.72rem',
    padding: '2px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
  actions: {
    padding: '16px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  btnPrimary: {
    width: '100%',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(124,58,237,0.15))',
    border: '1px solid rgba(0,229,255,0.4)',
    borderRadius: '8px',
    color: '#00e5ff',
    fontSize: '0.95rem',
    fontWeight: '600',
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    letterSpacing: '-0.01em',
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  secondaryActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
  },
  btnSecondary: {
    padding: '8px 10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '7px',
    color: '#8896b3',
    fontSize: '0.78rem',
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  btnSecondaryActive: {
    background: 'rgba(124,58,237,0.1)',
    borderColor: 'rgba(124,58,237,0.3)',
    color: '#a78bfa',
  },
  tips: {
    padding: '10px 16px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
  },
  tipText: {
    fontSize: '0.75rem',
    color: '#4a5568',
    lineHeight: 1.5,
  },
};
