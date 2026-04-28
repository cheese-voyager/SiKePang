import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ columns, data, searchPlaceholder = 'Cari data...', onSearch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card-light overflow-hidden"
    >
      {/* Search bar inside table */}
      {onSearch && (
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2 bg-plantation-50 rounded-xl px-4 py-2.5">
            <Search size={16} className="text-plantation-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="bg-transparent outline-none text-sm text-plantation-800 placeholder-plantation-400 w-full"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-plantation-100">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-plantation-600"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-plantation-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-plantation-100 flex items-center justify-center">
                      <Search size={24} className="text-plantation-300" />
                    </div>
                    <p className="font-medium">Data tidak ditemukan</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  className="table-row"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-plantation-800">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Info */}
      <div className="px-6 py-3 border-t border-plantation-100 flex items-center justify-between">
        <p className="text-xs text-plantation-500">
          Menampilkan <span className="font-semibold">{data.length}</span> data
        </p>
      </div>
    </motion.div>
  );
}
