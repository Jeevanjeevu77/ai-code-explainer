<<<<<<< HEAD
# 🤖 AI Code Explainer

> **Paste any code → Get a beginner-friendly explanation instantly!**

A full-stack web application that uses AI to explain code in simple terms, detect confusing patterns, suggest improvements, and let you chat with your code.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📖 **Explain Code** | Get a simple overview + line-by-line breakdown |
| 🔧 **Improve Code** | AI suggests cleaner, better versions of your code |
| 📝 **Pseudocode** | Convert code to plain English step-by-step |
| 🔍 **Confusion Detector** | Find the hardest parts and get clearer explanations |
| 💬 **Ask AI** | Chat with AI about your specific code |
| 🌱 **Beginner Mode** | Explain like I'm 10 years old |
| ⚡ **Intermediate Mode** | Technical explanations with proper terminology |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Python + FastAPI
- **AI**: OpenAI GPT-4o-mini (or any OpenAI-compatible API)
- **Styling**: Pure CSS with CSS variables

---

## 📁 Project Structure

```
ai-code-explainer/
│
├── backend/                    # FastAPI Python backend
│   ├── main.py                 # App entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment variable template
│   ├── Dockerfile
│   │
│   ├── models/
│   │   └── schemas.py          # Pydantic data models (request/response shapes)
│   │
│   ├── services/
│   │   └── ai_service.py       # AI integration + prompt engineering
│   │
│   └── routers/
│       ├── explain.py          # POST /api/explain
│       ├── improve.py          # POST /api/improve
│       ├── pseudocode.py       # POST /api/pseudocode
│       └── confusion.py        # POST /api/confusion
│
├── frontend/                   # React + Vite frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   │
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Root component
│       │
│       ├── styles/
│       │   └── global.css      # Global styles + CSS variables
│       │
│       ├── hooks/
│       │   └── useCodeAnalysis.js   # Custom hook: all state + API calls
│       │
│       ├── utils/
│       │   └── api.js          # Axios API client
│       │
│       └── components/
│           ├── Header.jsx           # Top nav + mode toggle
│           ├── CodeEditor.jsx       # Code input + action buttons
│           ├── ResultsTabs.jsx      # Tab navigation
│           ├── ExplainResult.jsx    # Explanation display
│           ├── ImproveResult.jsx    # Improvement suggestions
│           ├── PseudocodeResult.jsx # Pseudocode display
│           ├── ConfusionResult.jsx  # Confusion analysis
│           ├── ChatPanel.jsx        # Follow-up chat
│           ├── ErrorBanner.jsx      # Error display
│           └── LoadingSkeleton.jsx  # Loading placeholder
│
├── docker-compose.yml          # Run everything with one command
└── README.md                   # You are here!
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+ installed
  - *Note for Windows: If `python` is not recognized, install it via the Microsoft Store.*
- Node.js 18+ installed 
- An OpenAI API key ([get one here](https://platform.openai.com/api-keys))

---

### Method 1: Manual Setup (Recommended for Learning)

#### Step 1: Clone or download the project
```bash
# If using git:
git clone <your-repo-url>
cd ai-code-explainer

# Or just unzip the downloaded folder and navigate into it
```

#### Step 2: Set up the Backend

```bash
# Navigate to the backend folder
cd backend

# Create a virtual environment (This creates the 'venv' folder)
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\Activate.ps1   # If this fails, try: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# Install Python packages
pip install -r requirements.txt

# Create your .env file from the template
cp .env.example .env
```

Now open the `.env` file in any text editor and add your API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
AI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

#### Step 3: Start the Backend
```bash
# Make sure you're in the backend/ folder with venv activated
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Visit http://localhost:8000/docs to see the interactive API documentation! 🎉

#### Step 4: Set up the Frontend (in a NEW terminal)

```bash
# Navigate to the frontend folder
cd frontend

# Install Node.js packages
npm install

# Start the development server
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in XXX ms
  ➜  Local:   http://localhost:3000/
```

#### Step 5: Open the App!
Visit **http://localhost:3000** in your browser 🎉

---

### Method 2: Docker (Easiest - requires Docker Desktop)

```bash
# 1. Create your .env file in the root folder
echo "OPENAI_API_KEY=sk-your-key-here" > .env

# 2. Start everything with one command!
docker-compose up

# 3. Open http://localhost:3000
```

To stop: `Ctrl+C` then `docker-compose down`

---

## 🧪 Sample Test Inputs

### Python - Fibonacci
```python
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

### JavaScript - Async/Await
```javascript
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
```

### Python - List Comprehension (great for confusion detection!)
```python
matrix = [[1,2,3],[4,5,6],[7,8,9]]
flat = [num for row in matrix for num in row if num % 2 == 0]
```

---

## 🔌 Using Other AI Providers

You can use any OpenAI-compatible API. Just update your `.env`:

### Groq (free, very fast)
```
OPENAI_API_KEY=gsk_your-groq-key
OPENAI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.1-8b-instant
```

### OpenRouter (access many models)
```
OPENAI_API_KEY=sk-or-your-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

### Local Ollama (completely free, runs on your computer)
```bash
# First install Ollama from ollama.ai and pull a model:
ollama pull llama3.2

# Then in .env:
OPENAI_API_KEY=ollama
OPENAI_BASE_URL=http://localhost:11434/v1
AI_MODEL=llama3.2
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `OPENAI_API_KEY not found` | Make sure you created `.env` in the `backend/` folder |
| `Connection refused` on frontend | Make sure the backend is running on port 8000 |
| `npm install` fails | Make sure Node.js 18+ is installed |
| `pip install` fails | Make sure Python 3.10+ is installed and venv is activated |
| AI gives weird responses | Try a more capable model like `gpt-4o` |
| `python` not recognized | Install Python from the Microsoft Store and restart your terminal |
| `Scripts\Activate.ps1` error | Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process` |
| 401 Unauthorized | Your API key is wrong or expired |
| 429 Too Many Requests | You've hit rate limits, wait a moment |

---

## 🚀 Future Improvements

- [ ] Add Monaco Editor for proper syntax highlighting
- [ ] Support file upload (.py, .js, .java files)
- [ ] Save explanation history
- [ ] Export explanations as PDF
- [ ] Multiple language comparison (same algorithm in Python vs JS)
- [ ] Voice explanation (text-to-speech)
- [ ] Share explanations via URL
- [ ] VS Code extension

---

## 📚 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
=======
# ai-code-explainer
>>>>>>> cadd62b0325bf31593df9691d8b63546603050d3
