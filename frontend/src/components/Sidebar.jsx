import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/" },
  { name: "Analytics", path: "/analytics" },
];

export default function Sidebar({ mobile = false, open = false, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full z-50
          w-64 bg-slate-900 text-slate-200 flex flex-col
          transform transition-transform duration-300
          ${mobile ? (open ? "translate-x-0" : "-translate-x-full") : ""}
        `}
      >
        <div className="flex items-center justify-between p-5 text-lg font-bold border-b border-slate-800">
          LogScope
          {mobile && (
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition 
                ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-slate-800"
                }`
              }
            >
              {l.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
