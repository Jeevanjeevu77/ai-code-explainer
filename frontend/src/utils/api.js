/**
 * utils/api.js
 * =============
 * This file handles all communication between our React frontend
 * and the FastAPI backend.
 *
 * We use axios (a popular HTTP library) to make API calls.
 * All our API functions are async - they return Promises.
 */

import axios from 'axios';

// Create an axios instance with default settings
// All requests will have these base settings
const apiClient = axios.create({
  baseURL: '/api',           // All requests go to /api/... (proxied to FastAPI)
  timeout: 60000,            // 60 second timeout (AI can be slow!)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────
// Request interceptor - runs before every request
// Great for logging or adding auth headers
// ─────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// Response interceptor - runs after every response
// Handles errors in a consistent way
// ─────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,  // Success: just return the response
  (error) => {
    // Extract useful error info
    const errorInfo = {
      message: error.response?.data?.detail?.detail || 
               error.response?.data?.detail || 
               error.message || 
               'Unknown error occurred',
      suggestion: error.response?.data?.detail?.suggestion || 
                  'Please try again or check your API key.',
      status: error.response?.status,
    };
    
    console.error('❌ API Error:', errorInfo);
    return Promise.reject(errorInfo);
  }
);


/**
 * Explain code - the main feature
 * @param {string} code - The source code to explain
 * @param {string} language - Programming language
 * @param {string} mode - 'beginner' or 'intermediate'
 */
export async function explainCode(code, language, mode) {
  const response = await apiClient.post('/explain', { code, language, mode });
  return response.data;
}


/**
 * Improve code - get suggestions to make code better
 */
export async function improveCode(code, language, mode) {
  const response = await apiClient.post('/improve', { code, language, mode });
  return response.data;
}


/**
 * Convert to pseudocode - plain English version of the algorithm
 */
export async function convertToPseudocode(code, language, mode) {
  const response = await apiClient.post('/pseudocode', { code, language, mode });
  return response.data;
}


/**
 * Detect confusing parts in code
 */
export async function detectConfusion(code, language, mode) {
  const response = await apiClient.post('/confusion', { code, language, mode });
  return response.data;
}


/**
 * Ask a follow-up question about the code
 * @param {string} code - The code being discussed
 * @param {string} question - The user's question
 * @param {string} language - Programming language
 * @param {string} mode - Explanation mode
 * @param {Array} conversationHistory - Previous messages for context
 */
export async function askFollowup(code, question, language, mode, conversationHistory = []) {
  const response = await apiClient.post('/followup', {
    code,
    question,
    language,
    mode,
    conversation_history: conversationHistory,
  });
  return response.data;
}
