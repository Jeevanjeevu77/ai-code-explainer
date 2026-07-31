/**
 * App.jsx - Main Application Component
 * =======================================
 * This is the root component of our React application.
 * It connects all the pieces together:
 * - Header (mode toggle)
 * - Code Editor (left panel)
 * - Results Panel (right panel with tabs)
 *
 * State management is handled by our custom hook: useCodeAnalysis
 */

import React from 'react';
import Header from './components/Header.jsx';
import CodeEditor from './components/CodeEditor.jsx';
import ResultsTabs from './components/ResultsTabs.jsx';
import ExplainResult from './components/ExplainResult.jsx';
import ImproveResult from './components/ImproveResult.jsx';
import PseudocodeResult from './components/PseudocodeResult.jsx';
import ConfusionResult from './components/ConfusionResult.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import ErrorBanner from './components/ErrorBanner.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';
import { useCodeAnalysis } from './hooks/useCodeAnalysis.js';

export default function App() {
  // All state and logic is managed by our custom hook
  const {
    code, setCode,
    language, setLanguage,
    mode, setMode,
    activeTab, setActiveTab,
    loading,
    results,
    error, setError,
    chatMessages,
    chatInput, setChatInput,
    handleExplain,
    handleImprove,
    handlePseudocode,
    handleConfusion,
    handleSendChat,
    handleClear,
  } = useCodeAnalysis();

  // Determine which result to show based on active tab
  const isCurrentTabLoading = loading[activeTab];

  // Render the correct result panel based on active tab
  const renderResult = () => {
    // Show skeleton while loading
    if (isCurrentTabLoading) {
      return <LoadingSkeleton type={activeTab} />;
    }

    switch (activeTab) {
      case 'explain':
        return <ExplainResult data={results.explain} />;
      case 'improve':
        return <ImproveResult data={results.improve} />;
      case 'pseudocode':
        return <PseudocodeResult data={results.pseudocode} />;
      case 'confusion':
        return <ConfusionResult data={results.confusion} />;
      case 'chat':
        return (
          <ChatPanel
            messages={chatMessages}
            chatInput={chatInput}
            onInputChange={setChatInput}
            onSend={handleSendChat}
            isLoading={loading.followup}
            hasCode={!!code.trim()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.app}>
      {/* Top navigation bar */}
      <Header mode={mode} onModeChange={setMode} />

      {/* Main content area */}
      <main style={styles.main}>
        <div style={styles.layout}>

          {/* ─── LEFT PANEL: Code Input ─── */}
          <div style={styles.leftPanel}>
            <CodeEditor
              code={code}
              onCodeChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              loading={loading}
              onExplain={handleExplain}
              onImprove={handleImprove}
              onPseudocode={handlePseudocode}
              onConfusion={handleConfusion}
              onClear={handleClear}
            />
          </div>

          {/* ─── RIGHT PANEL: Results ─── */}
          <div style={styles.rightPanel}>
            <div style={styles.resultsContainer}>

              {/* Error display */}
              {error && (
                <div style={styles.errorWrapper}>
                  <ErrorBanner
                    error={error}
                    onDismiss={() => setError(null)}
                  />
                </div>
              )}

              {/* Tab navigation */}
              <ResultsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                results={results}
                loading={loading}
              />

              {/* Tab content */}
              <div style={styles.tabContent}>
                {renderResult()}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          AI Code Explainer · Built with FastAPI + React · Powered by AI
        </p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    padding: '20px 24px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  layout: {
    display: 'grid',
    // Two equal columns on desktop
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    alignItems: 'start',
    // On small screens, stack vertically
    // (handled via media query in real app)
  },
  leftPanel: {
    // Sticky so the editor stays in view while scrolling results
    position: 'sticky',
    top: '80px',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
  },
  rightPanel: {
    minHeight: '500px',
  },
  resultsContainer: {
    background: '#0f1624',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    overflow: 'hidden',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
  },
  errorWrapper: {
    padding: '16px 16px 0',
  },
  tabContent: {
    flex: 1,
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 200px)',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.04)',
    padding: '16px 24px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '0.75rem',
    color: '#4a5568',
    fontFamily: 'Space Mono, monospace',
  },
};
