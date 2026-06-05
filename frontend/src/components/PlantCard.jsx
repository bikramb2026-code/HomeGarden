import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, memo } from 'react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Premium fallback images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format'
];

// Premium badges based on plant attributes
const getPremiumBadge = (plant) => {
  if (plant.isRare) return { text: 'RARE COLLECTION', color: 'from-purple-600 to-pink-600', icon: '💎' };
  if (plant.isOrganic) return { text: 'ORGANIC CERTIFIED', color: 'from-emerald-600 to-teal-600', icon: '🌱' };
  if (plant.isImported) return { text: 'IMPORTED', color: 'from-blue-600 to-indigo-600', icon: '✈️' };
  if (plant.price >= 500) return { text: 'PREMIUM', color: 'from-amber-500 to-yellow-500', icon: '👑' };
  return null;
};

// Premium plant features (replaces rating)
const getPlantFeatures = (plant) => {
  const features = [];
  if (plant.airPurifying) features.push('Air Purifying');
  if (plant.petFriendly) features.push('Pet Friendly');
  if (plant.lowMaintenance) features.push('Low Maintenance');
  if (plant.flowering) features.push('Flowering');
  if (plant.fragrant) features.push('Fragrant');
  if (plant.largeSize) features.push('Large Size');
  if (features.length === 0) features.push('Premium Quality');
  return features.slice(0, 2); // Max 2 features
};

const Skeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
    <div className="h-64 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-10 bg-gray-200 rounded w-2/3" />
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 rounded-xl" />
        <div className="h-12 bg-gray-200 rounded-xl" />
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

  const inStock = plant.inStock !== false;
  const premiumBadge = getPremiumBadge(plant);
  const plantFeatures = getPlantFeatures(plant);
  const isNewArrival = plant.isNewArrival || false;

  useEffect(() => {
    const imageUrl = plant.images?.[0]?.url || plant.images?.[0] || plant.image || FALLBACK_IMAGES[0];
    setImgSrc(imageUrl);
  }, [plant]);

  const handleImageError = () => setImgSrc(FALLBACK_IMAGES[0]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plant);
    setIsAdded(true);
    toast.success(`Added to cart`, {
      duration: 1500,
      position: 'bottom-center',
      style: {
        background: '#1a1a1a',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
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
        background: '#1a1a1a',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '10px',
        fontSize: '12px',
      },
    });
  };

  const formattedPrice = new Intl.NumberFormat('en-IN').format(plant.price || 0);
  const categoryName = plant.category?.name || '';
  const varietyName = plant.variety?.name || plant.variety || '';

  return (
    <div
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/plant/${plant.slug}`} className="block h-full">
        <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">

          {/* Image Section */}
          <div className="relative bg-gray-50 overflow-hidden">
            <div className="aspect-[4/3] w-full">
              {!isImageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
              <img
                src={imgSrc}
                alt={plant.name}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-105' : 'scale-100'
                  } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onError={handleImageError}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Premium Badge */}
            {premiumBadge && inStock && (
              <div className="absolute top-3 left-3 z-10">
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r ${premiumBadge.color} rounded-lg shadow-lg`}>
                  <span className="text-xs">{premiumBadge.icon}</span>
                  <span className="text-white text-[10px] font-bold tracking-wide">{premiumBadge.text}</span>
                </div>
              </div>
            )}

            {/* New Arrival Badge */}
            {isNewArrival && !premiumBadge && (
              <div className="absolute top-3 left-3 z-10">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg">
                  <span className="text-white text-[10px] font-bold tracking-wide">NEW ARRIVAL</span>
                </div>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
              aria-label="Save to wishlist"
            >
              <svg
                className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                fill={isWishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Quick View Overlay */}
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <span className="px-5 py-2 bg-white text-gray-900 text-xs font-semibold rounded-full shadow-xl transform transition-all duration-300">
                Quick View
              </span>
            </div>

            {/* Out of Stock */}
            {!inStock && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="px-4 py-2 bg-gray-900 rounded-full">
                  <span className="text-white text-xs font-bold tracking-wide">OUT OF STOCK</span>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 flex-1 flex flex-col">

            {/* Category + Variety */}
            <div className="flex items-center gap-2 mb-2">
              {categoryName && (
                <span className="text-[11px] text-gray-400 uppercase tracking-wide">{categoryName}</span>
              )}
              {varietyName && categoryName && (
                <span className="text-[11px] text-gray-300">•</span>
              )}
              {varietyName && (
                <span className="text-[11px] text-gray-400">{varietyName}</span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
              {plant.name || 'Premium Plant'}
            </h3>

            {/* Premium Features (replaces rating) */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {plantFeatures.map((feature, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-full">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                  {feature}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="mb-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">₹{formattedPrice}</span>
                <span className="text-[11px] text-gray-400">Starting from</span>
              </div>
            </div>

            {/* Delivery + Stock - Premium Row */}
            <div className="flex items-center justify-between mb-4 pt-1 border-t border-gray-50">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🚚</span>
                <span className="text-[11px] text-gray-500">Free Delivery</span>
              </div>
              {inStock && (
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="text-[11px] font-medium text-emerald-600">In Stock</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-auto">
              {/* Row 1: Add to Cart + View Details */}
              <div className="grid grid-cols-2 gap-3">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${inStock
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-lg hover:shadow-emerald-500/25 text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{isAdded ? 'Added!' : 'Cart'}</span>
                </button>

                {/* View Details Button */}
                <button
                  onClick={(e) => e.preventDefault()}
                  className="py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View</span>
                </button>
              </div>

              {/* Buy Now Button - Premium CTA */}
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${inStock
                    ? 'bg-gradient-to-r from-gray-900 to-black hover:shadow-xl hover:scale-[1.01] text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <span className="text-base">⚡</span>
                <span>Buy Now</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Premium Hover Glow */}
          <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none rounded-2xl ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 to-green-500/3 rounded-2xl" />
          </div>
        </div>
      </Link>
    </div>
  );
};

const PlantCard = memo(PlantCardComponent);
export const PlantCardSkeleton = Skeleton;
export default PlantCard;