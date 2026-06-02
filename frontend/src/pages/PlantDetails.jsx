import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PlantDetails = () => {
  const { sectionSlug, categorySlug, plantSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [plant, setPlant] = useState(null);
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (plantSlug) {
      fetchPlant();
    }
  }, [plantSlug]);

  const fetchPlant = async () => {
    try {
      setLoading(true);
      console.log('Fetching plant with slug:', plantSlug);

      const { data } = await api.get(`/plants/slug/${plantSlug}`);
      console.log('Plant data:', data);

      const plantData = data.data?.plant || data.data || data;
      setPlant(plantData);

      // Fetch related plants (same category or variety)
      if (plantData) {
        const relatedRes = await api.get(`/plants?category=${plantData.category?._id || plantData.category}&limit=8`);
        const related = relatedRes.data.data?.filter(p => p._id !== plantData._id) || [];
        setRelatedPlants(related.slice(0, 6));
      }

    } catch (err) {
      console.error('Error fetching plant:', err);
      setError(err.response?.data?.message || 'Failed to load plant details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(plant);
    toast.success(`${plant?.name || 'Plant'} added to cart!`, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: '#fff',
        padding: '16px',
        borderRadius: '16px',
        fontWeight: 'bold',
        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)',
      },
      icon: '🛒',
    });
  };

  const handleBuyNow = () => {
    addToCart(plant);
    navigate('/checkout');
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const images = plant?.images || (plant?.image ? [{ url: plant.image }] : []);
    if (images.length <= 1) return;

    if (touchStart - touchEnd > 50) {
      setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }

    if (touchStart - touchEnd < -50) {
      setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }
  };

  const handlePreviousImage = () => {
    const images = plant?.images || (plant?.image ? [{ url: plant.image }] : []);
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    const images = plant?.images || (plant?.image ? [{ url: plant.image }] : []);
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} retry={fetchPlant} />;
  if (!plant) return <ErrorMessage message="Plant not found" />;

  const section = plant.section || {};
  const category = plant.category || {};
  const variety = plant.variety || {};
  const images = plant.images || (plant.image ? [{ url: plant.image }] : []);
  const mainImage = images[selectedImage]?.url || images[0]?.url || plant.image;
  const inStock = plant.inStock !== false;
  const isPremium = plant.price >= 500;

  const specifications = [
    { icon: '🌿', label: 'Plant Type', value: section?.name || 'N/A' },
    { icon: '☀️', label: 'Sunlight', value: 'Full Sun to Partial Shade' },
    { icon: '💧', label: 'Watering', value: 'Regular, moderate watering' },
    { icon: '📏', label: 'Plant Height', value: '2-3 feet at delivery' },
    { icon: '🗓️', label: 'Fruiting Season', value: category?.name === 'Fruits' ? 'Year-round' : 'N/A' },
    { icon: '🌱', label: 'Plant Age', value: '6-8 months' },
  ];

  const trustBadges = [
    { icon: '🌱', text: 'Healthy Plant Guarantee', color: 'from-green-500 to-emerald-500' },
    { icon: '📦', text: 'Secure Packaging', color: 'from-blue-500 to-cyan-500' },
    { icon: '💬', text: 'Expert Support', color: 'from-purple-500 to-pink-500' },
    { icon: '🚚', text: 'Delivery Available', color: 'from-orange-500 to-red-500' },
  ];

  const deliveryInfo = [
    { icon: '🚚', title: 'Delivery Available', desc: 'Free delivery on orders ₹499+' },
    { icon: '📦', title: 'Safe Packaging', desc: 'Eco-friendly secure packaging' },
    { icon: '🌱', title: 'Healthy Guarantee', desc: '30-day plant health guarantee' },
    { icon: '💬', title: 'Expert Support', desc: 'Lifetime free consultation' },
  ];

  return (
    <>
      <Helmet>
        <title>{plant.name || 'Plant Details'} - HomeGarden Premium Plants</title>
        <meta name="description" content={plant.description?.substring(0, 160) || 'Premium quality plant for your home garden'} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 pb-20 lg:pb-0">

        {/* Sticky Mobile Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 p-4 lg:hidden shadow-2xl">
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              Buy Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
            <Link to="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/plants" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Plants</Link>
            {section?.name && (
              <>
                <span>/</span>
                <Link to={`/categories/${section.slug}`} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  {section.name}
                </Link>
              </>
            )}
            {category?.name && (
              <>
                <span>/</span>
                <Link to={`/categories/${section?.slug}/${category.slug}`} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  {category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{plant.name}</span>
          </div>

          {/* Back Button Mobile */}
          <div className="mb-3 sm:hidden">
            <Link
              to={category?.slug ? `/categories/${section?.slug}/${category.slug}` : '/categories'}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 text-sm font-medium transition-colors group"
            >
              <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">

            {/* Image Gallery */}
            <div className="space-y-3 lg:space-y-4">
              {/* Main Image with Zoom */}
              <div
                className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 aspect-square max-h-[500px] cursor-pointer group"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsZoomed(true)}
              >
                <motion.img
                  ref={imageRef}
                  src={mainImage}
                  alt={plant.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800';
                  }}
                />

                {/* Zoom Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2 backdrop-blur-sm">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  {isPremium && inStock && (
                    <span className="px-2 py-1 lg:px-3 lg:py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] lg:text-xs font-bold rounded-full shadow-lg animate-pulse">
                      PREMIUM
                    </span>
                  )}
                </div>

                {!inStock && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-1 lg:px-3 lg:py-1.5 bg-red-500/90 backdrop-blur-sm text-white text-[10px] lg:text-xs font-bold rounded-full shadow-lg">
                      OUT OF STOCK
                    </span>
                  </div>
                )}

                {/* Navigation Arrows Desktop */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePreviousImage(); }}
                      className="hidden lg:flex absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                    >
                      <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                      className="hidden lg:flex absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
                    >
                      <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Dots */}
              {images.length > 1 && (
                <div className="flex justify-center items-center gap-2 lg:hidden">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`transition-all rounded-full ${selectedImage === index ? 'w-6 h-2 bg-green-600' : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
              )}

              {/* Desktop Thumbnails */}
              {images.length > 1 && (
                <div className="hidden lg:grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${selectedImage === index ? 'border-green-500 shadow-lg shadow-green-500/30' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                      <img src={img.url} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Plant Details */}
            <div className="space-y-5 lg:space-y-6">

              {/* Title Section */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {plant.name}
                </h1>

                {/* Category Tags - Same as Plant Card */}
                <div className="flex flex-wrap gap-2">
                  {section?.name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-semibold border border-green-200 dark:border-green-800">
                      <span>🌿</span> {section.name}
                    </span>
                  )}
                  {category?.name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-semibold border border-blue-200 dark:border-blue-800">
                      <span>📂</span> {category.name}
                    </span>
                  )}
                  {variety?.name && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full font-semibold border border-purple-200 dark:border-purple-800">
                      <span>🍊</span> {variety.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Stock */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Starting Price</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400">₹{plant.price}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/ plant</span>
                  </div>
                </div>
                {inStock && (
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">In Stock</span>
                  </div>
                )}
              </div>

              {/* Plant Information Card - Consistent with Plant Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                  Plant Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">🌱 Section</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{section?.name || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">📂 Category</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{category?.name || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">🍊 Variety</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{variety?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                  Description
                </h3>
                <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                  {plant.description || 'Premium quality plant for your home garden. Hand-picked and carefully nurtured.'}
                </p>
                {plant.description?.length > 150 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 text-green-600 dark:text-green-400 text-sm font-medium hover:underline"
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>

              {/* Specifications */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-green-500 rounded-full"></span>
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{spec.icon}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{spec.label}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🚚</span> Delivery Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {deliveryInfo.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.title}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2">
                {trustBadges.map((badge, idx) => (
                  <div key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${badge.color} bg-opacity-10 rounded-full border border-white/20`}>
                    <span className="text-sm">{badge.icon}</span>
                    <span className="text-xs text-gray-700 dark:text-white font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Add to Cart
                  </span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="flex-1 group relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Buy Now
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Related Plants Section */}
          {relatedPlants.length > 0 && (
            <div className="mt-12 lg:mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                  You May Also Like
                </h2>
                <Link to="/plants" className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline">
                  View All →
                </Link>
              </div>

              <div className="overflow-x-auto pb-4 -mx-3 px-3 scrollbar-hide">
                <div className="flex gap-4 min-w-max">
                  {relatedPlants.map((relatedPlant) => (
                    <Link
                      key={relatedPlant._id}
                      to={`/categories/${relatedPlant.section?.slug}/${relatedPlant.category?.slug}/${relatedPlant.slug}`}
                      className="w-[280px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={relatedPlant.images?.[0]?.url || relatedPlant.image}
                          alt={relatedPlant.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400';
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{relatedPlant.name}</h3>
                        <p className="text-green-600 dark:text-green-400 font-bold mt-1">₹{relatedPlant.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zoom Modal */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 cursor-zoom-out"
            >
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={mainImage}
                alt={plant.name}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Scrollbar Hide for Related Plants */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default PlantDetails;