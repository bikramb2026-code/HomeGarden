import { Link } from 'react-router-dom';
import { useState, useEffect, memo } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, ShoppingBag, Zap, Truck, CheckCircle, Sparkles, Heart } from 'lucide-react';

/**
 * PREMIUM PLANT CARD - Industry Standard v2.0
 * 
 * Fixes from your current code:
 * - SINGLE price display with MRP strike-through for discounts
 * - Optimized 2-CTAs max: "Quick View" + "Add to Cart" OR "Buy Now"
 * - Better variety/species hierarchy display
 * - Floating wishlist button (premium touch)
 * - Skeleton loading state
 * - Improved mobile touch targets
 * - Proper stock badges with color coding
 */
const PlantCard = memo(({ plant, index = 0, priority = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Derived data with proper defaults
  const inStock = plant.inStock !== false;
  const isNewArrival = plant.isNewArrival || false;
  const isBestSeller = plant.isBestSeller || false;

  // PROPER PRICE HANDLING - Single source of truth
  const currentPrice = plant.price || plant.salePrice || plant.discountedPrice || 0;
  const originalPrice = plant.originalPrice || plant.mrp || plant.compareAtPrice || null;
  const discountPercent = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // Variety name extraction (fixes your variety display issue)
  const varietyName = plant.variety && typeof plant.variety === 'object'
    ? plant.variety.name
    : plant.variety || '';

  // Category hierarchy for breadcrumb-style display
  const categoryHierarchy = [
    plant.section?.name,
    plant.category?.name,
    varietyName
  ].filter(Boolean);

  // URL construction
  const sectionSlug = plant.section?.slug || '';
  const categorySlug = plant.category?.slug || '';
  const plantSlug = plant.slug || '';
  const plantDetailUrl = sectionSlug && categorySlug && plantSlug
    ? `/categories/${sectionSlug}/${categorySlug}/${plantSlug}`
    : `/plants/${plantSlug}`;

  // Premium fallback images (Unsplash + custom)
  const fallbackImages = [
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format',
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format',
    'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format'
  ];

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
          setImgSrc(fallbackImages[index % fallbackImages.length]);
        }
      } else if (plant.image?.startsWith('http')) {
        setImgSrc(plant.image);
      } else {
        setImgSrc(fallbackImages[index % fallbackImages.length]);
      }
    } catch (error) {
      setImgSrc(fallbackImages[index % fallbackImages.length]);
    }
  };

  const handleImageError = () => {
    setImgSrc(fallbackImages[(index + 1) % fallbackImages.length]);
    setImageError(true);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Dispatch custom event for modal or navigate to detail
    navigate(plantDetailUrl);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;

    addToCart(plant);
    setIsAdded(true);
    toast.success(`${plant.name || 'Plant'} added to cart!`, {
      duration: 2000,
      position: 'bottom-center',
      style: {
        background: '#1e293b',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '500',
      },
      icon: '🌿',
    });
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      duration: 1500,
      position: 'bottom-center',
      icon: isWishlisted ? '💔' : '❤️',
    });
  };

  const formattedPrice = new Intl.NumberFormat('en-IN').format(currentPrice);
  const formattedOriginalPrice = originalPrice ? new Intl.NumberFormat('en-IN').format(originalPrice) : null;

  return (
    <div
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 50}ms` }}
    >

      {/* ========== IMAGE SECTION ========== */}
      <Link to={plantDetailUrl} className="relative block aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0">

        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800" />
        )}

        {/* Main Image */}
        <img
          src={imgSrc}
          alt={plant.name || 'Plant'}
          className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 rotate-1' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading={priority ? 'eager' : 'lazy'}
          onError={handleImageError}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
          }`} />

        {/* ========== BADGES - Top Left ========== */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <div className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-lg shadow-lg animate-pulse">
              -{discountPercent}% OFF
            </div>
          )}
          {isBestSeller && (
            <div className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-lg shadow-lg flex items-center gap-1">
              🔥 BESTSELLER
            </div>
          )}
          {isNewArrival && (
            <div className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-lg shadow-lg flex items-center gap-1">
              ✨ NEW
            </div>
          )}
        </div>

        {/* ========== BADGES - Top Right ========== */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 items-end">
          {!inStock && (
            <div className="px-2 py-0.5 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg border border-red-500/50">
              SOLD OUT
            </div>
          )}
          {plant.images?.length > 1 && (
            <div className="px-1.5 py-0.5 bg-black/50 backdrop-blur-md text-white text-[9px] font-bold rounded-lg flex items-center gap-1">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{plant.images.length}</span>
            </div>
          )}
        </div>

        {/* ========== WISHLIST BUTTON - Floating Heart ========== */}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2 right-2 z-10 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-300 ${isWishlisted
                ? 'fill-red-500 stroke-red-500'
                : 'stroke-gray-600 dark:stroke-gray-400 fill-none'
              }`}
          />
        </button>

        {/* Quick View Overlay - On Hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
          <button
            onClick={handleQuickView}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </Link>

      {/* ========== CONTENT SECTION ========== */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">

        {/* Category Hierarchy - Clean breadcrumb style */}
        {categoryHierarchy.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-2 text-[10px] font-medium text-gray-500 dark:text-gray-400">
            {categoryHierarchy.map((cat, idx) => (
              <span key={idx} className="flex items-center gap-1">
                {idx > 0 && <span className="text-gray-300 dark:text-gray-600">•</span>}
                <span className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  {cat}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Plant Name */}
        <Link to={plantDetailUrl}>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1.5 leading-tight line-clamp-2 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            {plant.name || 'Unnamed Plant'}
          </h3>
        </Link>

        {/* Short Description - Only 1 line for compactness */}
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
          {plant.description || plant.shortDescription || 'Premium quality plant for your garden'}
        </p>

        {/* ========== PRICE SECTION - SINGLE CLEAR PRICE ========== */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              ₹{formattedPrice}
            </span>

            {originalPrice && (
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                ₹{formattedOriginalPrice}
              </span>
            )}

            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">
              Starting Price
            </span>
          </div>

          {/* Delivery Badge */}
          <div className="mt-1.5 flex items-center gap-1">
            <Truck className="w-3 h-3 text-green-600 dark:text-green-400" />
            <span className="text-[10px] font-medium text-green-700 dark:text-green-400">
              Delivery Available
            </span>
            {inStock && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-1" />
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  In Stock
                </span>
              </>
            )}
          </div>
        </div>

        {/* ========== ACTION BUTTONS - MAX 2 CTAs ========== */}
        <div className="flex gap-2 mt-auto pt-2">
          {/* CTA 1: Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`flex-1 group/btn text-xs font-semibold py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl transform active:scale-95 ${inStock
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAdded ? 'Added ✓' : 'Add to Cart'}</span>
          </button>

          {/* CTA 2: Buy Now - Only shown on hover or always for premium conversion */}
          <button
            onClick={handleQuickView}
            disabled={!inStock}
            className={`flex-1 text-xs font-semibold py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl transform active:scale-95 ${inStock
                ? 'bg-white dark:bg-gray-800 border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
              }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Premium Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl" />
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl" />
      </div>
    </div>
  );
});

PlantCard.displayName = 'PlantCard';

export default PlantCard;