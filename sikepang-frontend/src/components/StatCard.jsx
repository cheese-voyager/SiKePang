import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, subtitle, color = 'green', delay = 0 }) {
  const colorMap = {
    green: {
      bg: 'bg-plantation-50',
      icon: 'bg-gradient-to-br from-plantation-500 to-plantation-600',
      text: 'text-plantation-700',
    },
    leaf: {
      bg: 'bg-leaf-50',
      icon: 'bg-gradient-to-br from-leaf-500 to-leaf-600',
      text: 'text-leaf-700',
    },
    earth: {
      bg: 'bg-earth-50',
      icon: 'bg-gradient-to-br from-earth-500 to-earth-600',
      text: 'text-earth-700',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'bg-gradient-to-br from-amber-500 to-amber-600',
      text: 'text-amber-700',
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
      text: 'text-blue-700',
    },
  };

  const c = colorMap[color] || colorMap.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-plantation-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-plantation-900 tracking-tight">{value}</p>
          {subtitle && (
            <p className={`text-xs font-medium mt-2 ${c.text}`}>{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${c.icon} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}
