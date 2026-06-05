import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, memo } from 'react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Premium fallback images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format',
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format',
  'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format'
];

// Premium plant metadata
const getPlantMetadata = (plant) => {
  if (plant.isPremiumQuality) return '🌱 Premium Quality';
  if (plant.isGrafted) return '🪴 Grafted Plant';
  if (plant.sunRequirement === 'full') return '☀️ Full Sun';
  if (plant.sunRequirement === 'partial') return '🌤️ Partial Sun';
  if (plant.sunRequirement === 'indirect') return '💡 Indirect Light';
  if (plant.waterRequirement === 'low') return '💧 Low Water';
  if (plant.waterRequirement === 'high') return '💧 High Water';
  if (plant.isLowMaintenance) return '🌱 Easy Care';
  return '🌿 Premium Quality';
};

// Premium Skeleton Loader
const Skeleton = () => (
  <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a1428]/90 to-[#050a19]/98 border border-white/6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
    <div className="h-[180px] bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
    <div className="flex-1 flex flex-col p-5 space-y-3">
      <div className="h-6 bg-gray-700 rounded-lg w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse" />
      <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
      <div className="h-10 bg-gray-700 rounded-xl w-full animate-pulse mt-2" />
      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="h-[50px] bg-gray-700 rounded-2xl animate-pulse" />
        <div className="h-[50px] bg-gray-700 rounded-2xl animate-pulse" />
      </div>
      <div className="h-[56px] bg-gray-700 rounded-2xl w-full animate-pulse" />
    </div>
  </div>
);

const PlantCardComponent = ({ plant }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const inStock = plant.inStock !== false;
  const isPremium = plant.price >= 500;
  const plantMetadata = getPlantMetadata(plant);

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
    toast.success(`${plant.name || 'Plant'} added to cart`, {
      duration: 1500,
      position: 'bottom-center',
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '100px',
        fontSize: '13px',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
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

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      duration: 1000,
      position: 'bottom-center',
      style: {
        background: '#1a1f2e',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '100px',
        fontSize: '12px',
      },
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  const varietyName = plant.variety && typeof plant.variety === 'object'
    ? plant.variety.name
    : plant.variety || '';

  const categoryDisplay = `${plant.category?.name || ''}${varietyName ? ` • ${varietyName}` : ''}`;

  return (
    <Link
      to={plantDetailUrl}
      className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a1428] to-[#050a19] border border-white/6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)]">

        {/* Image Section - Fixed 180px */}
        <div className="relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="h-[180px] w-full">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
            )}
            <img
              src={imgSrc}
              alt={plant.name || 'Premium Plant'}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'
                } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onError={handleImageError}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>

          {/* Premium Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050a19] via-transparent to-transparent opacity-50" />

          {/* Premium Badge - Top Left (Only when premium) */}
          {isPremium && inStock && (
            <div className="absolute top-3 left-3 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-md opacity-60" />
                <div className="relative flex items-center justify-center px-3 h-[30px] bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg">
                  <span className="text-white text-[11px] font-bold tracking-wider">PREMIUM</span>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Button - Top Right */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-20 w-[42px] h-[42px] rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'text-red-500 fill-current' : 'text-white'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Image Count - Bottom Right */}
          {plant.images && plant.images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/15">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-[10px] font-medium">{plant.images.length}</span>
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-white text-[11px] font-bold tracking-wide">SOLD OUT</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section - Fixed spacing */}
        <div className="flex-1 flex flex-col p-5">

          {/* Title - Fixed height for 2 lines */}
          <div className="min-h-[44px] mb-2">
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
              {plant.name || 'Premium Plant'}
            </h3>
          </div>

          {/* Category - Single line */}
          <div className="min-h-[20px] mb-2.5">
            {categoryDisplay && (
              <p className="text-white/40 text-[11px] tracking-wide truncate">
                🌿 {categoryDisplay}
              </p>
            )}
          </div>

          {/* Quality Row */}
          <div className="min-h-[20px] mb-3">
            <p className="text-emerald-400/80 text-[11px] font-medium tracking-wide">
              {plantMetadata}
            </p>
          </div>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-[38px] font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent leading-none">
                ₹{formattedPrice}
              </span>
              <span className="text-white/30 text-[11px] font-medium">Starting at</span>
            </div>
          </div>

          {/* Delivery + Stock - Single line */}
          <div className="min-h-[20px] mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🚚</span>
                <span className="text-white/35 text-[10px] font-medium">Delivery Available</span>
              </div>
              {inStock && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-[10px] font-semibold">In Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Area - Fixed at bottom */}
          <div className="flex flex-col gap-2.5 mt-auto">
            {/* Row 1: View + Cart */}
            <div className="grid grid-cols-2 gap-3">
              {/* View Button - Glassmorphism */}
              <button
                onClick={(e) => e.preventDefault()}
                className="group/btn h-[50px] bg-white/5 backdrop-blur-sm rounded-2xl border border-white/8 hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="View product details"
              >
                <svg className="w-5 h-5 text-white/80 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-white/80 text-sm font-semibold group-hover/btn:text-white transition-colors">View</span>
              </button>

              {/* Cart Button - Emerald Gradient */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`group/btn h-[50px] rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${inStock
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer'
                    : 'bg-gray-700 cursor-not-allowed'
                  }`}
                aria-label="Add to cart"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-white text-sm font-semibold">{isAdded ? 'Added!' : 'Cart'}</span>
              </button>
            </div>

            {/* Row 2: Buy Now - Premium CTA */}
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className={`group/btn relative w-full h-[56px] rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${inStock
                  ? 'cursor-pointer'
                  : 'bg-gray-700 cursor-not-allowed'
                }`}
              aria-label="Buy now"
              style={{
                background: inStock ? 'linear-gradient(105deg, #FF7A18 0%, #FF4D4D 45%, #FF7A18 100%)' : 'none',
                backgroundSize: inStock ? '200% auto' : 'auto',
              }}
            >
              {inStock && (
                <>
                  {/* Animated Shine Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  {/* Premium Shadow */}
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_4px_12px_rgba(255,77,77,0.3)]" />
                </>
              )}
              {/* Lightning Icon with Glow */}
              <div className="relative">
                <span className="absolute inset-0 blur-sm opacity-60 group-hover/btn:opacity-100 transition-opacity duration-300 text-lg">⚡</span>
                <span className="relative text-base">⚡</span>
              </div>
              <span className="text-white font-bold text-base tracking-wide">Buy Now</span>
              {/* Arrow with Slide Animation */}
              <span className="text-white/90 text-base transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
            </button>
          </div>
        </div>

        {/* Premium Emerald Glow on Hover */}
        <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none rounded-2xl ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-2xl" />
          <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/8 to-green-500/8 rounded-2xl blur-xl" />
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