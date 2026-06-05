import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, memo } from 'react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Constants moved outside component for performance
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&auto=format',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format',
  'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=400&auto=format'
];

const Skeleton = () => (
  <div className="animate-pulse bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-emerald-500/10">
    <div className="h-[160px] bg-gradient-to-br from-gray-800 to-gray-700" />
    <div className="p-3 space-y-2">
      <div className="h-6 bg-gray-700 rounded-lg w-3/4" />
      <div className="flex gap-1.5">
        <div className="h-7 bg-gray-700 rounded-full w-16" />
        <div className="h-7 bg-gray-700 rounded-full w-20" />
      </div>
      <div className="h-3 bg-gray-700 rounded w-24" />
      <div className="h-8 bg-gray-700 rounded-lg w-28" />
      <div className="space-y-1.5">
        <div className="h-10 bg-gray-700 rounded-xl" />
        <div className="h-12 bg-gray-700 rounded-xl" />
      </div>
    </div>
  </div>
);

const PlantCardComponent = ({ plant }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
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
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plant);
    setIsAdded(true);
    toast.success(`${plant.name || 'Plant'} added`, {
      duration: 1500,
      position: 'bottom-center',
      style: {
        background: '#10b981',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '100px',
        fontSize: '13px',
        fontWeight: '600',
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
      <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-emerald-500/10 shadow-lg transition-all duration-300 active:scale-[0.98] h-full flex flex-col">

        {/* Image Section - Compact 4:3 ratio */}
        <div className="relative flex-shrink-0 overflow-hidden bg-gray-800">
          <div className="aspect-[4/3] w-full">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
            )}
            <img
              src={imgSrc}
              alt={plant.name || 'Plant'}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'
                } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onError={handleImageError}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>

          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10 to-transparent opacity-50" />

          {/* Premium Badge - Compact Gold Pill */}
          {isPremium && inStock && (
            <div className="absolute top-2 left-2 z-10">
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1L12 6H18L13 9L15 14L10 11L5 14L7 9L2 6H8L10 1Z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-[10px] font-bold tracking-wide">PREMIUM</span>
              </div>
            </div>
          )}

          {/* Best Seller Badge - Compact */}
          {isBestSeller && !isPremium && (
            <div className="absolute top-2 left-2 z-10">
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg">
                <span className="text-white text-[10px] font-bold">🔥 BEST</span>
              </div>
            </div>
          )}

          {/* New Arrival Badge - Compact */}
          {isNewArrival && !isPremium && !isBestSeller && (
            <div className="absolute top-2 left-2 z-10">
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg">
                <span className="text-white text-[10px] font-bold">✨ NEW</span>
              </div>
            </div>
          )}

          {/* Image Count Badge - Compact Top Right */}
          {plant.images && plant.images.length > 1 && (
            <div className="absolute top-2 right-2 z-10">
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded-full">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-[10px] font-medium">{plant.images.length}</span>
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-10">
              <div className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                <span className="text-white text-xs font-bold">SOLD OUT</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section - Compact spacing */}
        <div className="p-3 flex-1 flex flex-col">

          {/* Product Title - 20px, Bold, 2 lines */}
          <h3 className="text-xl font-bold text-white mb-1.5 leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {plant.name || 'Premium Plant'}
          </h3>

          {/* Category Tags - Max 2, Compact pills */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {plant.section && (
              <div className="h-7 px-2.5 bg-white/10 backdrop-blur-sm rounded-full flex items-center">
                <span className="text-white/80 text-[11px] font-medium">{plant.section.name}</span>
              </div>
            )}
            {plant.category && (
              <div className="h-7 px-2.5 bg-white/10 backdrop-blur-sm rounded-full flex items-center">
                <span className="text-white/80 text-[11px] font-medium">{plant.category.name}</span>
              </div>
            )}
            {varietyName && !plant.category && !plant.section && (
              <div className="h-7 px-2.5 bg-white/10 backdrop-blur-sm rounded-full flex items-center">
                <span className="text-white/80 text-[11px] font-medium">{varietyName}</span>
              </div>
            )}
          </div>

          {/* Description - 1 line only */}
          <p className="text-gray-400 text-xs leading-relaxed mb-2 truncate">
            {plant.description || 'Premium quality plant for your home garden'}
          </p>

          {/* Stock Status - Simple dot */}
          {inStock && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="relative">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-emerald-400 text-[11px] font-semibold">In Stock</span>
            </div>
          )}

          {/* Price Section - Large focus area */}
          <div className="mb-2">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                ₹{formattedPrice}
              </span>
              <span className="text-gray-500 text-[11px] font-medium">Starting</span>
            </div>
          </div>

          {/* Delivery Badge - Compact */}
          <div className="mb-2.5">
            <div className="inline-flex items-center gap-1">
              <span className="text-sm">🚚</span>
              <span className="text-gray-300 text-[10px] font-medium">Free Delivery</span>
            </div>
          </div>

          {/* Action Buttons - Compact layout */}
          <div className="flex flex-col gap-1.5 mt-auto">
            {/* Top Row: View + Cart */}
            <div className="flex gap-2">
              {/* View Button - Glassmorphism */}
              <button
                onClick={(e) => e.preventDefault()}
                className="flex-1 group/btn h-[42px] px-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 active:bg-white/20 transition-all duration-200 flex items-center justify-center gap-1.5"
                aria-label="View product details"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-white text-xs font-semibold">View</span>
              </button>

              {/* Cart Button - Emerald Gradient */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 group/btn h-[42px] rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 overflow-hidden active:scale-95 ${inStock
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 cursor-pointer'
                    : 'bg-gray-700 cursor-not-allowed'
                  }`}
                aria-label="Add to cart"
              >
                <svg className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${isAdded ? 'scale-125' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-white text-xs font-semibold">{isAdded ? 'Added!' : 'Cart'}</span>
              </button>
            </div>

            {/* Bottom Row: Buy Now - Full Width */}
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className={`group/btn relative w-full h-[48px] rounded-xl transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden active:scale-[0.98] ${inStock
                  ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF4D4D] cursor-pointer'
                  : 'bg-gray-700 cursor-not-allowed'
                }`}
              aria-label="Buy now"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-white font-bold text-sm tracking-wide">Buy Now</span>
              <svg className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-2xl" />
        </div>
      </div>
    </Link>
  );
};

// Memoized component for performance
const PlantCard = memo(PlantCardComponent);

// Export skeleton for loading states
export const PlantCardSkeleton = Skeleton;

// Default export for backward compatibility
export default PlantCard;