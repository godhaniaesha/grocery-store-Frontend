import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/denisha.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCurrency, selectCurrency, selectCurrencySymbol } from '../redux/slices/currency.Slice';
import { Link } from 'react-router-dom';

const FastKartHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
const selectedCurrency = useSelector(selectCurrency);
const currencySymbol = useSelector(selectCurrencySymbol);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCurrencySelect = (currency) => {
    dispatch(setSelectedCurrency(currency));
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="navbar a_fastkart_header a_header_container" style={{ backgroundColor: '#0F7542' }}>
      <div className="container-fluid py-1 d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <Link className="text-white me-3 text-decoration-none" to={"/seller/seller-register"}>Sell on FastKart</Link>
          <a className="text-white text-decoration-none" href="#">Download App</a>
        </div>
        <div className="position-relative" ref={dropdownRef}>
          <button
            className="btn btn-link text-white text-decoration-none d-flex align-items-center"
            type="button"
            onClick={toggleDropdown}
            style={{ padding: 0 }}
          >
            {selectedCurrency}
            <FaChevronDown className={`ms-1 transition ${dropdownOpen ? 'rotate-180' : ''}`} style={{ transition: 'transform 0.3s ease-in-out' }} />
          </button>
          {dropdownOpen && (
            <ul className="position-absolute bg-white shadow p-2" style={{ right: 0, minWidth: '120px', listStyle: 'none', zIndex: '1111' }}>
              {['USD', 'INR', 'Dirham', 'NZ Dollar'].map((currency) => (
                <li key={currency} className='py-1 fw-bold'>
                  <a className="dropdown-item" href="#" onClick={() => handleCurrencySelect(currency)}>
                    {currency}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default FastKartHeader;
