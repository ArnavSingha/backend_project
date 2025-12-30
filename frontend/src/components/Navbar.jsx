import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-600">
                UserMS
              </h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:flex items-center gap-1">
              {isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/tasks"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/tasks')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Tasks
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/tasks"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/tasks')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    Tasks
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {(user?.fullName || user?.name)?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {user?.fullName || user?.name || 'User'}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="sm:hidden pb-3 flex gap-2">
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard"
                className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                My Profile
              </Link>
              <Link
                to="/tasks"
                className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/tasks')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                Tasks
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                My Profile
              </Link>
              <Link
                to="/tasks"
                className={`flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/tasks')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                Tasks
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
