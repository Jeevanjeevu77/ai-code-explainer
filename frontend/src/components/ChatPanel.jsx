/**
 * components/ChatPanel.jsx
 * =========================
 * The follow-up question chat interface.
 * Users can ask questions about their code and get answers.
 *
 * This implements a simple chat UI with:
 * - Message history
 * - User/AI message bubbles
 * - Loading indicator
 * - Related concepts display
 */

import React, { useEffect, useRef } from 'react';

// Spinner component for loading state
const Spinner = ({ size = 16 }) => (
  <span style={{
    display: 'inline-block',
    width: size,
    height: size,
    border: '2px solid rgba(0,229,255,0.3)',
    borderTopColor: '#00e5ff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  }} />
);

// Individual chat message component
function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div style={{
      ...styles.messageWrapper,
      justifyContent: isUser ? 'flex-end' : 'flex-start',
    }}>
      {/* AI avatar */}
      {!isUser && (
        <div style={styles.avatar}>🤖</div>
      )}

      <div style={{
        ...styles.messageBubble,
        ...(isUser ? styles.userBubble : styles.aiBubble),
        ...(message.isError ? styles.errorBubble : {}),
      }}>
        <p style={styles.messageText}>{message.content}</p>

        {/* Related concepts */}
        {message.relatedConcepts && message.relatedConcepts.length > 0 && (
          <div style={styles.conceptsRow}>
            <span style={styles.conceptsLabel}>Related:</span>
            {message.relatedConcepts.map((concept, i) => (
              <span key={i} style={styles.conceptChip}>{concept}</span>
            ))}
          </div>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div style={styles.userAvatar}>👤</div>
      )}
    </div>
  );
}

export default function ChatPanel({
  messages,
  chatInput,
  onInputChange,
  onSend,
  isLoading,
  hasCode,
}) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && chatInput.trim()) {
        onSend();
      }
    }
  };

  // Suggested starter questions
  const SUGGESTIONS = [
    "What does this function return?",
    "Are there any bugs in this code?",
    "Can you give me an example of how to use this?",
    "What happens if I pass a negative number?",
    "Why is this faster than a simpler approach?",
  ];

  if (!hasCode) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>💬</div>
        <p style={styles.emptyTitle}>Ask AI About Your Code</p>
        <p style={styles.emptyText}>
          First paste some code on the left, then come here to ask any question about it!
        </p>
      </div>
    );
  }

  return (
    <div style={styles.chatContainer}>
      {/* Messages area */}
      <div style={styles.messagesArea}>
        {/* Empty state with suggestions */}
        {messages.length === 0 && (
          <div style={styles.welcomeBox}>
            <p style={styles.welcomeTitle}>💬 Chat with your code</p>
            <p style={styles.welcomeText}>
              Ask any question about the code you pasted. Here are some ideas:
            </p>
            <div style={styles.suggestions}>
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  style={styles.suggestionBtn}
                  onClick={() => {
                    onInputChange(suggestion);
                    inputRef.current?.focus();
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div style={styles.messageWrapper}>
            <div style={styles.avatar}>🤖</div>
            <div style={{ ...styles.messageBubble, ...styles.aiBubble, ...styles.loadingBubble }}>
              <Spinner size={14} />
              <span style={styles.loadingText}>Thinking...</span>
            </div>
          </div>
        )}

        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputArea}>
        <textarea
          ref={inputRef}
          value={chatInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your code... (Enter to send)"
          style={styles.chatInput}
          rows={2}
          disabled={isLoading}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !chatInput.trim()}
          style={{
            ...styles.sendBtn,
            ...(isLoading || !chatInput.trim() ? styles.sendBtnDisabled : {}),
          }}
        >
          {isLoading ? <Spinner size={16} /> : '↑'}
        </button>
      </div>

      <p style={styles.hint}>
        Press <kbd style={styles.kbd}>Enter</kbd> to send · <kbd style={styles.kbd}>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '400px',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
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
    height: '100%',
  },
  emptyIcon: { fontSize: '3rem', marginBottom: '8px' },
  emptyTitle: { fontSize: '1.1rem', fontWeight: '600', color: '#e8f0fe' },
  emptyText: { fontSize: '0.88rem', color: '#8896b3', lineHeight: 1.6, maxWidth: '300px' },
  welcomeBox: {
    padding: '20px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    marginBottom: '8px',
  },
  welcomeTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#e8f0fe',
    marginBottom: '6px',
  },
  welcomeText: {
    fontSize: '0.85rem',
    color: '#8896b3',
    marginBottom: '14px',
    lineHeight: 1.5,
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  suggestionBtn: {
    textAlign: 'left',
    padding: '8px 14px',
    background: 'rgba(0,229,255,0.04)',
    border: '1px solid rgba(0,229,255,0.12)',
    borderRadius: '6px',
    color: '#8896b3',
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'all 150ms ease',
  },
  messageWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(0,229,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(124,58,237,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '10px',
    lineHeight: 1.6,
  },
  userBubble: {
    background: 'rgba(124,58,237,0.15)',
    border: '1px solid rgba(124,58,237,0.25)',
    borderBottomRightRadius: '3px',
  },
  aiBubble: {
    background: 'rgba(0,229,255,0.06)',
    border: '1px solid rgba(0,229,255,0.12)',
    borderBottomLeftRadius: '3px',
  },
  errorBubble: {
    background: 'rgba(255,77,109,0.08)',
    border: '1px solid rgba(255,77,109,0.2)',
  },
  loadingBubble: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  loadingText: {
    fontSize: '0.82rem',
    color: '#8896b3',
    fontStyle: 'italic',
  },
  messageText: {
    fontSize: '0.87rem',
    color: '#e8f0fe',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
  },
  conceptsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '8px',
    alignItems: 'center',
  },
  conceptsLabel: {
    fontSize: '0.7rem',
    color: '#8896b3',
    fontFamily: 'Space Mono, monospace',
  },
  conceptChip: {
    fontSize: '0.68rem',
    padding: '2px 8px',
    background: 'rgba(0,229,255,0.08)',
    border: '1px solid rgba(0,229,255,0.15)',
    borderRadius: '10px',
    color: '#00e5ff',
    fontFamily: 'Space Mono, monospace',
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#e8f0fe',
    fontSize: '0.87rem',
    fontFamily: 'DM Sans, sans-serif',
    padding: '10px 14px',
    resize: 'none',
    outline: 'none',
    lineHeight: 1.5,
    transition: 'border-color 150ms ease',
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    background: 'rgba(0,229,255,0.15)',
    border: '1px solid rgba(0,229,255,0.35)',
    borderRadius: '8px',
    color: '#00e5ff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 150ms ease',
    fontWeight: '700',
  },
  sendBtnDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
  hint: {
    fontSize: '0.7rem',
    color: '#4a5568',
    textAlign: 'center',
    padding: '4px 16px 10px',
    fontFamily: 'Space Mono, monospace',
  },
  kbd: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '3px',
    padding: '1px 5px',
    fontSize: '0.65rem',
  },
};
