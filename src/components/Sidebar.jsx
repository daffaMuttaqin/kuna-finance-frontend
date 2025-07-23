export default function Sidebar({ collapsed }) {
  return (
    <div
      className={`transition-all duration-300 bg-blue-700 text-white ${
        collapsed ? "w-16" : "w-64"
      } min-h-screen`}
    >
      <div className="p-4">
        {!collapsed && <h1 className="text-xl font-bold">Menu</h1>}
        <ul className="mt-4 space-y-2">
          <li className="flex items-center space-x-2">
            <span>🏠</span>
            {!collapsed && <span>Dashboard</span>}
          </li>
          {/* Tambahkan menu lainnya */}
        </ul>
      </div>
    </div>
  );
}
