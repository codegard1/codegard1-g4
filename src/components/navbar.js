import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';

const NavBar = ({ location, title }) => {
  // Create a hook to toggle the state variable
  const [isNavVisible, toggleNavVisibility] = useState(false);
  useEffect(() => {
    console.log(`effect! ${location.pathname}`);
    toggleNavVisibility(false);
  }, [location]);

  return (
    <nav id="navbar" className='navbar-container container'>
      <h2>
        <Link to='/' className='home-link' state={{ fromNav: true }}>
          {title}
        </Link>
      </h2>
      <button
        type="button"
        id='navbar-toggle'
        aria-controls='navbar-menu'
        aria-label='Toggle menu'
        aria-expanded={isNavVisible}
        onClick={e => toggleNavVisibility(!isNavVisible)}
      >
        <span className='icon-bar'></span>
        <span className='icon-bar'></span>
        <span className='icon-bar'></span>
      </button>

      {
        isNavVisible && (
          <div id='navbar-menu' aria-labelledby='navbar-toggle'>
            <ul className='navbar-links'>
              <li className='navbar-item'>
                <Link className='navbar-link' to='/'>
                  Blog
                </Link>
              </li>
              <li className='navbar-item'>
                <Link className='navbar-link' to='/tags'>
                  Tags
                </Link>
              </li>
              <li className='navbar-item'>
                <Link className='navbar-link' to='/blackjack'>
                  Blackjack
                </Link>
              </li>
              <li className='navbar-item'>
                <Link className='navbar-link' to='/gallery'>
                  Gallery
                </Link>
              </li>
              <li className='navbar-item'>
                <Link className='navbar-link' to='/music'>
                  Music
                </Link>
              </li>
              <li className='navbar-item'>
                <Link className='navbar-link' to='/contact'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )
      }
    </nav >
  );
};

export default NavBar;
