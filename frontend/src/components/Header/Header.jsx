import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/StreamUp.svg';
import LogoutBtn from './LogoutBtn';
import { Menu, Search, User, X } from 'lucide-react';
import ErrorDisplay from '../util/ErrorDisplay';

const Button = ({ children, onClick, className = '', variant = 'default' }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

function Header({ onSearch }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef(null);
  const [error, setError] = useState(null);

  const avatar = userData?.avatar || '';
  const fullName = userData?.fullName || 'User';

  const navLinks = [
    {
      name: 'Explore',
      link: '/videos',
      active: authStatus,
    },
    {
      name: 'Login',
      link: '/login',
      active: !authStatus,
    },
    {
      name: 'Register',
      link: '/signup',
      active: !authStatus,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    if (userData) {
      navigate(`/user-dashboard`);
      setIsMenuOpen(false)
    } else {
      navigate('/login');
      setIsMenuOpen(false)
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
      onSearch(searchQuery);
      setHasSearched(true);
      navigate('/videos')
  
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchRef.current?.querySelector('input')?.focus(), 300);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-gray-box border-b-2 border-gray-400/10 p-1">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="StreamUp Logo" className="h-7 w-auto mr-8" />
          </Link>

          <div className="flex-grow flex items-center justify-end space-x-4">
            {authStatus && (
              <div ref={searchRef} className="relative flex-grow max-w-md overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: isSearchOpen ? '100%' : '40px' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-center justify-end"
                >
                  <motion.form
                    onSubmit={handleSearch}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isSearchOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="relative flex items-center w-full"
                  >
                    <input
                      type="search"
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2 pl-10 pr-10 rounded-full bg-background-all text-white placeholder-gray-400 focus:outline-none shadow-inner border-2 border-gray-400/20"
                      aria-label="Search videos"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                        aria-label="Clear search"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </motion.form>
                  <motion.button
                    onClick={isSearchOpen ? handleSearch : toggleSearch}
                    className={`p-2 rounded-full focus:outline-none absolute right-2 ${!isSearchOpen && 'hover:bg-gray-700'}`}
                    animate={{ 
                      rotate: isSearchOpen ? 360 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Search className="text-white" size={20} />
                  </motion.button>
                </motion.div>
              </div>
            )}

            <nav className="flex items-center space-x-4">
              {navLinks.map(
                (item) =>
                  item.active && (
                    <Button key={item.name} variant="ghost" onClick={() => (navigate(item.link))}>
                      {item.name}
                    </Button>
                  )
              )}
            </nav>

            {authStatus && (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative h-10 w-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {avatar ? (
                    <img src={avatar} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-600 flex items-center justify-center text-white">
                      <User size={24} />
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background-all ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button
                          className="block px-4 py-3 text-sm text-white hover:bg-gray-box w-full text-left"
                          onClick={handleProfileClick}
                        >
                          Dashboard
                        </button>
                        <div className="px-4 py-2 text-sm text-white hover:bg-gray-box">
                          <LogoutBtn />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

      </div>
      {error!==null && <ErrorDisplay errorMessage={error} onClose={()=>setError(null)}/>}
    </header>
  );
}

export default Header;