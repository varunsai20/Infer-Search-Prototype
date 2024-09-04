// src/SearchBar.js

import React, { useState } from 'react';
import { Autocomplete, TextField, Container, Typography, Box, Button, Paper } from '@mui/material';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './searchpageBaR.css';  // Import the CSS file
import terms from '../../final_cleaned_terms_only.json';
const SearchpageBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [apiResults, setApiResults] = useState([]);
  const navigate = useNavigate();  
  const handleSearch = (event, value) => {
    setSearchTerm(value);

    if (value) {
      // Filter the terms immediately without delay
      const filteredResults = terms.filter((term) =>
        term.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  const handleButtonClick = () => {
    if (searchTerm) {
      
      // Making a POST request with the search term
      axios
        .post('http://3.110.155.33:80/query', { query: searchTerm })
        .then((response) => {
          console.log(response.data.Articles)
          localStorage.setItem("SearchTerm", searchTerm);
          const data = response.data.Articles; // Assuming the API response contains a 'results' array
          setApiResults(data);
          // Navigate to SearchPage and pass data via state
          navigate('/search', { state: { data },searchTerm:{searchTerm} });
        })
        .catch((error) => {
          console.error('Error fetching data from the API', error);
        });
    }
  };

  return (
    <>
    <Container maxWidth="sm" className="container" id="barcontainer">
      
      <Box display="flex" justifyContent="center" width="100%">
        <Autocomplete
          freeSolo
          options={results}  // Directly use results without debounce delay
          onInputChange={handleSearch}
          renderInput={(params) => (
            <TextField 
            {...params} 
            label="Type to search..." 
            variant="outlined" 
            fullWidth 
            placeholder="Type to search..."  // Placeholder added here
          />
          )}
          className="autocomplete"
        />
        <Button onClick={handleButtonClick} variant="contained" className="MuiButtonBase-root">
          Search
        </Button>
      </Box>
      
    </Container>
    </>
    
  );
};

export default SearchpageBar;