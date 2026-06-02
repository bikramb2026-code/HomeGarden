import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [particles, setParticles] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const generateParticles = () => {
      const particleArray = [];
      for (let i = 0; i < 30; i++) {
        particleArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: 15 + Math.random() * 20,
          delay: Math.random() * 10,
          size: 2 + Math.random() * 6,
        });
      }
      setParticles(particleArray);
    };
    generateParticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5, ease: "easeOut" } },
  };

  return (
    <>
      <Helmet>
        <title>Admin Portal Login | HomeGarden Enterprise</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute bg-green-500/30 dark:bg-green-400/20 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -30, 0, 30, 0],
                x: [0, 20, 0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-green-500/20 dark:bg-green-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full filter blur-3xl animate-pulse delay-1000" />

        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="relative min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <motion.span
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="text-5xl inline-block cursor-pointer"
                    >
                      🌿
                    </motion.span>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-gray-800 to-green-700 dark:from-white dark:to-green-300 bg-clip-text text-transparent mb-2">
                HomeGarden
              </h1>
              <p className="text-gray-500 dark:text-white/40 text-sm uppercase tracking-wider mb-4">
                Admin Portal • Enterprise Access
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-500/10 backdrop-blur-sm rounded-full border border-green-300 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  <span>Secure Login</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-300 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                  <span>Protected Access</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-500/10 backdrop-blur-sm rounded-full border border-purple-300 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" clipRule="evenodd" /></svg>
                  <span>256-bit SSL</span>
                </span>
              </div>
            </motion.div>

            {/* Login Card */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field - Floating Label Only (no placeholder) */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <svg className={`w-5 h-5 transition-colors duration-200 ${emailFocused || email ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-white/30'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700/50 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-green-500 hover:border-gray-400 dark:hover:border-gray-500"
                      required
                    />
                    <label className={`absolute left-12 transition-all duration-200 pointer-events-none
                      ${emailFocused || email ? 'text-xs -top-2 bg-white dark:bg-gray-800 px-1 text-green-600 dark:text-green-400' : 'text-base top-3 text-gray-500 dark:text-white/50'}`}>
                      Email Address
                    </label>
                  </div>

                  {/* Password Field - Floating Label Only (no placeholder) */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <svg className={`w-5 h-5 transition-colors duration-200 ${passwordFocused || password ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-white/30'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-700/50 border-2 rounded-xl focus:outline-none transition-all duration-200 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-green-500 hover:border-gray-400 dark:hover:border-gray-500"
                      required
                    />
                    <label className={`absolute left-12 transition-all duration-200 pointer-events-none
                      ${passwordFocused || password ? 'text-xs -top-2 bg-white dark:bg-gray-800 px-1 text-green-600 dark:text-green-400' : 'text-base top-3 text-gray-500 dark:text-white/50'}`}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-600 dark:text-white/60 group-hover:text-gray-800 dark:group-hover:text-white/80 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <a href="#" className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 transition-colors font-medium">
                      Forgot password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Access Admin Portal</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-white/30">Enterprise Access Only</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/40 justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Two-Factor Authentication Available</span>
                  </div>
                  <div className="text-center text-gray-400 dark:text-white/30 text-[11px]">
                    Protected by HomeGarden Enterprise Security
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <p className="text-gray-500 dark:text-white/30 text-xs">
                © 2026 HomeGarden. All rights reserved.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;