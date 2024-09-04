import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, Grid } from '@mui/material';
import Chatbot from './components/chatbot'; // Import the Chatbot component
import './articleResult.css';

function ArticleResult() {
  const { pmid } = useParams(); // Get the PMID from the URL
  const location = useLocation(); // Access the passed state
  const navigate = useNavigate(); // Hook for navigation
  const { data } = location.state || { data: [] }; // Default to an empty array if no data
  const searchTerm = location.state?.searchTerm || '';
  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    // Find the article that matches the PMID
    const article = data.Articles.find((item) => item.PMID === pmid);

    if (article) {
      setArticleData(article); // Set the matched article data
    } else {
      // If not found, you can either fetch from an API or handle the error
      console.error('Article not found for the given PMID');
    }
  }, [pmid, data]);


  const italicizeTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <i key={index} className="italic" color='primary' display='flex'>
          {part}
        </i>
      ) : (
        part
      )
    );
  };

  return (
    <>
    {articleData ? (<Container id="articleContainer" maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box id="searchResults">
            <Paper elevation={2} className="paperContent" style={{ marginBottom: '10px' }}>
              <Typography variant="body2" color="textSecondary" className="typographyRow-articles">
                {`PMID: ${articleData.PMID}`}
              </Typography>
              <Typography variant="subtitle1" className="typographyRow-articles">
                <strong>Title:</strong> {italicizeTerm(articleData.TITLE)}
              </Typography>
              <Typography variant="subtitle1" className="typographyRow-articles">
                <strong>Purpose/Background:</strong> {italicizeTerm(articleData.INTRODUCTION)}
              </Typography>
              <Typography variant="subtitle1" className="typographyRow-articles">
                <strong>Methods:</strong> {italicizeTerm(articleData.METHODS)}
              </Typography>
              <Typography variant="subtitle1" className="typographyRow-articles">
                <strong>Results/Findings:</strong> {italicizeTerm(articleData.RESULTS)}
              </Typography>
              <Typography variant="subtitle1" className="typographyRow-articles">
                <strong>Conclusion:</strong> {italicizeTerm(articleData.CONCLUSION)}
              </Typography>
              <Typography variant="subtitle1" className="typographyRow-articles">
                <strong>Keywords:</strong> {italicizeTerm(articleData.KEYWORDS)}
              </Typography>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Chatbot /> {/* Add the Chatbot component here */}
        </Grid>
      </Grid>
    </Container>) : (
          <div className="data-not-found-container-article">
            <div className="data-not-found">
              <h2>Data Not Found</h2>
              <p>We couldn't find any data matching your search. Please try again with different keywords.</p>
            </div>
          </div>
        )
    }
    </>
  );
}

export default ArticleResult;
