import { useState, useEffect } from 'react';
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

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} retry={fetchData} />;
  if (!variety) return <ErrorMessage message="Variety not found" />;

  return (
    <>
      <Helmet>
        <title>{variety.name} - {category?.name} - HomeGarden</title>
        <meta name="description" content={`Browse all ${variety.name} plants available at HomeGarden. Find premium quality ${variety.name} plants for your garden.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3 flex-wrap">
              <Link to="/" className="hover:text-green-600">Home</Link>
              <span>/</span>
              <Link to="/categories" className="hover:text-green-600">Categories</Link>
              <span>/</span>
              <Link to={`/categories/${section?.slug}`} className="hover:text-green-600">{section?.name}</Link>
              <span>/</span>
              <Link to={`/categories/${section?.slug}/${category?.slug}`} className="hover:text-green-600">{category?.name}</Link>
              <span>/</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">{variety?.name}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {variety.name} Plants
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {plants.length} {plants.length === 1 ? 'plant' : 'plants'} available in this variety
            </p>
          </div>

          {/* Variety Description if available */}
          {variety.description && (
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300">{variety.description}</p>
            </div>
          )}

          {/* Plants Grid */}
          {plants.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-600 dark:text-gray-400">No plants available in this variety yet.</p>
              <Link
                to={`/categories/${section?.slug}/${category?.slug}`}
                className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                ← Back to varieties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {plants.map(plant => (
                <PlantCard key={plant._id} plant={plant} />
              ))}
            </div>
          )}

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              to={`/categories/${section?.slug}/${category?.slug}`}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 text-sm font-medium transition-colors group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {category?.name} Varieties
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VarietyPlants;