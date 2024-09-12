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
    const newChatEntry = { query, response: '' };
    setChatHistory((chatHistory) => [...chatHistory, newChatEntry]);
    const bodyData = JSON.stringify({
      question: query,
      pmid: pmid,
    });
    fetch('http://13.127.207.184:80/generateanswer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyData,
    })
      .then((response) => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const readStream = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              setLoading(false);
              console.log(chatHistory)
              sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));

              return;
            }

            // Decode chunk and append it to the cumulative response
            const chunk = decoder.decode(value, { stream: true });
            console.log(chunk)
            const jsonChunk = JSON.parse(chunk);
            const answer = jsonChunk.answer;
            setResponse(answer)
            setChatHistory((chatHistory) => {
              const updatedChatHistory = [...chatHistory];
              const lastEntryIndex = updatedChatHistory.length - 1;
              
              if (lastEntryIndex >= 0) {
                updatedChatHistory[lastEntryIndex] = {
                  ...updatedChatHistory[lastEntryIndex],
                  response: updatedChatHistory[lastEntryIndex].response + answer
                };
              }
            
              return updatedChatHistory;
            });
            
            if (endOfMessagesRef.current) {
              endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
            }

            // Continue reading the stream
            readStream();
          },50000);
        };

        readStream();
      })
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
