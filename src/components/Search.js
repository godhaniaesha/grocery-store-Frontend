import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/product.Slice';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      localStorage.setItem('searchQuery', searchQuery);
      localStorage.removeItem('selectedCategoryId');
      localStorage.removeItem('selectedSubCategoryIdfromheader');
      navigate('/Vegetable');
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    localStorage.setItem('searchQuery', searchQuery);
    localStorage.removeItem('selectedCategoryId');
    localStorage.removeItem('selectedSubCategoryIdfromheader');
    navigate('/Vegetable');
    setShowSuggestions(false);
  };

  // Define filteredProducts here, before using it in JSX
  const filteredProducts = products?.filter(product =>
    product?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  useEffect(() => {
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  }, []);
  return (
    <>
      <div className="d-none d-md-flex mx-sm-3 mx-1 flex-grow-1 justify-content-center">
        <div className="search-container position-relative" style={{ maxWidth: "600px", width: "100%" }}>
          <div className="input-group rounded-pill overflow-visible">
            <input
              type="text"
              className="form-control border-0 py-2 px-sm-3 px-1 custom-input bg-white"
              placeholder="Search for groceries..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="btn btn-light d-flex align-items-center justify-content-center px-sm-3 px-1" 
              type="button"
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
          </div>

          {showSuggestions && filteredProducts.length > 0 && (
            <div 
              className="suggestion-dropdown position-absolute start-0 w-100 bg-white border rounded mt-1 text-dark" 
              style={{ 
                zIndex: 9999,
                maxHeight: '300px', 
                overflowY: 'auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                top: 'calc(100% + 5px)'
              }}
            >
              {filteredProducts.map((product) => (
                <div 
                  key={product._id}
                  className="suggestion-item p-2 border-bottom hover:bg-gray-100"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'white'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  onClick={() => {
                    setSearchQuery(product.productName);
                    setShowSuggestions(false);
                  }}
                >
                  <div className="d-flex align-items-center">
                    <FaSearch className="me-2 text-muted" size={14} />
                    <span>{product.productName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;