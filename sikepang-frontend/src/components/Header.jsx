import { Bell, Search, ChevronDown } from 'lucide-react';

export default function Header({ title, subtitle }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="page-header">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white border-2 border-plantation-100 rounded-xl px-4 py-2.5 focus-within:border-plantation-400 transition-colors">
          <Search size={16} className="text-plantation-400" />
          <input
            type="text"
            placeholder="Cari..."
            className="bg-transparent outline-none text-sm text-plantation-800 placeholder-plantation-400 w-40"
          />
        </div>
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-white border-2 border-plantation-100 hover:border-plantation-300 transition-colors">
          <Bell size={18} className="text-plantation-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
        </button>
      </div>
    </header>
  );
}
