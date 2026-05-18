export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="animate-pulse w-full">
    <div className="bg-gray-50 h-12 w-full rounded-t-lg mb-2"></div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 border-b border-gray-100 py-4 px-6">
        {[...Array(columns)].map((_, j) => (
          <div key={j} className="h-4 bg-gray-200 rounded" style={{ width: `${Math.floor(Math.random() * 40) + 30}%` }}></div>
        ))}
      </div>
    ))}
  </div>
);

export const KPISkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    ))}
  </div>
);
