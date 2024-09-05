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
    // Retrieve the chat history from session storage when the component is mounted
    const storedHistory = sessionStorage.getItem('chatHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const handleSearch = () => {
    if (!query) return; // Do nothing if query is empty

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

        // Update chat history with the new query and response
        const newChatHistory = [...chatHistory, { query, response: data }];
        setChatHistory(newChatHistory);

        // Store the updated chat history in session storage
        sessionStorage.setItem('chatHistory', JSON.stringify(newChatHistory));

        setQuery(''); // Clear the input field
        setLoading(false);
        clearTimeout(timeoutId);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        setLoading(false);
        console.error('Error fetching data from the API', error);
      });
  };

  // UseEffect to clear sessionStorage on reload or exit
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear session storage when the user refreshes or leaves the page
      sessionStorage.removeItem('chatHistory');
    };

    // Add event listener for the beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      // Scroll to the last message element
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]); // Run this effect whenever chatHistory changes

  return (
    <>
      <div className="chatbot-container">
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
