import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Landing from './pages/Landing';
import Signup from './pages/Signup'


function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [uwuCode, setUwuCode] = useState('');
  const [remaining, setRemaining] = useState(2);
  const navigate = useNavigate();

  // Add session check on mount
  useEffect(() => {
    axios.get('http://localhost:5000/check-auth', { 
      withCredentials: true 
    }).then(res => {
      setRemaining(res.data.remaining);
    }).catch(console.error);
  }, []);

  // Update handleGenerate function
  const handleGenerate = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/generate', 
        { userPrompt: prompt },
        { withCredentials: true }
      );
      
      setUwuCode(response.data.uwuCode);
      setRemaining(response.data.remaining);
      
      // Handle code extraction from markers
      const codeBlock = response.data.uwuCode
        .split('=== Begin UwU Code ===')[1]
        ?.split('=== End UwU Code ===')[0]
        ?.trim();
      
      setUwuCode(codeBlock || response.data.uwuCode);
      
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      console.error('Generation error:', error);
    }
  };


  return (
    <div className="generator-container">
      <div className="usage-counter">
        {remaining === -1 ? 
          '✨ Premium Access' : 
          `Free uses remaining: ${Math.max(remaining, 0)}/2`
        }
      </div>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
      />
      
      <button onClick={handleGenerate}>
        Generate Code
      </button>
      
      {uwuCode && (
        <SyntaxHighlighter language="python" style={atomOneDark}>
          {uwuCode.split('=== Begin UwU Code ===')[1]?.split('=== End UwU Code ===')[0] || uwuCode}
        </SyntaxHighlighter>
      )}
    </div>
  );
}

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/login', credentials, {
        withCredentials: true
      });
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/home" element={<Landing/>} />
        <Route path="/" element={<CodeGenerator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
