import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [uwuCode, setUwuCode] = useState('');
  const [fetchData, setFetchData] = useState([]);

  // Fetch chat history when the component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/post/getpost`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFetchData(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  // Update handleGenerate function
  const handleGenerate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/post/generate`, 
        { userPrompt: prompt },
        { headers: {
          Authorization: `Bearer ${token}`,
        }}
      );

      if (response) {
        setFetchData(prevData => [...prevData, response.data]); // Add new response to chat history
        setPrompt('');
      }

      setUwuCode(response.data.uwuCode);

      // Handle code extraction from markers
      const codeBlock = response.data.content
        .split('=== Begin UwU Code ===')[1]
        ?.split('=== End UwU Code ===')[0]
        ?.trim();

      setUwuCode(codeBlock || response.data.uwuCode);
      
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Failed to generate code');
      }
      console.error('Generation error:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="generator-container">
      

      {/* {uwuCode && (
        <SyntaxHighlighter language="python" style={atomOneDark}>
          {uwuCode.split('=== Begin UwU Code ===')[1]?.split('=== End UwU Code ===')[0] || uwuCode}
        </SyntaxHighlighter>
      )} */}

      
      <div className="chat-history">
        {fetchData.map((item, index) => (
          <div key={index} className="chat-item">
            <h3>Input:</h3>
            <p>{item.input}</p>
            <h3>Content:</h3>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => copyToClipboard(item.content)} 
                style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}
              >
                Copy
              </button>
              <SyntaxHighlighter language="python" style={atomOneDark}>
                {item.content}
              </SyntaxHighlighter>
            </div>
            <hr />
          </div>
        ))}
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
      />
      
      <button onClick={handleGenerate}>
        Generate Code
      </button>
    </div>
  );
};

export default Chat;