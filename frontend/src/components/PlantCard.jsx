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

// Premium plant metadata based on plant data
const getPlantMetadata = (plant) => {
  if (plant.isLowMaintenance) return '🌱 Easy Care';
  if (plant.isPremiumQuality) return '🪴 Premium Quality';
  if (plant.isGrafted) return '🪴 Grafted Plant';
  if (plant.sunRequirement === 'full') return '☀️ Full Sun';
  if (plant.sunRequirement === 'partial') return '🌤️ Partial Sun';
  if (plant.sunRequirement === 'indirect') return '💡 Indirect Light';
  if (plant.waterRequirement === 'low') return '💧 Low Water';
  if (plant.waterRequirement === 'high') return '💧 High Water';
  return '🌱 Premium Quality';
};

// Premium Skeleton Loader - Same height as actual card
const Skeleton = () => (
  <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/8 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
    <div className="h-[180px] bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
    <div className="flex-1 flex flex-col p-4 space-y-3">
      <div className="h-6 bg-gray-700 rounded-lg w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse" />
      <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
      <div className="h-10 bg-gray-700 rounded-xl w-full animate-pulse mt-2" />
      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
      <div className="flex gap-3 mt-2">
        <div className="h-12 bg-gray-700 rounded-2xl flex-1 animate-pulse" />
        <div className="h-12 bg-gray-700 rounded-2xl flex-1 animate-pulse" />
      </div>
      <div className="h-14 bg-gray-700 rounded-2xl w-full animate-pulse" />
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
    toast.success(`${plant.name || 'Plant'} added`, {
      duration: 1500,
      position: 'bottom-center',
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        padding: '12px 20px',
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

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed' : 'Saved', {
      duration: 1000,
      position: 'bottom-center',
      style: {
        background: '#1f2937',
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

  // Fixed category display format
  const categoryDisplay = `${plant.category?.name || ''}${varietyName ? ` • ${varietyName}` : ''}`;

  return (
    <Link
      to={plantDetailUrl}
      className="block group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fixed Height Container - Ensures all cards are exactly the same height */}
      <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1f2e] to-[#0f141f] border border-white/8 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">

        {/* IMAGE SECTION - Fixed 180px height */}
        <div className="relative flex-shrink-0 overflow-hidden bg-gray-800">
          <div className="h-[180px] w-full">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
            )}
            <img
              src={imgSrc}
              alt={plant.name || 'Plant'}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'
                } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onError={handleImageError}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>

          {/* Premium Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f141f] via-transparent to-transparent opacity-40" />

          {/* Premium Badge - Top Left */}
          {isPremium && inStock && (
            <div className="absolute top-3 left-3 z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-sm opacity-60" />
                <div className="relative flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1L12 6H18L13 9L15 14L10 11L5 14L7 9L2 6H8L10 1Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-[9px] font-bold tracking-wider">PREMIUM</span>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Heart - Top Right */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
            aria-label="Save to wishlist"
          >
            <svg
              className={`w-3.5 h-3.5 transition-all duration-300 ${isWishlisted ? 'text-red-500 fill-current' : 'text-white'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Image Count - Bottom Right */}
          {plant.images && plant.images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-[9px] font-medium">{plant.images.length}</span>
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/30">
                <span className="text-white text-[10px] font-bold tracking-wide">SOLD OUT</span>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT SECTION - Flex column with fixed spacing */}
        <div className="flex-1 flex flex-col p-4">

          {/* TITLE - Fixed height for 2 lines */}
          <div className="min-h-[44px] mb-2">
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
              {plant.name || 'Premium Plant'}
            </h3>
          </div>

          {/* CATEGORY - Single line, fixed height */}
          <div className="min-h-[20px] mb-2.5">
            {categoryDisplay && (
              <p className="text-white/45 text-[11px] tracking-wide truncate">
                🌿 {categoryDisplay}
              </p>
            )}
          </div>

          {/* QUALITY INFO - Fixed height */}
          <div className="min-h-[20px] mb-3">
            <p className="text-emerald-400/80 text-[11px] font-medium tracking-wide">
              {plantMetadata}
            </p>
          </div>

          {/* PRICE - Fixed height */}
          <div className="mb-2.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[34px] font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent leading-none">
                ₹{formattedPrice}
              </span>
              <span className="text-white/30 text-[10px] font-medium">Starting at</span>
            </div>
          </div>

          {/* META INFO - Single line, fixed height */}
          <div className="min-h-[24px] mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[11px]">🚚</span>
                <span className="text-white/35 text-[9px] font-medium">Delivery Available</span>
              </div>
              {inStock && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-emerald-400 text-[9px] font-semibold">In Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* ACTION AREA - Fixed at bottom with consistent button sizes */}
          <div className="flex flex-col gap-2 mt-auto pt-1">
            {/* Top Row: View + Cart */}
            <div className="flex gap-3">
              {/* View Button - Glassmorphism */}
              <button
                onClick={(e) => e.preventDefault()}
                className="flex-1 group/btn h-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/8 hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                aria-label="View details"
              >
                <span className="text-base">👁</span>
                <span className="text-white/80 text-sm font-semibold group-hover/btn:text-white transition-colors">View</span>
              </button>

              {/* Cart Button - Emerald Gradient */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 group/btn h-12 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${inStock
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 cursor-pointer'
                    : 'bg-gray-700 cursor-not-allowed'
                  }`}
                aria-label="Add to cart"
              >
                <span className="text-base">🛒</span>
                <span className="text-white text-sm font-semibold">{isAdded ? 'Added!' : 'Cart'}</span>
              </button>
            </div>

            {/* Bottom Row: Buy Now - Premium CTA */}
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className={`group/btn relative w-full h-14 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden active:scale-[0.98] ${inStock
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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  {/* Premium Shadow */}
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(255,77,77,0.3)]" />
                </>
              )}
              {/* Lightning Icon with Glow */}
              <div className="relative">
                <span className="absolute inset-0 blur-sm opacity-50 group-hover/btn:opacity-100 transition-opacity duration-300 text-lg">⚡</span>
                <span className="relative text-base">⚡</span>
              </div>
              <span className="text-white font-bold text-base tracking-wide">Buy Now</span>
              {/* Arrow with Movement */}
              <span className="text-white/90 text-base transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
            </button>
          </div>
        </div>

        {/* Premium Emerald Glow on Hover */}
        <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none rounded-2xl ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/6 to-green-500/6 rounded-2xl" />
          <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl blur-xl" />
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