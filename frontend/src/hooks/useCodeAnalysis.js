/**
 * hooks/useCodeAnalysis.js
 * =========================
 * A custom React Hook that manages all the state and logic
 * for our code analysis features.
 *
 * WHY A CUSTOM HOOK?
 * Instead of putting all this logic inside a component (making it messy),
 * we extract it into a hook. This makes our components cleaner and
 * makes the logic reusable and testable.
 *
 * This hook manages:
 * - Code input state
 * - Loading states for each feature
 * - Results from each AI feature
 * - Error handling
 * - The follow-up chat conversation
 */

import { useState, useCallback } from 'react';
import {
  explainCode,
  improveCode,
  convertToPseudocode,
  detectConfusion,
  askFollowup,
} from '../utils/api';

export function useCodeAnalysis() {
  // ─────────────────────────────────────────────
  // INPUT STATE
  // ─────────────────────────────────────────────
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('auto');
  const [mode, setMode] = useState('beginner'); // 'beginner' or 'intermediate'
  const [activeTab, setActiveTab] = useState('explain'); // Current results tab

  // ─────────────────────────────────────────────
  // LOADING STATES (one per feature)
  // ─────────────────────────────────────────────
  const [loading, setLoading] = useState({
    explain: false,
    improve: false,
    pseudocode: false,
    confusion: false,
    followup: false,
  });

  // ─────────────────────────────────────────────
  // RESULTS STATE (one per feature)
  // ─────────────────────────────────────────────
  const [results, setResults] = useState({
    explain: null,
    improve: null,
    pseudocode: null,
    confusion: null,
  });

  // ─────────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────────
  const [error, setError] = useState(null);

  // ─────────────────────────────────────────────
  // CHAT STATE (for follow-up questions)
  // ─────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // ─────────────────────────────────────────────
  // HELPER: Set loading for a specific feature
  // ─────────────────────────────────────────────
  const setFeatureLoading = (feature, isLoading) => {
    setLoading(prev => ({ ...prev, [feature]: isLoading }));
  };

  // ─────────────────────────────────────────────
  // HELPER: Set result for a specific feature
  // ─────────────────────────────────────────────
  const setFeatureResult = (feature, data) => {
    setResults(prev => ({ ...prev, [feature]: data }));
  };

  // ─────────────────────────────────────────────
  // ACTION: Validate code before sending to API
  // ─────────────────────────────────────────────
  const validateCode = () => {
    if (!code.trim()) {
      setError({
        message: 'Please paste some code first!',
        suggestion: 'Try pasting a few lines of Python, JavaScript, or any other language.',
      });
      return false;
    }
    setError(null);
    return true;
  };

  // ─────────────────────────────────────────────
  // ACTION: Explain Code
  // useCallback prevents this function from being
  // re-created on every render (performance optimization)
  // ─────────────────────────────────────────────
  const handleExplain = useCallback(async () => {
    if (!validateCode()) return;

    setFeatureLoading('explain', true);
    setError(null);
    setActiveTab('explain');

    try {
      const data = await explainCode(code, language, mode);
      setFeatureResult('explain', data);
    } catch (err) {
      setError(err);
    } finally {
      // 'finally' always runs, whether success or error
      setFeatureLoading('explain', false);
    }
  }, [code, language, mode]);

  // ─────────────────────────────────────────────
  // ACTION: Improve Code
  // ─────────────────────────────────────────────
  const handleImprove = useCallback(async () => {
    if (!validateCode()) return;

    setFeatureLoading('improve', true);
    setError(null);
    setActiveTab('improve');

    try {
      const data = await improveCode(code, language, mode);
      setFeatureResult('improve', data);
    } catch (err) {
      setError(err);
    } finally {
      setFeatureLoading('improve', false);
    }
  }, [code, language, mode]);

  // ─────────────────────────────────────────────
  // ACTION: Convert to Pseudocode
  // ─────────────────────────────────────────────
  const handlePseudocode = useCallback(async () => {
    if (!validateCode()) return;

    setFeatureLoading('pseudocode', true);
    setError(null);
    setActiveTab('pseudocode');

    try {
      const data = await convertToPseudocode(code, language, mode);
      setFeatureResult('pseudocode', data);
    } catch (err) {
      setError(err);
    } finally {
      setFeatureLoading('pseudocode', false);
    }
  }, [code, language, mode]);

  // ─────────────────────────────────────────────
  // ACTION: Detect Confusion
  // ─────────────────────────────────────────────
  const handleConfusion = useCallback(async () => {
    if (!validateCode()) return;

    setFeatureLoading('confusion', true);
    setError(null);
    setActiveTab('confusion');

    try {
      const data = await detectConfusion(code, language, mode);
      setFeatureResult('confusion', data);
    } catch (err) {
      setError(err);
    } finally {
      setFeatureLoading('confusion', false);
    }
  }, [code, language, mode]);

  // ─────────────────────────────────────────────
  // ACTION: Send Follow-up Chat Message
  // ─────────────────────────────────────────────
  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim() || !code.trim()) return;

    const question = chatInput.trim();
    setChatInput('');

    // Add user message to chat immediately (optimistic update)
    const userMessage = { role: 'user', content: question };
    setChatMessages(prev => [...prev, userMessage]);

    setFeatureLoading('followup', true);

    try {
      const data = await askFollowup(
        code,
        question,
        language,
        mode,
        chatMessages // Pass conversation history for context
      );

      // Add AI response to chat
      const aiMessage = {
        role: 'assistant',
        content: data.answer,
        relatedConcepts: data.related_concepts,
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      // Add error message to chat
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I couldn't answer that. ${err.message}`,
          isError: true,
        },
      ]);
    } finally {
      setFeatureLoading('followup', false);
    }
  }, [chatInput, code, language, mode, chatMessages]);

  // ─────────────────────────────────────────────
  // ACTION: Clear everything and start fresh
  // ─────────────────────────────────────────────
  const handleClear = useCallback(() => {
    setCode('');
    setResults({ explain: null, improve: null, pseudocode: null, confusion: null });
    setError(null);
    setChatMessages([]);
    setChatInput('');
  }, []);

  // ─────────────────────────────────────────────
  // Return everything the components need
  // ─────────────────────────────────────────────
  return {
    // State
    code, setCode,
    language, setLanguage,
    mode, setMode,
    activeTab, setActiveTab,
    loading,
    results,
    error, setError,
    chatMessages,
    chatInput, setChatInput,

    // Actions
    handleExplain,
    handleImprove,
    handlePseudocode,
    handleConfusion,
    handleSendChat,
    handleClear,
  };
}
