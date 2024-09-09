import React, { useState , useEffect} from 'react';
import { Autocomplete, TextField, Container, Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate ,useLocation} from 'react-router-dom';
import './searchbar.css';  
import terms from '../../final_cleaned_terms_only.json';

const SearchBar = ({ isSearchResultsPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/search") {
      // Check if searchTerm is present in sessionStorage
      const storedSearchTerm = sessionStorage.getItem('SearchTerm');
      if (storedSearchTerm) {
        setSearchTerm(storedSearchTerm);
        handleSearch(null, storedSearchTerm); // Populate suggestions based on the stored term
      }
    } else {
      // Clear session storage when not on the search page
      sessionStorage.removeItem('SearchTerm');
    }
  }, [location.pathname]);
  const handleSearch = (event, value) => {
    setSearchTerm(value);
    if (value) {
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
      setLoading(true);
      sessionStorage.setItem("SearchTerm", searchTerm);
      const timeoutId = setTimeout(() => {
        setLoading(false);
        navigate('/search', { state: { data: [], searchTerm } });
      }, 30000); // 30 seconds
      const postUrl = 'http://169.254.169.254/latest/meta-data/public-ipv4';
      console.log(`Making POST request to: ${postUrl}`);
      axios
        .post({postUrl}+'/query', { query: searchTerm })
        .then((response) => {
          console.log(response)
          console.log(postUrl)
          console.log(response.data.Articles)
          // sessionStorage.setItem("SearchTerm", searchTerm);
          const data = response.data; // Assuming the API response contains a 'results' array
          setResults(data);
          // Navigate to SearchPage and pass data via state
          navigate('/search', { state: { data, searchTerm } });
          clearTimeout(timeoutId);
          setLoading(false);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          setLoading(false);
          navigate('/search', { state: { data: [], searchTerm } });
          console.error('Error fetching data from the API', error);
        });
    }
  };
  console.log(results)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      className={`container ${isSearchResultsPage ? 'search-results-container' : ''}`}
    >
      <Box display="flex" justifyContent="center" width="100%">
        <Autocomplete
          freeSolo
          options={results}
          onInputChange={handleSearch}
          
          inputValue={searchTerm}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Search" 
              variant="outlined" 
              fullWidth 
              onKeyDown={handleKeyDown}
              className="custom-textfield" // Apply custom class
            />
          )}
          className="autocomplete"
        />
        <Button 
          onClick={handleButtonClick} 
          variant="contained" 
          className="MuiButtonBase-root"
          disabled={loading}  // Disable button while loading
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>
    </Container>
  );
};

export default SearchBar;
