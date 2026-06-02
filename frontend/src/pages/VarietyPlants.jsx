import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import PlantCard from '../components/PlantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const VarietyPlants = () => {
  const { sectionSlug, categorySlug, varietySlug } = useParams();
  const [section, setSection] = useState(null);
  const [category, setCategory] = useState(null);
  const [variety, setVariety] = useState(null);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [sectionSlug, categorySlug, varietySlug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch section
      const sectionRes = await api.get(`/sections/slug/${sectionSlug}`);
      const sectionData = sectionRes.data.data?.section || sectionRes.data;
      setSection(sectionData);

      // Fetch category
      const categoryRes = await api.get(`/categories/slug/${categorySlug}`);
      const categoryData = categoryRes.data.data?.category || categoryRes.data;
      setCategory(categoryData);

      // Fetch variety by slug - this returns variety AND its plants
      const varietyRes = await api.get(`/varieties/slug/${varietySlug}`);
      const varietyData = varietyRes.data.data?.variety || varietyRes.data;
      setVariety(varietyData);

      // Plants are included in the response
      const plantsData = varietyRes.data.data?.plants || [];
      setPlants(plantsData);

    } catch (err) {
      console.error('Error fetching variety plants:', err);
      setError('Failed to load plants for this variety');
    } finally {
      setLoading(false);
    }
  };

  // Filter plants based on search term
  const filteredPlants = useMemo(() => {
    if (!searchTerm.trim()) {
      return plants;
    }

    const term = searchTerm.toLowerCase().trim();
    return plants.filter(plant =>
      plant.name.toLowerCase().includes(term) ||
      (plant.description && plant.description.toLowerCase().includes(term))
    );
  }, [plants, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} retry={fetchData} />;
  if (!variety) return <ErrorMessage message="Variety not found" />;

  const hasSearchResults = filteredPlants.length > 0;
  const totalPlants = plants.length;

  return (
    <>
      <Helmet>
        <title>{variety.name} - {category?.name} - HomeGarden</title>
        <meta name="description" content={`Browse all ${variety.name} plants available at HomeGarden. Find premium quality ${variety.name} plants for your garden.`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-7xl">

          {/* Breadcrumb Navigation - Premium */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 flex-wrap">
              <Link to="/" className="hover:text-green-600 transition-colors duration-200 flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <Link to="/categories" className="hover:text-green-600 transition-colors duration-200">Categories</Link>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <Link to={`/categories/${section?.slug}`} className="hover:text-green-600 transition-colors duration-200">{section?.name}</Link>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <Link to={`/categories/${section?.slug}/${category?.slug}`} className="hover:text-green-600 transition-colors duration-200">{category?.name}</Link>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">{variety?.name}</span>
            </div>

            {/* Header Section with Animation */}
            <div className="text-center mb-6 sm:mb-8 animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {variety.name} Plants
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/40 px-3 py-1.5 rounded-full">
                  <span className="text-green-700 dark:text-green-300 text-sm font-semibold">
                    🌱 {totalPlants} {totalPlants === 1 ? 'Plant' : 'Plants'} Available
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 animate-slideUp">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${variety.name} plants by name or description...`}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-12 sm:pl-14 pr-12 py-3 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                  {/* Search Icon */}
                  <svg
                    className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-green-500 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>

                  {/* Clear Search Button */}
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label="Clear search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Search Results Count */}
              {searchTerm && (
                <div className="mt-2 text-center animate-fadeIn">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Found {filteredPlants.length} {filteredPlants.length === 1 ? 'plant' : 'plants'} matching "{searchTerm}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Plants Grid Section */}
          <div className="animate-fadeIn">
            {!hasSearchResults ? (
              <div className="text-center py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="text-6xl sm:text-7xl mb-4 animate-bounce">🔍</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Plants Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4">
                  {searchTerm
                    ? `No plants match "${searchTerm}" in ${variety.name} variety.`
                    : `No plants available in ${variety.name} variety yet.`}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="mt-6 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    Clear Search
                  </button>
                )}
                {!searchTerm && (
                  <Link
                    to={`/categories/${section?.slug}/${category?.slug}`}
                    className="inline-flex items-center mt-6 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Browse Other Varieties
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Results Header with Animation */}
                <div className="mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      {searchTerm ? 'Search Results' : 'All Plants'}
                    </h2>
                    <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      <span className="text-green-700 dark:text-green-400 text-xs font-medium">
                        {filteredPlants.length} items
                      </span>
                    </div>
                  </div>
                </div>

                {/* Premium Plants Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                  {filteredPlants.map((plant, index) => (
                    <div
                      key={plant._id}
                      className="animate-cardFadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PlantCard plant={plant} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Back Button with Premium Design */}
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              to={`/categories/${section?.slug}/${category?.slug}`}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-200 dark:border-gray-700"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to {category?.name} Varieties</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-cardFadeIn {
          animation: cardFadeIn 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default VarietyPlants;