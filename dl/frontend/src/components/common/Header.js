import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import SearchModal from '../search/SearchModal';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🛍️ E-Shop
          </Link>
          
          <nav className="nav">
            <Link to="/" className={isActive('/')}>
              Home
            </Link>
            <Link to="/products" className={isActive('/products')}>
              Products
            </Link>
          </nav>

          <div className="header-actions">
            <button 
              className="search-btn"
              onClick={() => setShowSearchModal(true)}
              title="Search products"
            >
              🔍
            </button>

            <Link to="/cart" className="cart-icon">
              🛒
              {itemCount > 0 && (
                <span className="cart-count">{itemCount}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <button 
                  className="user-avatar"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span className="user-initials">{getUserInitials()}</span>
                  )}
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <p className="user-name">{user?.name}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                    <hr />
                    <button className="dropdown-item" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowLoginModal(true)}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        navigate={navigate}
      />
    </header>
  );
};

export default Header;