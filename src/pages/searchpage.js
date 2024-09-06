import React from 'react'
import Sidebar from './components/sidebar'
import SearchResults from './components/searchResults'
import Navbar from './components/navbar'
// import SearchpageBar from './components/searchpageBaR'
import SearchBar from './components/searchbar'

const searchpage = () => {
  return (
    <>
      
      <Sidebar />
      <SearchBar isSearchResultsPage={true}/>
      <SearchResults />
    </>
        
    
  )
}

export default searchpage