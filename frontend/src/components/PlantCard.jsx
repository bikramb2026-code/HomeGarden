import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, memo, useRef } from 'react';
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
  if (plant.isGrafted) return '🪴 Grafted Plant';
  if (plant.sunRequirement === 'full') return '☀️ Full Sun';
  if (plant.sunRequirement === 'partial') return '🌤️ Partial Sun';
  if (plant.sunRequirement === 'indirect') return '💡 Indirect Light';
  if (plant.waterRequirement === 'low') return '💧 Low Water';
  if (plant.waterRequirement === 'high') return '💧 High Water';
  return '🌿 Premium Quality';
};

// Premium Skeleton Loader
const Skeleton = () => (
  <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
    <div className="h-[190px] bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-7 bg-gray-700 rounded-lg w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse" />
      <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
      <div className="h-10 bg-gray-700 rounded-xl w-28 animate-pulse" />
      <div className="space-y-2 pt-2">
        <div className="flex gap-3">
          <div className="h-[42px] bg-gray-700 rounded-xl flex-1 animate-pulse" />
          <div className="h-[42px] bg-gray-700 rounded-xl flex-1 animate-pulse" />
        </div>
        <div className="h-[52px] bg-gray-700 rounded-xl w-full animate-pulse" />
      </div>
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

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
      duration: 2000,
      position: 'bottom-center',
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        padding: '14px 24px',
        borderRadius: '100px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
      },
      icon: '✨',
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
      duration: 1500,
      position: 'bottom-center',
      style: {
        background: '#1f2937',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '100px',
        fontSize: '12px',
      },
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const varietyName = plant.variety && typeof plant.variety === 'object'
    ? plant.variety.name
    : plant.variety || '';

  const categoryDisplay = `${plant.category?.name || ''}${varietyName ? ` • ${varietyName}` : ''}`;

  return (
    <Link
      to={plantDetailUrl}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={cardRef}
        className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#1a1f2e]/95 to-[#0f141f]/95 backdrop-blur-sm border border-white/8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.5)] h-full flex flex-col"
        style={{
          transform: isHovered ? `perspective(1000px) rotateX(0.5deg) rotateY(0.5deg)` : 'none',
        }}
      >
        {/* Mouse Glow Tracking */}
        {isHovered && (
          <div
            className="absolute pointer-events-none z-20 rounded-full opacity-30 transition-all duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.4), transparent 50%)`,
              inset: '-50%',
            }}
          />
        )}

        {/* Image Section - Hero Element */}
        <div className="relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="h-[190px] w-full">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse" />
            )}
            <img
              src={imgSrc}
              alt={plant.name || 'Premium Plant'}
              className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'scale-110' : 'scale-100'
                } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onError={handleImageError}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>

          {/* Soft Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f141f]/80 via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f141f]/20 to-transparent" />

          {/* Premium Badge - Only One Badge Allowed */}
          {isPremium && inStock && (
            <div className="absolute top-3 left-3 z-10">
              <div className="relative group/badge">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-md opacity-60 group-hover/badge:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1L12 6H18L13 9L15 14L10 11L5 14L7 9L2 6H8L10 1Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-[10px] font-bold tracking-wider">PREMIUM</span>
                </div>
              </div>
            </div>
          )}

          {/* Floating Wishlist Heart Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
            aria-label="Add to wishlist"
          >
            <svg
              className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'text-red-500 fill-current' : 'text-white'}`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Floating Image Count Chip */}
          {plant.images && plant.images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-[10px] font-medium">{plant.images.length}</span>
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/30">
                <span className="text-white text-xs font-bold tracking-wide">SOLD OUT</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">

          {/* Product Title - 22px, 800 weight */}
          <h3 className="text-[22px] font-extrabold text-white mb-2 leading-[1.15] line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300">
            {plant.name || 'Premium Plant'}
          </h3>

          {/* Category Display - Single elegant line */}
          {categoryDisplay && (
            <p className="text-white/50 text-xs tracking-wide mb-2.5">
              🌿 {categoryDisplay}
            </p>
          )}

          {/* Premium Metadata - Single line */}
          <p className="text-emerald-400/80 text-[11px] font-medium tracking-wide mb-3">
            {plantMetadata}
          </p>

          {/* Price Section - Luxury presentation */}
          <div className="mb-3 relative">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-[38px] font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent leading-none">
                ₹{formattedPrice}
              </span>
              <span className="text-white/30 text-[11px] font-medium tracking-wide">Starting at</span>
            </div>
            {/* Floating Glow Beneath Price */}
            <div className="absolute -bottom-2 left-0 w-20 h-4 bg-gradient-to-r from-emerald-500/20 to-transparent blur-xl rounded-full" />
          </div>

          {/* Delivery + Stock - Tiny row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <span className="text-xs">🚚</span>
              <span className="text-white/40 text-[10px] font-medium tracking-wide">Delivery Available</span>
            </div>
            {inStock && (
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-emerald-400 text-[10px] font-semibold tracking-wide">In Stock</span>
              </div>
            )}
          </div>

          {/* Subtle Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

          {/* Action Area */}
          <div className="flex flex-col gap-2 mt-auto">
            {/* Top Row: View + Add To Cart */}
            <div className="flex gap-3">
              {/* View Button - Ghost Glass */}
              <button
                onClick={(e) => e.preventDefault()}
                className="flex-1 group/btn relative h-[42px] bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                aria-label="View product details"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <svg className="w-3.5 h-3.5 text-white/80 group-hover/btn:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-white/80 text-xs font-semibold group-hover/btn:text-white transition-colors">View</span>
              </button>

              {/* Add To Cart Button - Emerald Filled */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 group/btn relative h-[42px] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden active:scale-95 ${inStock
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 cursor-pointer'
                    : 'bg-gray-700 cursor-not-allowed'
                  }`}
                aria-label="Add to cart"
              >
                {inStock && (
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                )}
                <svg className={`w-3.5 h-3.5 text-white transition-all duration-300 ${isAdded ? 'scale-125' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-white text-xs font-semibold">{isAdded ? 'Added!' : 'Add'}</span>
              </button>
            </div>

            {/* Bottom Row: Buy Now Button - Premium Liquid Gradient */}
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className={`group/btn relative w-full h-[52px] rounded-[18px] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden active:scale-[0.98] ${inStock
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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 rounded-[18px] ring-1 ring-white/20 group-hover/btn:ring-white/40 transition-all duration-300" />
                </>
              )}
              <span className="text-lg">⚡</span>
              <span className="text-white font-bold text-sm tracking-wide">Buy Now</span>
              <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Premium Glow Effect on Hover */}
        <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none rounded-[28px] ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/8 to-green-500/8 rounded-[28px]" />
          <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/15 to-green-500/15 rounded-[28px] blur-xl" />
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