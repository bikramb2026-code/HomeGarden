import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { name: 'Fruits', slug: 'fruits', icon: '🍎', color: 'from-red-500 to-orange-500' },
    { name: 'Flowers', slug: 'flowers', icon: '🌸', color: 'from-pink-500 to-rose-500' },
    { name: 'Indoor Plants', slug: 'indoor-plants', icon: '🏠', color: 'from-green-500 to-emerald-500' },
    { name: 'Outdoor Plants', slug: 'outdoor-plants', icon: '🌳', color: 'from-teal-500 to-cyan-500' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com', color: 'hover:bg-blue-600' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com', color: 'hover:bg-pink-600' },
    { name: 'YouTube', icon: '▶️', url: 'https://youtube.com', color: 'hover:bg-red-600' },
    { name: 'WhatsApp', icon: '💬', url: 'https://wa.me/918597511728', color: 'hover:bg-green-600' }
  ];

  const trustBadges = [
    { icon: '🚚', text: 'Fast Delivery', accent: 'from-green-500 to-emerald-500' },
    { icon: '💚', text: 'Fresh Guarantee', accent: 'from-emerald-500 to-teal-500' },
    { icon: '🌱', text: 'Expert Support', accent: 'from-teal-500 to-cyan-500' },
    { icon: '⭐', text: 'Premium Quality', accent: 'from-amber-500 to-yellow-500' }
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'All Plants', path: '/plants' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const footerLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Refund Policy', path: '/refund' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white overflow-hidden mt-auto">
      {/* Decorative Background - Premium Glass Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Footer Content */}
      <div className={`relative container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Section 1: Brand Area - Premium Redesign */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <div className="text-4xl sm:text-5xl animate-bounce">🌿</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              HomeGarden
            </h2>
          </div>
          <p className="text-green-400 text-sm sm:text-base font-semibold mb-2">
            Premium Plants & Nursery
          </p>
          <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto px-4">
            Bringing nature closer to your home with healthy, high-quality plants.
          </p>
          
          {/* Trust Rating - Premium */}
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">★</span>
              ))}
            </div>
            <span className="text-xs text-gray-300 font-medium">Trusted by Plant Lovers</span>
          </div>
        </div>

        {/* Main Grid - Optimized for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          
          {/* Section 2: Quick Links - 2 Column Layout */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-500 inline-block">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-gray-400 hover:text-green-400 text-sm py-1.5 transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-1 group"
                >
                  <span className="w-0 group-hover:w-1.5 h-1.5 bg-green-500 rounded-full transition-all duration-300"></span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Section 3: Categories - Premium Badge Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-500 inline-block">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat, index) => (
                <Link
                  key={index}
                  to={`/categories/${cat.slug}`}
                  className={`group relative overflow-hidden bg-gradient-to-r ${cat.color} bg-opacity-10 hover:bg-opacity-20 rounded-lg p-2.5 transition-all duration-300 hover:scale-105 border border-white/10`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-xs font-medium text-white">{cat.name}</span>
                  </div>
                  <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 4: Contact Information - Compact Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-500 inline-block">
              Contact
            </h3>
            <div className="space-y-2">
              {/* Phone Card */}
              <a
                href="tel:+918597511728"
                className="flex items-center gap-3 p-2.5 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 group border border-white/10"
              >
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-green-400 text-base">📞</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400">Call Us</p>
                  <p className="text-xs font-medium text-white">+91 8597511728</p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:Bikramb2026@gmail.com"
                className="flex items-center gap-3 p-2.5 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300 group border border-white/10"
              >
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-green-400 text-base">✉️</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400">Email Us</p>
                  <p className="text-xs font-medium text-white truncate">Bikramb2026@gmail.com</p>
                </div>
              </a>

              {/* Address Card - Compact */}
              <div className="flex items-start gap-3 p-2.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 text-base">📍</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 mb-0.5">Nursery Address</p>
                  <p className="text-[11px] text-white leading-tight">
                    Nahata Bokchara Road,<br />
                    Near Biswas Para More,<br />
                    Pincode: 743290, West Bengal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Google Maps Card - Premium Redesign */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-500 inline-block">
              Location
            </h3>
            <a
              href="https://maps.app.goo.gl/nDYcFMPxgpPmhYwQ6?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-3 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] text-green-200 uppercase tracking-wider">Open in</p>
                  <p className="text-sm font-bold text-white">Google Maps</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <span className="text-white text-xl">🗺️</span>
                </div>
              </div>
              <p className="text-[10px] text-green-200 mt-1 truncate relative z-10">
                XPQ5+C54 Ichhlampur, West Bengal
              </p>
            </a>
          </div>
        </div>

        {/* Section 6: Trust Badges - Premium Compact Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden bg-gradient-to-r ${badge.accent} bg-opacity-10 hover:bg-opacity-20 rounded-full px-3 py-1.5 transition-all duration-300 hover:scale-105 border border-white/10`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{badge.icon}</span>
                <span className="text-[11px] font-medium text-white whitespace-nowrap">{badge.text}</span>
              </div>
              <div className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Section 7: Social Media - Premium Circular Icons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color} border border-white/20`}
            >
              <span className="text-lg">{social.icon}</span>
            </a>
          ))}
        </div>

        {/* Section 8: Footer Bottom - Premium Footer Links */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-500 text-center">
              © {currentYear} HomeGarden. All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {footerLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-[11px] text-gray-500 hover:text-green-400 transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Glass Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full filter blur-2xl"></div>
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full filter blur-2xl"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;