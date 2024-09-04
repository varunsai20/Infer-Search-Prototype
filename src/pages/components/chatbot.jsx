import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import './chatbot.css';

function Chatbot() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const { pmid } = useParams(); // Get the PMID from the URL
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null); // Ref for the last message element

  const handleSearch = () => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 30000); // 30 seconds

    axios
      .post('http://13.232.196.47:80/generateanswer', {
        question: query, // The question input from the user
        pmid: pmid, // The PMID from the URL
      })
      .then((response) => {
        console.log(response);
        console.log(response.data.Answer);
        const data = response.data.Answer; // Assuming the API response contains a 'Answer' property
        setResponse(data);
        clearTimeout(timeoutId);
        setLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        setLoading(false);
        console.error('Error fetching data from the API', error);
      });
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      // Scroll to the last message element
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]); // Run this effect whenever `response` changes

  return (
    <>
      <Box className="chatbot-container">
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
          {loading ? <CircularProgress size={24} color='white' /> : 'Search'}
        </Button>
      </Box>
      
        {response && (
          <div
          className="response-container"
           // Adjust height and overflow as needed
        >
            <Typography variant="body1" className="chatbot-response">
            {response}
          </Typography>
        
        {/* Add a dummy element to scroll into view */}
        <div ref={endOfMessagesRef} />
      </div>
      )}
    </>
  );
}

export default Chatbot;
