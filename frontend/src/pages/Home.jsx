import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import CategoryCard from '../components/CategoryCard';
import PlantCard from '../components/PlantCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [sections, setSections] = useState([]);
  const [sectionsWithCounts, setSectionsWithCounts] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    plants: 0,
    categories: 0,
    varieties: 0,
    customers: '1k+'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all sections
      const sectionsRes = await api.get('/sections');
      const allSections = sectionsRes.data.data || [];
      const firstSixSections = allSections.slice(0, 6);
      setSections(firstSixSections);

      // Fetch all plants
      const plantsRes = await api.get('/plants');
      const plants = plantsRes.data.data || [];
      setAllPlants(plants);
      setFeaturedPlants(plants.slice(0, 8));

      // Fetch counts for stats
      const categoriesRes = await api.get('/categories');
      const varietiesRes = await api.get('/varieties');

      setStats({
        plants: plants.length,
        categories: categoriesRes.data.data?.length || 0,
        varieties: varietiesRes.data.data?.length || 0,
        customers: '2k+'
      });

      // Fetch plant counts for each section
      const sectionsWithPlantCounts = await Promise.all(
        firstSixSections.map(async (section) => {
          try {
            const plantsInSection = await api.get(`/plants?section=${section._id}&limit=1`);
            const plantCount = plantsInSection.data.total || 0;
            return { ...section, plantCount };
          } catch (error) {
            return { ...section, plantCount: 0 };
          }
        })
      );

      setSectionsWithCounts(sectionsWithPlantCounts);

    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter plants based on search and tab
  const filteredPlants = useMemo(() => {
    let plants = [...featuredPlants];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      plants = plants.filter(plant =>
        plant.name.toLowerCase().includes(term) ||
        (plant.description && plant.description.toLowerCase().includes(term))
      );
    }

    // Apply tab filter
    if (activeTab === 'bestsellers') {
      plants = plants.filter(plant => plant.isBestSeller);
    } else if (activeTab === 'newarrivals') {
      plants = plants.filter(plant => plant.isNewArrival);
    }

    return plants;
  }, [featuredPlants, searchTerm, activeTab]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const tabs = [
    { id: 'all', label: 'All Plants', icon: '🌿' },
    { id: 'bestsellers', label: 'Best Sellers', icon: '🔥' },
    { id: 'newarrivals', label: 'New Arrivals', icon: '✨' }
  ];

  const trustBadges = [
    { icon: '✓', text: 'Healthy Plants', color: 'from-green-500 to-emerald-500' },
    { icon: '✓', text: 'Expert Support', color: 'from-blue-500 to-cyan-500' },
    { icon: '✓', text: 'Secure Ordering', color: 'from-purple-500 to-pink-500' }
  ];

  const deliveryFeatures = [
    { icon: '📦', title: 'Safe Packaging', desc: 'Eco-friendly secure packaging' },
    { icon: '💚', title: 'Healthy Guarantee', desc: '30-day plant health guarantee' },
    { icon: '⚡', title: 'Fast Dispatch', desc: '24-48 hour dispatch' },
    { icon: '🏪', title: 'Local Support', desc: 'West Bengal based nursery' }
  ];

  return (
    <>
      <Helmet>
        <title>HomeGarden - Premium Plants for Your Home & Garden | West Bengal's Trusted Nursery</title>
        <meta name="description" content="Discover luxury plants for your home and garden. Premium quality fruits, flowers, indoor and outdoor plants. Trusted nursery in West Bengal with 2000+ happy customers." />
        <meta name="keywords" content="premium plants, nursery, garden, indoor plants, outdoor plants, West Bengal nursery" />
        <link rel="canonical" href="https://homegarden.co.in" />
      </Helmet>

      {/* Hero Section - Premium Modern Design */}
      <section className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Zoom Animation */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&auto=format&fit=crop"
            alt="Luxury Garden"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        {/* Floating Leaf Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl md:text-3xl opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 10}s`
              }}
            >
              {['🌿', '🍃', '🌱', '🍂', '🍁'][i % 5]}
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Trust Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20"
            >
              <span className="text-green-400 text-sm">🌱</span>
              <span className="text-white text-xs md:text-sm font-medium">Trusted Nursery in West Bengal</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            >
              Bring Nature
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 block">
                Into Your Home
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Discover our curated collection of {stats.plants}+ premium plants. Each plant is hand-picked and nurtured with care.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-3 mb-8"
            >
              {trustBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${badge.color} bg-opacity-20 rounded-full border border-white/20`}
                >
                  <span className="text-green-400 text-xs font-bold">{badge.icon}</span>
                  <span className="text-white text-xs md:text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/plants"
                className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3.5 md:px-12 md:py-4 rounded-full text-sm md:text-base font-semibold transition-all transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Explore Collection
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>

              <Link
                to="/contact"
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-3.5 md:px-12 md:py-4 rounded-full text-sm md:text-base font-semibold transition-all border border-white/30 flex items-center justify-center"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Talk to Expert
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{stats.plants}+</div>
                <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider mt-1">Plants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{stats.categories}+</div>
                <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider mt-1">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{stats.customers}</div>
                <div className="text-xs md:text-sm text-gray-300 uppercase tracking-wider mt-1">Happy Customers</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/80 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Categories Section - Premium Design */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div className="text-center md:text-left">
              <span className="text-green-600 dark:text-green-400 font-semibold text-sm tracking-[0.2em] uppercase mb-2 block">
                Our Collections
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                Explore our featured categories and find your perfect green companion.
              </p>
            </div>

            <Link
              to="/categories"
              className="group inline-flex items-center text-green-600 dark:text-green-400 font-semibold mt-4 md:mt-0 hover:text-green-700 transition-colors"
            >
              <span>View All Categories</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5"
            >
              {sectionsWithCounts.map((section) => (
                <motion.div key={section._id} variants={fadeInUp}>
                  <CategoryCard category={section} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Plants Section - With Tabs & Search */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-green-600 dark:text-green-400 font-semibold text-sm tracking-[0.2em] uppercase mb-2 block">
              Editor's Choice
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Plants
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hand-selected premium plants that our customers love
            </p>
          </motion.div>

          {/* Premium Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Premium Search Bar */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search plants by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white text-sm placeholder-gray-500 transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {filteredPlants.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Plants Found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? `No plants match "${searchTerm}"` : 'No plants available'}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 text-green-600 hover:text-green-700 font-medium"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
                >
                  {filteredPlants.map((plant) => (
                    <motion.div key={plant._id} variants={fadeInUp}>
                      <PlantCard plant={plant} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}

          <div className="text-center mt-12">
            <Link
              to="/plants"
              className="group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full hover:shadow-xl transition-all hover:scale-105"
            >
              <span>View All Plants</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Premium Glassmorphism */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="text-green-400 font-semibold text-sm tracking-[0.2em] uppercase mb-2 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Experience the HomeGarden Difference
            </h2>
            <p className="text-gray-300 text-base md:text-lg">
              Premium quality plants with expert care support
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🌱', title: 'Premium Quality', description: 'Every plant is hand-picked by expert horticulturists', color: 'from-green-500/20 to-emerald-500/20' },
              { icon: '🚚', title: 'Free Delivery', description: 'Free delivery on orders over ₹499', color: 'from-blue-500/20 to-cyan-500/20' },
              { icon: '💚', title: 'Lifetime Support', description: 'Free expert advice for the life of your plants', color: 'from-purple-500/20 to-pink-500/20' },
              { icon: '🌿', title: 'Eco-Friendly', description: 'Sustainable practices and biodegradable pots', color: 'from-green-500/20 to-emerald-500/20' },
              { icon: '💰', title: 'Best Prices', description: 'Competitive prices with 100% satisfaction guarantee', color: 'from-amber-500/20 to-orange-500/20' },
              { icon: '🏆', title: 'Guaranteed Health', description: '30-day healthy plant guarantee', color: 'from-red-500/20 to-rose-500/20' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden bg-gradient-to-br ${feature.color} backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-all duration-300 border border-white/10`}
              >
                <div className="relative z-10">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Section - Premium Compact Design */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <span className="text-2xl">🚚</span>
              <span className="text-green-700 dark:text-green-400 font-semibold text-sm">Delivery Available Across West Bengal</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              We Deliver Happiness to Your Doorstep
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Fast, safe, and reliable delivery</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {deliveryFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-green-100 mb-8 text-base md:text-lg">
              Join over 2,000+ happy customers who have brought nature into their homes
            </p>
            <Link
              to="/plants"
              className="group inline-flex items-center bg-white text-green-600 px-8 py-3.5 md:px-10 md:py-4 rounded-full text-base md:text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all"
            >
              Start Shopping
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp Button - Premium */}
      <a
        href="https://wa.me/918597511728"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group"
      >
        <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771z" />
        </svg>
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
      </a>

      {/* Custom Animations */}
      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-out forwards;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Home;