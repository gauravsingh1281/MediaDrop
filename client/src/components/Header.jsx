import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex flex-col leading-tight">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 tracking-wide">
            MediaDrop
          </h1>
          <span className="text-sm text-red-500 font-normal">
            powered by ImageKit.io
          </span>
        </div>

        <div className="flex items-center gap-6 text-base md:text-lg font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors duration-200 ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-700"
              } hover:text-blue-500`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `transition-colors duration-200 ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-700"
              } hover:text-blue-500`
            }
          >
            Upload Files
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Header;
