import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, memo } from 'react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Constants moved outside component for performance
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format',
  'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format'
];

const Skeleton = () => (
  <div className="animate-pulse bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border border-emerald-500/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
    <div className="h-[280px] bg-gradient-to-br from-gray-800 to-gray-700" />
    <div className="p-6 space-y-4">
      <div className="h-8 bg-gray-700 rounded-lg w-3/4" />
      <div className="flex gap-2">
        <div className="h-8 bg-gray-700 rounded-full w-20" />
        <div className="h-8 bg-gray-700 rounded-full w-24" />
      </div>
      <div className="h-4 bg-gray-700 rounded w-28" />
      <div className="h-10 bg-gray-700 rounded-xl w-32" />
      <div className="space-y-2">
        <div className="h-12 bg-gray-700 rounded-xl" />
        <div className="h-14 bg-gray-700 rounded-xl" />
      </div>
    </div>
  </div>
);

const PlantCardComponent = ({ plant }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const inStock = plant.inStock !== false;
  const isPremium = plant.price >= 500;
  const isNewArrival = plant.isNewArrival || false;
  const isBestSeller = plant.isBestSeller || false;

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
      const imageUrl = plant.images?.[0]?.url || plant.images?.[0] || plant.image;
      if (imageUrl?.startsWith('http')) {
        setImgSrc(imageUrl);
      } else {
        setImgSrc(FALLBACK_IMAGES[0]);
      }
    } catch (error) {
      setImgSrc(FALLBACK_IMAGES[0]);
    }
  };

  const handleImageError = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
    setImgSrc(FALLBACK_IMAGES[randomIndex]);
    setImageError(true);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plant);
    setIsAdded(true);
    toast.success(`${plant.name || 'Plant'} added to cart`, {
      duration: 2000,
      position: 'bottom-center',
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '100px',
        fontWeight: '600',
        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)',
      },
      icon: '✓',
    });
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plant);
    navigate('/checkout');
  };

  const varietyName = plant.variety && typeof plant.variety === 'object' 
    ? plant.variety.name 
    : plant.variety || '';

  return (
    <Link
      to={plantDetailUrl}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-3xl overflow-hidden border border-emerald-500/15 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] hover:-translate-y-2 h-full flex flex-col">
        
        {/* Image Section - 55% of card height */}
        <div className="relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="aspect-[4/3] w-full">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
            )}
            <img
              src={imgSrc}
              alt={plant.name || 'Premium Plant'}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onError={handleImageError}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>

          {/* Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-60" />

          {/* Premium Badge - Top Left with Gold Gradient */}
          {isPremium && inStock && (
            <div className="absolute top-4 left-4 z-10">
              <div className="relative group/badge">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-md opacity-50 group-hover/badge:opacity-75 transition-opacity duration-300" />
                <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1L12 6H18L13 9L15 14L10 11L5 14L7 9L2 6H8L10 1Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-xs font-bold tracking-wide">PREMIUM</span>
                </div>
              </div>
            </div>
          )}

          {/* Best Seller Badge */}
          {isBestSeller && !isPremium && (
            <div className="absolute top-4 left-4 z-10">
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg">
                <span className="text-white text-xs font-bold tracking-wide">🔥 BEST SELLER</span>
              </div>
            </div>
          )}

          {/* New Arrival Badge */}
          {isNewArrival && !isPremium && !isBestSeller && (
            <div className="absolute top-4 left-4 z-10">
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg">
                <span className="text-white text-xs font-bold tracking-wide">✨ NEW</span>
              </div>
            </div>
          )}

          {/* Image Count Badge - Top Right */}
          {plant.images && plant.images.length > 1 && (
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-xs font-medium">{plant.images.length}</span>
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/30">
                <span className="text-white font-bold text-sm tracking-wide">SOLD OUT</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          
          {/* Product Name - 24px, Bold */}
          <h3 className="text-2xl font-bold text-white mb-3 leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
            {plant.name || 'Premium Plant'}
          </h3>

          {/* Category Tags - Premium Glass Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {plant.section && (
              <div className="h-8 px-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center">
                <span className="text-white/90 text-xs font-medium tracking-wide">{plant.section.name}</span>
              </div>
            )}
            {plant.category && (
              <div className="h-8 px-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center">
                <span className="text-white/90 text-xs font-medium tracking-wide">{plant.category.name}</span>
              </div>
            )}
            {varietyName && !plant.category && (
              <div className="h-8 px-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center">
                <span className="text-white/90 text-xs font-medium tracking-wide">{varietyName}</span>
              </div>
            )}
          </div>

          {/* Stock Status - Animated Green Dot */}
          {inStock && (
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-emerald-400 text-xs font-semibold tracking-wide">In Stock</span>
            </div>
          )}

          {/* Description - Max 2 lines */}
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {plant.description || 'Premium quality plant for your home garden. Carefully nurtured for optimal health and growth.'}
          </p>

          {/* Price Section */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                ₹{formattedPrice}
              </span>
              <span className="text-gray-500 text-xs font-medium tracking-wide">Starting Price</span>
            </div>
          </div>

          {/* Delivery Badge - Glass Chip */}
          <div className="mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-sm">🚚</span>
              <span className="text-gray-300 text-xs font-medium tracking-wide">Free Delivery Available</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            {/* Top Row: View + Cart */}
            <div className="flex gap-3">
              {/* View Button - Glassmorphism */}
              <button
                onClick={(e) => e.preventDefault()}
                className="flex-1 group/btn relative h-12 px-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                aria-label="View product details"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-white text-sm font-semibold">View</span>
              </button>

              {/* Cart Button - Emerald Gradient */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 group/btn relative h-12 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${
                  inStock
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
                aria-label="Add to cart"
              >
                {inStock && (
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                )}
                <svg className={`w-4 h-4 text-white transition-transform duration-300 ${isAdded ? 'scale-125' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-white text-sm font-semibold">{isAdded ? 'Added!' : 'Cart'}</span>
              </button>
            </div>

            {/* Bottom Row: Buy Now - Full Width with Shine Animation */}
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className={`group/btn relative w-full h-[60px] rounded-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden ${
                inStock
                  ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF4D4D] hover:scale-[1.02] active:scale-95 cursor-pointer'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
              aria-label="Buy now"
            >
              {inStock && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </>
              )}
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-white font-bold text-base tracking-wide">Buy Now</span>
              <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Premium Glow Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-3xl" />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-2xl" />
        </div>
      </div>
    </Link>
  );
};

// Memoized component for performance
export const PlantCard = memo(PlantCardComponent);

// Export skeleton for loading states
export { Skeleton as PlantCardSkeleton };