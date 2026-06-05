import React, { useState } from 'react';
import { Eye, ShoppingCart, Zap, Heart, Truck, CheckCircle, Star } from 'lucide-react';

/**
 * Premium Plant Card Component
 * 
 * Improvements over your current design:
 * - Single price display with discount badge (no duplicate prices)
 * - Two primary CTAs: Add to Cart & Buy Now (Quick View = icon on image)
 * - Stock & delivery badges with visual contrast
 * - Hover: image scale, card shadow, button transitions
 * - Wishlist heart toggle (optional)
 * - Rating stars with review count
 * - Accessibility & keyboard navigation
 * - Lazy loading + image fallback
 * - Configurable currency (₹ / ₤ / $)
 * 
 * @param {Object} props
 * @param {string|number} props.id
 * @param {string} props.name
 * @param {string} props.image
 * @param {string[]} props.categories
 * @param {number} props.price          // Current price (starting price)
 * @param {number} [props.originalPrice] // For discount display
 * @param {boolean} props.inStock
 * @param {boolean} props.deliveryAvailable
 * @param {number} [props.rating=0]
 * @param {number} [props.reviewCount=0]
 * @param {Function} [props.onAddToCart]
 * @param {Function} [props.onBuyNow]
 * @param {Function} [props.onQuickView]
 * @param {Function} [props.onWishlistToggle]
 * @param {boolean} [props.isWishlisted=false]
 * @param {string} [props.currency='₹']   // '₹', '₤', '$', etc.
 */
const PlantCard = ({
  id,
  name,
  image,
  categories = [],
  price,
  originalPrice,
  inStock = true,
  deliveryAvailable = true,
  rating = 0,
  reviewCount = 0,
  onAddToCart,
  onBuyNow,
  onQuickView,
  onWishlistToggle,
  isWishlisted = false,
  currency = '₹',
}) => {
  const [imageError, setImageError] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted);

  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setWishlisted(!wishlisted);
    onWishlistToggle?.(id, !wishlisted);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    onQuickView?.(id);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Image Section with Quick View Overlay */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageError ? '/fallback-plant.jpg' : image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white shadow-md">
            {discountPercent}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition hover:bg-white"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={18}
            className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Quick View Overlay (appears on hover) */}
        <button
          onClick={handleQuickView}
          className="absolute inset-x-4 bottom-3 translate-y-full rounded-lg bg-black/70 py-2 text-center text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye size={16} className="mr-1 inline" /> Quick View
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category Chips */}
        {categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Product Name */}
        <h3 className="mb-1 line-clamp-2 text-base font-semibold text-gray-800">
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="mb-2 flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            {reviewCount > 0 && (
              <span className="text-xs text-gray-500">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">
            {currency}{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {currency}{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="text-xs text-gray-500">Starting Price</span>
        </div>

        {/* Stock & Delivery Status */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs">
          {inStock ? (
            <span className="flex items-center gap-1 text-green-700">
              <CheckCircle size={14} /> In Stock
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600">Out of Stock</span>
          )}
          {deliveryAvailable && (
            <span className="flex items-center gap-1 text-blue-600">
              <Truck size={14} /> Delivery Available
            </span>
          )}
        </div>

        {/* Action Buttons – Only TWO primary CTAs */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onAddToCart?.(id)}
            disabled={!inStock}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-emerald-600 bg-white py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
          <button
            onClick={() => onBuyNow?.(id)}
            disabled={!inStock}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-700 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Zap size={16} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;