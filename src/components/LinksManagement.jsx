import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Globe,
  Activity,
  Eye
} from 'lucide-react';
import { linksAPI } from '../utils/api';
import { toast } from 'react-hot-toast';

const LinksManagement = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await linksAPI.getAll();
      if (response.data.success) {
        setLinks(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Links Management</h1>
          <p className="text-gray-600">Manage your redirect links and rules</p>
        </div>
        
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create New Link
        </button>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => (
          <div key={link.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <LinkIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{link.name}</h3>
                  <p className="text-sm text-gray-500 font-mono">/{link.shortCode}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rules:</span>
                <span className="font-medium">{link.rulesCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Today's Clicks:</span>
                <span className="font-medium text-blue-600">{link.todayClicks || 0}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    link.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {link.isActive ? 'Active' : 'Inactive'}
                  </span>
                  
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'}/${link.shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Info */}
      <div className="card bg-gray-50 border border-gray-200">
        <div className="flex items-start space-x-3">
          <Activity className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Demo Links Available</h3>
            <p className="text-sm text-gray-600 mb-3">
              These demo links showcase different redirect scenarios based on country and IP analysis.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-4 text-sm">
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">demo1</span>
                <span className="text-gray-600">E-commerce Product Demo</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">promo2024</span>
                <span className="text-gray-600">Black Friday Campaign</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksManagement;