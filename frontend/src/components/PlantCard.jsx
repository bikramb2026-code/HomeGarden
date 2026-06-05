import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, memo } from 'react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Fallback image
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&auto=format';

// Helper: random rating (replace with real data later)
const getRating = () => (4 + Math.random()).toFixed(1);
const getReviewCount = () => Math.floor(Math.random() * 5000) + 50;

const Skeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-lg" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

const PlantCardComponent = ({ plant }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imgSrc, setImgSrc] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const inStock = plant.inStock !== false;
  const isPremium = plant.price >= 500;
  const rating = getRating();
  const reviewCount = getReviewCount();

  useEffect(() => {
    const imageUrl = plant.images?.[0]?.url || plant.images?.[0] || plant.image || FALLBACK_IMAGE;
    setImgSrc(imageUrl);
  }, [plant]);

  const handleImageError = () => setImgSrc(FALLBACK_IMAGE);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plant);
    setIsAdded(true);
    toast.success(`${plant.name || 'Item'} added to cart`, {
      duration: 1500,
      position: 'bottom-center',
      style: { background: '#16a34a', color: '#fff' },
    });
    setTimeout(() => setIsAdded(false), 1000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(plant);
    navigate('/checkout');
  };

  const formattedPrice = new Intl.NumberFormat('en-IN').format(plant.price || 0);
  const varietyName = plant.variety?.name || plant.variety || '';
  const categoryName = plant.category?.name || '';

  return (
    <Link
      to={`/plant/${plant.slug}`}
      className="block group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative bg-gray-100 rounded-t-lg overflow-hidden">
        <div className="aspect-square w-full">
          {!isImageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
          <img
            src={imgSrc}
            alt={plant.name}
            className={`w-full h-full object-cover transition-opacity ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onError={handleImageError}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>
        {isPremium && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            PREMIUM
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Category / variety line */}
        <div className="text-[11px] text-gray-500 mb-1">
          {categoryName && `${categoryName} `}
          {varietyName && `• ${varietyName}`}
        </div>

        {/* Title - 2 lines max */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-green-700">
          {plant.name}
        </h3>

        {/* Rating (Amazon style) */}
        <div className="flex items-center gap-1 my-1">
          <div className="flex text-[11px] text-amber-400">
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
          </div>
          <span className="text-[10px] text-gray-500">{rating}</span>
          <span className="text-[10px] text-gray-400">({reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="mt-1">
          <span className="text-xl font-bold text-gray-900">₹{formattedPrice}</span>
          <span className="text-[10px] text-gray-500 ml-1">Starting at</span>
        </div>

        {/* Stock & delivery */}
        <div className="flex items-center justify-between mt-2 text-[10px]">
          {inStock ? (
            <span className="text-green-700 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
          <span className="text-gray-500">🚚 Free Delivery</span>
        </div>

        {/* Buttons (Amazon: Add to Cart link + Buy Now button) */}
        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full py-2 rounded-md text-sm font-medium transition ${inStock
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isAdded ? '✓ Added' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!inStock}
            className={`w-full py-2 rounded-md text-sm font-medium transition ${inStock
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export const PlantCard = memo(PlantCardComponent);
export const PlantCardSkeleton = Skeleton;
export default PlantCard;