import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useCart } from '../contexts/CartContext';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Calculate total items in cart
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠', active: location.pathname === '/' },
    { path: '/categories', label: 'Categories', icon: '📂', active: location.pathname === '/categories' },
    { path: '/plants', label: 'All Plants', icon: '🌱', active: location.pathname === '/plants' },
    { path: '/gallery', label: 'Gallery', icon: '🖼️', active: location.pathname === '/gallery' },
    { path: '/contact', label: 'Contact', icon: '📞', active: location.pathname === '/contact' },
  ];

  const adminItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', active: location.pathname === '/admin' },
  ];

  const slideIn = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.3 } }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const menuItemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.05, type: 'spring', stiffness: 300 }
    })
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-green-700/90 dark:bg-green-800/90 backdrop-blur-xl shadow-2xl'
            : 'bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700'
          }`}
      >
        <nav className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo - Premium Animated */}
            <Link
              to="/"
              className="group flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <motion.span
                className="text-2xl sm:text-3xl inline-block"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                🌿
              </motion.span>
              <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                HomeGarden
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                to="/"
                className="px-3 py-1.5 text-white/90 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
              >
                Home
              </Link>
              <Link
                to="/categories"
                className="px-3 py-1.5 text-white/90 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
              >
                Categories
              </Link>
              <Link
                to="/plants"
                className="px-3 py-1.5 text-white/90 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
              >
                All Plants
              </Link>
              <Link
                to="/gallery"
                className="px-3 py-1.5 text-white/90 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
              >
                Gallery
              </Link>
              <Link
                to="/contact"
                className="px-3 py-1.5 text-white/90 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
              >
                Contact
              </Link>

              {/* Cart Icon - Desktop */}
              {!isAuthenticated && (
                <Link
                  to="/cart"
                  className="relative ml-2 p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                    View Cart
                  </span>
                </Link>
              )}

              {/* Theme Toggle - Desktop */}
              <div className="ml-2">
                <ThemeToggle />
              </div>

              {/* Auth Section - Desktop */}
              {isAuthenticated ? (
                <div className="relative group ml-2">
                  <button className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all duration-200 text-sm font-medium">
                    <span>👋 {user?.name?.split(' ')[0]}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-sm"
                    >
                      <span>📊</span> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 text-sm transition-colors"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="ml-2 bg-white text-green-700 hover:bg-green-50 px-4 py-1.5 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                >
                  Admin Login
                </Link>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Cart Icon - Mobile */}
              {!isAuthenticated && (
                <Link
                  to="/cart"
                  className="relative p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Theme Toggle - Mobile */}
              <ThemeToggle />

              {/* Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Premium Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              variants={slideIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-gradient-to-br from-green-800/95 to-green-900/95 dark:from-gray-900/95 dark:to-gray-950/95 backdrop-blur-xl z-50 shadow-2xl rounded-l-3xl md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <motion.span
                    className="text-3xl"
                    whileHover={{ rotate: 15 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    🌿
                  </motion.span>
                  <span className="text-lg font-bold text-white">HomeGarden</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 active:scale-90"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info - if logged in */}
              {isAuthenticated && (
                <div className="mx-4 mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xl">
                      👋
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{user?.name}</p>
                      <p className="text-green-200 text-xs">Premium Member</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="flex-1 py-4">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    custom={index}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 mx-4 my-1 px-4 py-3 rounded-xl transition-all duration-200 ${item.active
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Divider */}
                <div className="h-px bg-white/10 my-3 mx-4" />

                {/* Admin Section */}
                {isAuthenticated && adminItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    custom={menuItems.length + index}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 mx-4 my-1 px-4 py-3 rounded-xl transition-all duration-200 ${item.active
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}

                {/* Logout Button */}
                {isAuthenticated && (
                  <motion.div
                    custom={menuItems.length + adminItems.length}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 mx-4 my-1 px-4 py-3 rounded-xl transition-all duration-200 text-red-300 hover:text-red-200 hover:bg-red-500/20 w-full"
                    >
                      <span className="text-xl">🚪</span>
                      <span className="font-medium text-sm">Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-white/10">
                <p className="text-white/40 text-xs text-center">
                  Premium Plants & Nursery
                </p>
                <p className="text-white/30 text-[10px] text-center mt-1">
                  © 2026 HomeGarden
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;