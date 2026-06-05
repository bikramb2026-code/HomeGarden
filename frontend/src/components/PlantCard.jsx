import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PlantCard = ({ plant, index = 0 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const inStock = plant.inStock !== false;
  const stockCount = plant.stockCount || 0;
  const isLowStock = inStock && stockCount <= 5 && stockCount > 0;
  const isNewArrival = plant.isNewArrival || false;
  const isBestSeller = plant.isBestSeller || false;
  const isPremium = plant.price >= 500;
  const discount = plant.discount || 0;
  const originalPrice = plant.originalPrice || plant.price;
  const hasDiscount = discount > 0;

  // Ultra-premium fallback images (luxury botanical photography)
  const fallbackImages = [
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format',
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format',
    'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format'
  ];

  const sectionSlug = plant.section?.slug || '';
  const categorySlug = plant.category?.slug || '';
  const plantSlug = plant.slug || '';

  const plantDetailUrl = sectionSlug && categorySlug && plantSlug
    ? `/categories/${sectionSlug}/${categorySlug}/${plantSlug}`
    : `/plants/${plantSlug}`;

  const formattedPrice = new Intl.NumberFormat('en-IN').format(plant.price || 0);
  const formattedOriginalPrice = new Intl.NumberFormat('en-IN').format(originalPrice);
  const discountPercentage = hasDiscount ? Math.round((discount / originalPrice) * 100) : 0;

  useEffect(() => {
    getImageUrl();
  }, [plant]);

  useEffect(() => {
    // Auto-rotate images if multiple images exist and card is hovered
    let interval;
    if (isHovered && plant.images && plant.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % plant.images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, plant.images]);

  const getImageUrl = () => {
    try {
      if (plant.images && Array.isArray(plant.images) && plant.images.length > 0) {
        const currentImage = plant.images[currentImageIndex];
        if (typeof currentImage === 'string' && currentImage.startsWith('http')) {
          setImgSrc(currentImage);
        } else if (currentImage?.url?.startsWith('http')) {
          setImgSrc(currentImage.url);
        } else {
          setImgSrc(fallbackImages[0]);
        }
      } else if (plant.image?.startsWith('http')) {
        setImgSrc(plant.image);
      } else {
        setImgSrc(fallbackImages[0]);
      }
    } catch (error) {
      setImgSrc(fallbackImages[0]);
    }
  };

  useEffect(() => {
    getImageUrl();
  }, [currentImageIndex]);

  const handleImageError = () => {
    const nextIndex = (fallbackIndex + 1) % fallbackImages.length;
    setFallbackIndex(nextIndex);
    setImgSrc(fallbackImages[nextIndex]);
    setImageError(true);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plant);
    setIsAdded(true);
    
    // Haptic feedback simulation
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-md"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{plant.name || 'Plant'} added to cart</p>
          <p className="text-gray-400 text-xs">Premium quality guaranteed</p>
        </div>
      </motion.div>
    ), { duration: 2000, position: 'bottom-right' });
    
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plant);
    navigate('/checkout');
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPosition({ x, y });
  };

  const varietyName = plant.variety && typeof plant.variety === 'object' ? plant.variety.name : plant.variety || '';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickView(false);
      }}
      className="relative"
    >
      {/* Main Card */}
      <div className="group relative bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.4)] dark:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 hover:-translate-y-3 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm h-full flex flex-col">
        
        {/* 3D Tilt Effect Layer */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${cursorPosition.x}% ${cursorPosition.y}%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)`
          }}
        />

        {/* Image Container with Parallax */}
        <Link to={plantDetailUrl} className="block relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0 cursor-pointer">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer" />
          )}
          
          {/* Main Image with Parallax Scroll Effect */}
          <motion.img
            src={imgSrc}
            alt={plant.name || 'Plant'}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
            initial={{ scale: 1 }}
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 0.5 : 0
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              filter: isHovered ? 'brightness(1.05) contrast(1.05)' : 'brightness(1) contrast(1)'
            }}
          />

          {/* Multiple Image Indicator Dots */}
          {plant.images && plant.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {plant.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentImageIndex
                      ? 'w-6 h-1.5 bg-white shadow-lg'
                      : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Premium Gradient Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Luxury Badges - Top Left */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            {hasDiscount && inStock && (
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-bold rounded-full shadow-2xl backdrop-blur-sm border border-white/30"
              >
                {discountPercentage}% OFF
              </motion.div>
            )}
            {isPremium && inStock && (
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[11px] font-bold rounded-full shadow-2xl backdrop-blur-sm border border-amber-400/50 flex items-center gap-1"
              >
                <span className="text-xs">💎</span>
                PREMIUM
              </motion.div>
            )}
            {isBestSeller && (
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] font-bold rounded-full shadow-2xl backdrop-blur-sm border border-orange-400/50"
              >
                🔥 BESTSELLER
              </motion.div>
            )}
            {isNewArrival && (
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[11px] font-bold rounded-full shadow-2xl backdrop-blur-sm border border-blue-400/50"
              >
                ✨ JUST LAUNCHED
              </motion.div>
            )}
          </div>

          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end">
            {isLowStock && inStock && (
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 backdrop-blur-sm text-white text-[11px] font-bold rounded-full shadow-2xl border border-amber-400/50"
              >
                ⚡ Only {stockCount} left
              </motion.div>
            )}
            {!inStock && (
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="px-3 py-1 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm text-white text-[11px] font-bold rounded-full shadow-2xl border border-white/20"
              >
                SOLD OUT
              </motion.div>
            )}
            {plant.rating && (
              <div className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-full flex items-center gap-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-white text-[11px] font-bold">{plant.rating}</span>
              </div>
            )}
          </div>

          {/* Quick View Overlay - Premium */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center gap-3 z-20"
              >
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowQuickView(true);
                  }}
                  className="px-6 py-2.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl text-gray-900 dark:text-white text-sm font-semibold rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Quick View
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Content Section with Luxury Spacing */}
        <div className="p-5 flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-900/50">
          
          {/* Brand/Collection Tag */}
          {plant.collection && (
            <div className="mb-3">
              <span className="text-[10px] tracking-wider font-bold text-gray-400 dark:text-gray-500 uppercase">
                {plant.collection}
              </span>
            </div>
          )}

          {/* Plant Name with Luxury Font */}
          <Link to={plantDetailUrl}>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300 font-playfair">
              {plant.name || 'Unnamed Plant'}
            </h3>
          </Link>

          {/* Category Tags with Icons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {plant.section && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-400 text-[11px] rounded-full font-medium border border-green-200 dark:border-green-800/50 backdrop-blur-sm">
                <span className="text-green-600 dark:text-green-400 text-xs">🌿</span>
                {plant.section.name}
              </span>
            )}
            {plant.category && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400 text-[11px] rounded-full font-medium border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm">
                <span className="text-blue-600 dark:text-blue-400 text-xs">🍃</span>
                {plant.category.name}
              </span>
            )}
            {varietyName && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-400 text-[11px] rounded-full font-medium border border-purple-200 dark:border-purple-800/50 backdrop-blur-sm">
                <span className="text-purple-600 dark:text-purple-400 text-xs">✨</span>
                {varietyName}
              </span>
            )}
          </div>

          {/* Stock & Delivery Info */}
          <div className="flex items-center justify-between mb-4">
            {inStock ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  In Stock
                </span>
                {isLowStock && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400">
                    (Hurry up!)
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  Out of Stock
                </span>
              </div>
            )}
            
            {/* Free Delivery Badge */}
            {inStock && plant.price >= 499 && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-xs">🚚</span>
                <span className="text-[10px] font-semibold text-green-700 dark:text-green-400">
                  Free Delivery
                </span>
              </div>
            )}
          </div>

          {/* Description with Gradient */}
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {plant.description || 'Premium quality plant, carefully nurtured for your home garden'}
          </p>

          {/* Price Section with Luxury Animation */}
          <div className="mb-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              {hasDiscount ? (
                <>
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    ₹{formattedPrice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{formattedOriginalPrice}
                  </span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                    Save ₹{new Intl.NumberFormat('en-IN').format(discount)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    ₹{formattedPrice}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Inclusive of all taxes
                  </span>
                </>
              )}
            </div>

            {/* EMI Option */}
            {plant.price >= 1000 && (
              <div className="mt-2">
                <span className="text-[10px] text-gray-500 dark:text-gray-500">
                  or ₹{Math.ceil(plant.price / 3)}/month for 3 months
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons - Premium Layout */}
          <div className="flex flex-col gap-2 mt-auto pt-2">
            {/* Primary Action - Add to Cart */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!inStock}
              whileHover={{ scale: inStock ? 1.02 : 1 }}
              whileTap={{ scale: inStock ? 0.98 : 1 }}
              className={`group relative text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl w-full overflow-hidden ${
                inStock
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {inStock && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div
                    key="added"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Added to Cart</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Add to Cart</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Secondary Actions Grid */}
            <div className="flex gap-2">
              <Link
                to={plantDetailUrl}
                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-purple-600 hover:to-purple-500 text-gray-700 dark:text-gray-300 hover:text-white text-sm font-semibold py-2.5 px-3 rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-md hover:shadow-xl transform active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">View Details</span>
              </Link>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className={`flex-1 text-sm font-bold py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl transform active:scale-95 ${
                  inStock
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Premium Border Glow on Hover */}
        <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 blur-xl"></div>
          <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5"></div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Quick view content would go here */}
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Quick View</h3>
                <p className="text-gray-600 dark:text-gray-400">{plant.name}</p>
                <button
                  onClick={() => setShowQuickView(false)}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlantCard;