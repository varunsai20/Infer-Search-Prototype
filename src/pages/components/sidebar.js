import React from 'react';
import './sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h3 className="ArticleType">Filters</h3>

      {/* Text Availability Filters */}
      <div className="filter-section">
        <h3 className='ArticleType'>Text Availability</h3>
        <div className="filter">
          <input type="checkbox" id="abstract" />
          <label htmlFor="abstract">Abstract</label>
        </div>
        <div className="filter">
          <input type="checkbox" id="free-full-text" />
          <label htmlFor="free-full-text">Free full text</label>
        </div>
        <div className="filter">
          <input type="checkbox" id="full-text" />
          <label htmlFor="full-text">Full text</label>
        </div>
      </div>

      {/* Article Attribute Filters */}
      {/* <div className="filter-section">
        <h3 className="ArticleType">Article Attribute</h3>
        <div className="filter">
          <input type="checkbox" id="associated-data" />
          <label htmlFor="associated-data">Associated data</label>
        </div>
      </div> */}

      {/* Article Type Filters */}
      <div className="filter-section">
        <h3 className="ArticleType">Article Type</h3>
        <div className="filter">
          <input type="checkbox" id="books-documents" />
          <label htmlFor="books-documents">Books and Documents</label>
        </div>
        <div className="filter">
          <input type="checkbox" id="clinical-trial" />
          <label htmlFor="clinical-trial">Clinical Trial</label>
        </div>
        <div className="filter">
          <input type="checkbox" id="meta-analysis" />
          <label htmlFor="meta-analysis">Meta-Analysis</label>
        </div>
        {/* <div className="filter">
          <input type="checkbox" id="randomized-controlled-trial" />
          <label htmlFor="randomized-controlled-trial">Randomized Controlled Trial</label>
        </div>
        <div className="filter">
          <input type="checkbox" id="review" />
          <label htmlFor="review">Review</label>
        </div>
        <div className="filter">
          <input type="checkbox" id="systematic-review" />
          <label htmlFor="systematic-review">Systematic Review</label>
        </div> */}
      </div>

      {/* Publication Date Filters */}
      <div className="filter-section">
        <h3 className="ArticleType">Publication Date</h3>
        <div className="filter">
          <input type="checkbox" id="one-year" />
          <label htmlFor="one-year">1 year</label>
        </div>
        <div className="filter">
          <input type="checkbox" id="five-years" />
          <label htmlFor="five-years">5 years</label>
        </div>
        <div className="filter">
          <input type="checkbox" id="ten-years" />
          <label htmlFor="ten-years">10 years</label>
        </div>
        {/* <div className="filter">
          <label htmlFor="custom-range">Custom Range:</label>
          <input type="date" id="start-date" className="date-input" placeholder="Start Date" />
          <input type="date" id="end-date" className="date-input" placeholder="End Date" />
        </div> */}
      </div>
    </div>
  );
}

export default Sidebar;
