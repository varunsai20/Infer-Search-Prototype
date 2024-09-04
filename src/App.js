import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './pages/homepage';
import Searchpage from './pages/searchpage';
import Navbar from './pages/components/navbar';
import ArticleResult from './pages/articleResult';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar />
          <Routes>
            {/* Route for the homepage */}
            <Route path="/" element={<Homepage />} />

            {/* Route for the search page */}
            <Route path="/search" element={<Searchpage />} />

            {/* Route for article results */}
            <Route path="/article/:pmid" element={<ArticleResult />} />

            {/* Redirect to search page for undefined routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
