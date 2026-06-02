import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/useAuth";
import api from "../../services/api";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    sections: 0,
    categories: 0,
    varieties: 0,
    plants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Set greeting once on mount (no re-renders)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Set date once
    setCurrentDate(new Date());
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const fetchStats = useCallback(async (showRefreshAnimation = false) => {
    try {
      if (showRefreshAnimation) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [sectionsRes, categoriesRes, varietiesRes, plantsRes] = await Promise.all([
        api.get("/sections"),
        api.get("/categories"),
        api.get("/varieties"),
        api.get("/plants", { params: { limit: 100 } }),
      ]);

      const newStats = {
        sections: sectionsRes.data.data?.length || 0,
        categories: categoriesRes.data.data?.length || 0,
        varieties: varietiesRes.data.data?.length || 0,
        plants: plantsRes.data.total || plantsRes.data.data?.length || 0,
      };

      setStats(newStats);
      setLastUpdated(new Date());

      // Build recent activity
      const activities = [];

      if (sectionsRes.data.data?.length > 0) {
        sectionsRes.data.data.slice(-2).forEach((item) => {
          activities.push({
            type: "section",
            action: "created",
            name: item.name,
            time: new Date(item.createdAt).toLocaleString(),
            icon: "📑",
          });
        });
      }

      if (categoriesRes.data.data?.length > 0) {
        categoriesRes.data.data.slice(-2).forEach((item) => {
          activities.push({
            type: "category",
            action: "created",
            name: item.name,
            time: new Date(item.createdAt).toLocaleString(),
            icon: "📂",
          });
        });
      }

      if (varietiesRes.data.data?.length > 0) {
        varietiesRes.data.data.slice(-2).forEach((item) => {
          activities.push({
            type: "variety",
            action: "created",
            name: item.name,
            time: new Date(item.createdAt).toLocaleString(),
            icon: "🔖",
          });
        });
      }

      if (plantsRes.data.data?.length > 0) {
        plantsRes.data.data.slice(-2).forEach((item) => {
          activities.push({
            type: "plant",
            action: "created",
            name: item.name,
            time: new Date(item.createdAt).toLocaleString(),
            icon: "🌱",
          });
        });
      }

      setRecentActivity(activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data fetch - only once
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleRefresh = () => {
    fetchStats(true);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const statCards = [
    { label: "Sections", value: stats.sections, icon: "📑", link: "/admin/sections", color: "blue", description: "Manage main categories", bgGradient: "from-blue-500/20 to-blue-600/20" },
    { label: "Categories", value: stats.categories, icon: "📂", link: "/admin/categories", color: "green", description: "Organize sub-categories", bgGradient: "from-green-500/20 to-emerald-600/20" },
    { label: "Varieties", value: stats.varieties, icon: "🔖", link: "/admin/varieties", color: "purple", description: "Add specific varieties", bgGradient: "from-purple-500/20 to-purple-600/20" },
    { label: "Plants", value: stats.plants, icon: "🌱", link: "/admin/plants", color: "orange", description: "Manage inventory", bgGradient: "from-orange-500/20 to-orange-600/20" },
  ];

  const quickActions = [
    { title: "Add Section", icon: "➕", link: "/admin/sections", color: "blue", description: "Create new section" },
    { title: "Add Category", icon: "➕", link: "/admin/categories", color: "green", description: "Create new category" },
    { title: "Add Variety", icon: "➕", link: "/admin/varieties", color: "purple", description: "Create new variety" },
    { title: "Add Plant", icon: "➕", link: "/admin/plants", color: "orange", description: "Create new plant" },
  ];

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', active: true },
    { path: '/admin/sections', label: 'Sections', icon: '📑' },
    { path: '/admin/categories', label: 'Categories', icon: '📂' },
    { path: '/admin/varieties', label: 'Varieties', icon: '🔖' },
    { path: '/admin/plants', label: 'Plants', icon: '🌱' },
  ];

  const slideIn = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.3 } }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const StatCard = ({ stat, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative"
    >
      <Link to={stat.link}>
        <div className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <div className="text-right">
              {loading && !refreshing ? (
                <div className="w-16 h-8 bg-white/10 rounded-lg animate-pulse" />
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 + 0.3 }}
                  className="text-3xl font-bold text-white"
                >
                  {stat.value}
                </motion.div>
              )}
              <div className="text-xs text-white/50 mt-1">Total</div>
            </div>
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">{stat.label}</h3>
          <p className="text-white/40 text-sm">{stat.description}</p>
          <div className="mt-4 flex items-center text-green-400 text-sm font-medium group-hover:translate-x-2 transition-transform">
            Manage
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | HomeGarden</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Premium Sticky Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-xl shadow-2xl' : 'bg-transparent'
            }`}
        >
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Menu Toggle */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200"
                  aria-label="Open menu"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <motion.span
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="text-3xl cursor-pointer"
                  >
                    🌿
                  </motion.span>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                      HomeGarden
                    </h1>
                    <p className="text-xs text-white/50">Admin Portal</p>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 group"
                  aria-label="Refresh dashboard"
                >
                  <svg
                    className={`w-5 h-5 text-white/70 group-hover:text-white transition-colors ${refreshing ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-white text-sm font-medium">{greeting}, {user?.name?.split(' ')[0]}</p>
                    <p className="text-white/40 text-xs">{formatDate(currentDate)}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 transition-all duration-200 group"
                    aria-label="Logout"
                  >
                    <svg className="w-5 h-5 text-white/70 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Welcome Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full filter blur-3xl animate-pulse" />
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {greeting}, {user?.name?.split(' ')[0]}! 👋
                </h2>
                <p className="text-white/60 text-sm max-w-2xl">
                  Welcome back to your dashboard. Here's your nursery performance overview.
                </p>
                {lastUpdated && (
                  <p className="text-white/30 text-xs mt-2">
                    Last updated: {formatTime(lastUpdated)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={action.link}
                    className="block bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-green-500/50 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${action.color}-500/20 to-${action.color}-600/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{action.title}</h4>
                    <p className="text-white/40 text-xs">{action.description}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Analytics & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-5 border-b border-white/10">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                    Recent Activity
                  </h3>
                </div>
                {loading && !refreshing ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse mb-2" />
                          <div className="h-3 bg-white/10 rounded w-1/2 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="divide-y divide-white/10">
                    {recentActivity.map((activity, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-xl">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              <span className="font-semibold">{activity.name}</span>
                              <span className="text-white/60"> was {activity.action}</span>
                            </p>
                            <p className="text-white/40 text-xs mt-1">{activity.time}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                            {activity.type}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="text-5xl mb-3 opacity-30 animate-bounce">📊</div>
                    <p className="text-white/60">No recent activity</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info Cards */}
            <div className="space-y-4">
              {[
                { icon: '💡', title: 'Pro Tip', content: 'Organize your plants in a hierarchy: Sections → Categories → Varieties for better navigation.', color: 'green', gradient: 'from-green-500/10 to-emerald-600/10' },
                { icon: '🚀', title: 'Quick Start', content: 'Start by adding Sections, then Categories, then Varieties, and finally Plants.', color: 'blue', gradient: 'from-blue-500/10 to-cyan-600/10' },
                { icon: '📸', title: 'Images', content: 'Add high-quality images to all items. First image is primary. You can add up to 3 images per plant.', color: 'purple', gradient: 'from-purple-500/10 to-pink-600/10' },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className={`bg-gradient-to-r ${card.gradient} backdrop-blur-sm rounded-xl p-4 border border-${card.color}-500/20 hover:border-${card.color}-500/40 transition-all duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${card.color}-500/20 to-${card.color}-600/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">{card.title}</h4>
                      <p className="text-white/60 text-xs leading-relaxed">{card.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Summary Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-white/60 text-xs">Sections: <span className="text-blue-400 font-semibold">{stats.sections}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white/60 text-xs">Categories: <span className="text-green-400 font-semibold">{stats.categories}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-white/60 text-xs">Varieties: <span className="text-purple-400 font-semibold">{stats.varieties}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-white/60 text-xs">Plants: <span className="text-orange-400 font-bold">{stats.plants}</span></span>
                </div>
              </div>
              <div className="text-white/40 text-[11px] flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lastUpdated ? `Updated ${formatTime(lastUpdated)}` : 'Ready'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium Mobile Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.div
                variants={slideIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-0 left-0 bottom-0 w-[280px] bg-gradient-to-br from-gray-900 to-gray-950 backdrop-blur-xl z-50 shadow-2xl rounded-r-3xl lg:hidden"
              >
                <div className="p-5 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.span
                        className="text-3xl"
                        whileHover={{ rotate: 15 }}
                      >
                        🌿
                      </motion.span>
                      <span className="text-lg font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                        HomeGarden
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"
                      aria-label="Close menu"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                    <p className="text-white/60 text-xs">Logged in as</p>
                    <p className="text-white font-medium text-sm">{user?.name}</p>
                  </div>
                </div>
                <div className="p-4">
                  {menuItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${item.active
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                        />
                      )}
                    </Link>
                  ))}
                  <div className="h-px bg-white/10 my-3" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <span className="text-xl">🚪</span>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminDashboard;