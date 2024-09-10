import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Typography, Paper, Box, Grid } from '@mui/material';
import Chatbot from './components/chatbot'; // Import the Chatbot component
import './articleResult.css';

function ArticleResult() {
  const { pmid } = useParams(); // Get the PMID from the URL
  const location = useLocation(); // Access the passed state
  const { data } = location.state || { data: [] }; // Default to an empty array if no data
  const searchTerm = location.state?.SEARCHTERM || '';
  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    // Find the article that matches the PMID
    const article = data.articles.find((item) => item.PMID === pmid);

    if (article) {
      setArticleData(article); // Set the matched article data
    } else {
      console.error('Article not found for the given PMID');
    }
  }, [pmid, data]);

  const italicizeTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <i key={index} className="italic" color="primary" display="flex">
          {part}
        </i>
      ) : (
        part
      )
    );
  };

  // Predefined field order
  const predefinedOrder = ['PMID', 'TITLE', 'INTRODUCTION', 'METHODS', 'RESULTS', 'CONCLUSION', 'KEYWORDS'];

  // Create a mapping between data fields and user-friendly labels
  const fieldMappings = {
    TITLE: 'Title',
    INTRODUCTION: 'Purpose/Background',
    METHODS: 'Methods',
    RESULTS: 'Results/Findings',
    CONCLUSION: 'Conclusion',
    KEYWORDS: 'Keywords',
    PMID: 'PMID',
  };

  return (
    <>
      {articleData ? (
        <Container id="articleContainer" maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box id="searchResults">
                <Paper elevation={2} className="paperContent" style={{ marginBottom: '10px' }}>
                  {/* Render predefined fields in order */}
                  {predefinedOrder.map((key) => (
                    articleData[key] && (
                      <Typography key={key} variant="subtitle1" className="typographyRow-articles">
                        <strong>{fieldMappings[key] || key}:</strong> {italicizeTerm(articleData[key])}
                      </Typography>
                    )
                  ))}

                  {/* Render any additional fields not in predefinedOrder */}
                  {Object.keys(articleData).map((key) => 
                    !predefinedOrder.includes(key) && (
                      <Typography key={key} variant="subtitle1" className="typographyRow-articles">
                        <strong>{fieldMappings[key] || key}:</strong> {italicizeTerm(articleData[key])}
                      </Typography>
                    )
                  )}
                </Paper>
              </Box>
            </Grid>
          </Grid>
          <Chatbot /> {/* Add the Chatbot component here */}
        </Container>
      ) : (
        <div className="data-not-found-container-article">
          <div className="data-not-found">
            <h2>Data Not Found</h2>
            <p>We couldn't find any data matching your search. Please try again with different keywords.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ArticleResult;
