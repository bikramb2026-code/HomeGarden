import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PlantCard = ({ plant }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const inStock = plant.inStock !== false;
  const isNewArrival = plant.isNewArrival || false;
  const isBestSeller = plant.isBestSeller || false;
  const isPremium = plant.price >= 500;

  // Premium fallback images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format',
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format',
    'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format'
  ];

  const sectionSlug = plant.section?.slug || '';
  const categorySlug = plant.category?.slug || '';
  const plantSlug = plant.slug || '';

  const plantDetailUrl = sectionSlug && categorySlug && plantSlug
    ? `/categories/${sectionSlug}/${categorySlug}/${plantSlug}`
    : `/plants/${plantSlug}`;

  const formattedPrice = new Intl.NumberFormat('en-IN').format(plant.price || 0);

  useEffect(() => {
    getImageUrl();
  }, [plant]);

  const getImageUrl = () => {
    try {
      if (plant.images && Array.isArray(plant.images) && plant.images.length > 0) {
        const firstImage = plant.images[0];
        if (typeof firstImage === 'string' && firstImage.startsWith('http')) {
          setImgSrc(firstImage);
        } else if (firstImage?.url?.startsWith('http')) {
          setImgSrc(firstImage.url);
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
    toast.success(`${plant.name || 'Plant'} added to cart!`, {
      duration: 2500,
      position: 'bottom-center',
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '16px',
        fontWeight: '600',
        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      },
      icon: '🛒',
    });
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plant);
    navigate('/checkout');
  };

  // Get variety name as string
  const varietyName = plant.variety && typeof plant.variety === 'object' ? plant.variety.name : plant.variety || '';

  return (
    <div
      className="group relative bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Image Container - Taller aspect ratio for better plant visuals */}
      <Link to={plantDetailUrl} className="block relative aspect-[3/2] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex-shrink-0">
        <div className="w-full h-full overflow-hidden">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={plant.name || 'Plant'}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 md:group-hover:scale-110"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-600">
              <span className="text-6xl text-white opacity-30 animate-pulse">🌿</span>
            </div>
          )}
        </div>

        {/* Premium Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Badge Container - Top Left */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isPremium && inStock && (
            <div className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold rounded-lg shadow-lg backdrop-blur-sm border border-amber-400/50 animate-pulse">
              PREMIUM
            </div>
          )}
          {isBestSeller && (
            <div className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-lg shadow-lg backdrop-blur-sm border border-red-400/50">
              🔥 BEST SELLER
            </div>
          )}
          {isNewArrival && (
            <div className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold rounded-lg shadow-lg backdrop-blur-sm border border-blue-400/50">
              ✨ NEW
            </div>
          )}
        </div>

        {/* Badge Container - Top Right */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
          {plant.images && plant.images.length > 1 && (
            <div className="px-2 py-0.5 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-lg shadow-xl flex items-center gap-1 border border-white/30">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{plant.images.length}</span>
            </div>
          )}
          {!inStock && (
            <div className="px-2 py-0.5 bg-gradient-to-r from-red-600 to-rose-600 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg shadow-xl border border-red-400/50">
              SOLD OUT
            </div>
          )}
        </div>

        {/* Quick View Overlay - Desktop Only */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 bg-black/60 backdrop-blur-sm">
          <span className="px-5 py-2 bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-white text-xs font-semibold rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            Quick View
          </span>
        </div>
      </Link>

      {/* Content Section - Optimized spacing for mobile */}
      <div className="p-3.5 sm:p-4 md:p-5 flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/80">
        
        {/* Plant Name - Clean typography */}
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
          {plant.name || 'Unnamed Plant'}
        </h3>

        {/* Category Tags - Premium pill design */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {plant.section && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium border border-green-200 dark:border-green-800 shadow-sm">
              <span className="text-green-600 dark:text-green-400 text-[10px]">🌿</span>
              {plant.section.name}
            </span>
          )}
          {plant.category && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium border border-blue-200 dark:border-blue-800 shadow-sm">
              <span className="text-blue-600 dark:text-blue-400 text-[10px]">🍃</span>
              {plant.category.name}
            </span>
          )}
          {varietyName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full font-medium border border-purple-200 dark:border-purple-800 shadow-sm">
              <span className="text-purple-600 dark:text-purple-400 text-[10px]">🌸</span>
              {varietyName}
            </span>
          )}
        </div>

        {/* Stock Indicator - Separate line for clarity */}
        {inStock && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[11px] sm:text-xs font-semibold text-green-600 dark:text-green-400">
              In Stock
            </span>
          </div>
        )}

        {/* Description - Clean and readable */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {plant.description || 'Premium quality plant for your home garden'}
        </p>

        {/* Price Section with Delivery Info */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              ₹{formattedPrice}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">
              Starting Price
            </span>
          </div>
          
          {/* Delivery Information - Premium badge */}
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <span className="text-[11px] sm:text-xs">🚚</span>
            <span className="text-[10px] sm:text-xs font-medium text-green-700 dark:text-green-400">
              Delivery Available
            </span>
          </div>
        </div>

        {/* Action Buttons - Reduced height, better spacing */}
        <div className="flex flex-col gap-2 mt-auto pt-2">
          {/* Row 1: View Details + Add to Cart */}
          <div className="flex gap-2">
            {/* View Details Button */}
            <Link
              to={plantDetailUrl}
              className="flex-1 group/btn relative bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-purple-600 hover:to-purple-500 dark:hover:from-purple-600 dark:hover:to-purple-500 text-gray-700 dark:text-gray-300 hover:text-white text-xs font-semibold py-2 sm:py-2.5 px-2 rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-1 shadow-md hover:shadow-xl transform active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <svg className="relative z-10 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="relative z-10 hidden sm:inline text-xs">View</span>
              <span className="relative z-10 sm:hidden text-xs">View</span>
            </Link>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 group/btn relative text-xs font-semibold py-2 sm:py-2.5 px-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 shadow-md hover:shadow-xl transform active:scale-95 overflow-hidden ${inStock
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {inStock && <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>}
              <svg className={`relative z-10 w-3.5 h-3.5 transition-transform duration-300 ${isAdded ? 'scale-125' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="relative z-10">{isAdded ? 'Added!' : 'Cart'}</span>
            </button>
          </div>

          {/* Row 2: Buy Now Button - Full Width, Primary CTA */}
          <button
            onClick={handleBuyNow}
            disabled={!inStock}
            className={`group/btn relative text-sm font-bold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95 w-full overflow-hidden ${inStock
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {inStock && <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>}
            <svg className="relative z-10 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="relative z-10">Buy Now</span>
            {inStock && (
              <span className="relative z-10 text-xs opacity-80 group-hover/btn:translate-x-1 transition-transform duration-300">
                →
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Glassmorphism Glow Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl"></div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl"></div>
      </div>
    </div>
  );
};

export default PlantCard;