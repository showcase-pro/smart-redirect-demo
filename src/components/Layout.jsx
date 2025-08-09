import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  TestTube, 
  LogOut, 
  Shield,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useState } from 'react';
import { authAPI } from '../utils/api';
import { toast } from 'react-hot-toast';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = authAPI.getUser();

  const handleLogout = () => {
    authAPI.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      description: 'Overview & Statistics'
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      description: 'Detailed Analytics'
    },
    {
      name: 'Redirect Rules',
      path: '/countries',
      icon: Globe,
      description: 'Manage Country & IP Redirects'
    },
    {
      name: 'Test Center',
      path: '/test',
      icon: TestTube,
      description: 'Test Redirects & IPs'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">
                Smart Redirect
              </h1>
              <p className="text-sm text-gray-500">Demo System</p>
            </div>
          </div>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors`}
              />
              <div>
                <div>{item.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* User info & logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
              <span className="text-sm font-medium text-gray-700">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || 'Administrator'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page title will be set by individual components */}
            <div className="flex-1 lg:flex lg:items-center lg:justify-between">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {/* This will be updated by child components */}
                </h2>
              </div>

              {/* Status indicator */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">System Online</span>
                </div>
                
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;