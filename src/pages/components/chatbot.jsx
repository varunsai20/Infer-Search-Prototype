import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import './chatbot.css';
import ReactMarkdown from 'react-markdown';

function Chatbot() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const { pmid } = useParams();
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);
  const [chatHistory, setChatHistory] = useState(() => {
    const storedHistory = sessionStorage.getItem('chatHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const handleSearch = () => {
    if (!query) return;

    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 30000);

    axios
      .post('https://brq27bqgcc.execute-api.ap-south-1.amazonaws.com/generateanswer', {
        question: query,
        pmid: pmid,
      })
      .then((response) => {
        const data = response.data.Answer;
        setResponse(data);

        const newChatHistory = [...chatHistory, { query, response: data }];
        setChatHistory(newChatHistory);

        sessionStorage.setItem('chatHistory', JSON.stringify(newChatHistory));

        setQuery('');
        setLoading(false);
        clearTimeout(timeoutId);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        setLoading(false);
        console.error('Error fetching data from the API', error);
      });
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('chatHistory');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="chatbot-container">
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          label="Ask a Question"
          variant="outlined"
          fullWidth
          className="chatbot-input"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          className="chatbot-button"
        >
          {loading ? <CircularProgress size={24} color="white" /> : 'Search'}
        </Button>
      </div>

      <>
        {chatHistory.map((chat, index) => (
          <React.Fragment key={index}>
            <Box className="query-container-box">
              <div className="query-container">
                <Typography variant="body1" className="query-response">
                  {chat.query}
                </Typography>
                <div ref={endOfMessagesRef} />
              </div>
            </Box>

            <div className="response-container">
              <ReactMarkdown variant="body1" className="chatbot-response">
                {chat.response}
              </ReactMarkdown>
            </div>
          </React.Fragment>
        ))}
      </>
    </>
  );
}

export default Chatbot;
