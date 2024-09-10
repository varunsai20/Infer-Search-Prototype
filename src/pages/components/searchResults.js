import React,{useEffect} from 'react';
import './searchresults.css';
import { useLocation,useNavigate  } from 'react-router-dom';
import { Container, Typography, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function SearchResults() {
  const location = useLocation(); // Access the passed state
  const { data } = location.state || { data: [] }; // Default to empty array if no data
  const searchTerm = location.state?.searchTerm || '';
  const navigate = useNavigate();
  console.log(data)
  useEffect(() => {
    // Clear session storage for chatHistory when the location changes
    sessionStorage.removeItem('chatHistory');
  }, [location]);
  // Function to italicize the search term in the text
  const italicizeTerm = (text) => {
    // Ensure text is a string
    if (!text) return ''; // If text is null or undefined, return an empty string
    if (!searchTerm) return text; // If searchTerm is not provided, return the text as is
  
    // Create a regular expression to find the search term, case-insensitive
    const regex = new RegExp(`(${searchTerm})`, 'gi');
  
    // Replace the matched term with a span element styled to display italics
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <i key={index} className="italic" style={{ color: 'primary', display: 'inline-flex' }}>
          {part}
        </i>
      ) : (
        part
      )
    );
  };
  const handleNavigate = (pmid) => {
    navigate(`/article/${pmid}`, { state: { data: data, searchTerm } });
  };
  
  return (
    <>
      <Container id="searchContainer" maxWidth="md">
      <Box id="searchResults">
        {data.articles && data.articles.length > 0 ? (
          data.articles.map((result, index) => (
            <Paper
              key={index}
              elevation={2}
              className="paperContent"
              style={{ marginBottom: '10px' }}
            >
              <Typography variant="h6" color="primary" className="typographyRow Typography-Title">
            <span
                    onClick={() => handleNavigate(result.PMID)} // Use onClick handler
                    className="link"
                    style={{ cursor: 'pointer', textDecoration: 'none' }} // Styling to make it look like a link
                  >
                    {italicizeTerm(result.TITLE)}
                  </span>
          </Typography>
            <Typography
                variant="body2"
                color="textSecondary"
                className="typographyRow"
              >
                {`PMID: ${result.PMID}`}
              </Typography>
              <Typography variant="subtitle1" className="typographyRow-articles">
                {italicizeTerm(result.INTRODUCTION)}
              </Typography>
             
            </Paper>
          ))
        ) : (
          <div className="data-not-found-container">
            <div className="data-not-found">
              <h2>Data Not Found</h2>
              <p>We couldn't find any data matching your search. Please try again with different keywords.</p>
            </div>
          </div>
        )}
      </Box>
    </Container>
    </>
  );
}

export default SearchResults;
