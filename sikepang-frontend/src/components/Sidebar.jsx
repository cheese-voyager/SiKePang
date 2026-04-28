import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Package, Warehouse, Truck,
  Menu, X, ChevronDown, LogOut, Bell, Leaf, Sun, Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'petani', label: 'Data Petani', icon: Users },
  { id: 'komoditas', label: 'Komoditas', icon: Package },
  { id: 'stok', label: 'Stok Pangan', icon: Warehouse },
  { id: 'distribusi', label: 'Distribusi', icon: Truck },
];

export default function Sidebar({ activePage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsOpen(true);
      else setIsOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigate = (id) => {
    onNavigate(id);
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger */}
      {isMobile && (
        <button
          id="sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-plantation-800 text-white shadow-lg hover:bg-plantation-700 transition-colors lg:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -280 } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : undefined}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-screen w-[280px] bg-plantation-gradient z-40 flex flex-col overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-plantation-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-leaf-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Logo */}
            <div className="relative px-6 py-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-plantation-400 to-leaf-500 flex items-center justify-center shadow-glow">
                  <Leaf size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">SiKePang</h1>
                  <p className="text-[10px] text-plantation-300 font-medium tracking-wider uppercase">Ketahanan Pangan</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              <p className="text-[10px] uppercase tracking-widest text-plantation-400 font-semibold px-4 mb-3">Menu Utama</p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    id={`nav-${item.id}`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full ${isActive ? 'sidebar-link-active' : 'sidebar-link'}`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="relative px-4 py-4 border-t border-white/10">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-leaf-400 to-plantation-500 flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Admin Utama</p>
                  <p className="text-[11px] text-plantation-300 truncate">admin@sikepang.id</p>
                </div>
                <Link to="/" className="text-plantation-700 font-semibold hover:text-plantation-900 underline-offset-4 hover:underline">
                  <LogOut size={16} className="text-plantation-400 hover:text-white cursor-pointer transition-colors" to="/" />
                </Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
