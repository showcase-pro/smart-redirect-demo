import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Shield,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { analyticsAPI } from '../utils/api';
import { toast } from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getSummary();
      if (response.data.success) {
        setSummary(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const countryChartData = {
    labels: summary?.topCountries?.map(c => c.country) || [],
    datasets: [
      {
        label: 'Clicks by Country',
        data: summary?.topCountries?.map(c => c.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const riskChartData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        label: 'Risk Distribution',
        data: [
          summary?.riskDistribution?.low || 0,
          summary?.riskDistribution?.medium || 0,
          summary?.riskDistribution?.high || 0,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Detailed insights into your redirect performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-32"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          
          <button className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {summary?.totalClicks || 0}
          </h3>
          <p className="text-sm text-gray-600">Total Clicks</p>
        </div>

        <div className="card text-center">
          <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Globe className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {summary?.topCountries?.length || 0}
          </h3>
          <p className="text-sm text-gray-600">Countries</p>
        </div>

        <div className="card text-center">
          <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {(summary?.filterActions?.block || 0) + (summary?.filterActions?.redirect || 0)}
          </h3>
          <p className="text-sm text-gray-600">Filtered</p>
        </div>

        <div className="card text-center">
          <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {Math.round(((summary?.filterActions?.allow || 0) / (summary?.totalClicks || 1)) * 100)}%
          </h3>
          <p className="text-sm text-gray-600">Success Rate</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
          {summary?.topCountries && summary.topCountries.length > 0 ? (
            <Bar data={countryChartData} options={chartOptions} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No country data available</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          {summary?.riskDistribution ? (
            <Bar data={riskChartData} options={chartOptions} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No risk data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filter Actions Table */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Actions</h3>
          
          {summary?.filterActions && Object.keys(summary.filterActions).length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Action</th>
                    <th className="table-header-cell">Count</th>
                    <th className="table-header-cell">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(summary.filterActions).map(([action, count]) => {
                    const total = Object.values(summary.filterActions).reduce((sum, val) => sum + val, 0);
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    
                    return (
                      <tr key={action} className="table-row">
                        <td className="table-cell">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            action === 'allow' ? 'bg-green-100 text-green-800' :
                            action === 'redirect' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </span>
                        </td>
                        <td className="table-cell font-medium">{count}</td>
                        <td className="table-cell text-gray-600">{percentage.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Filter className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No filter data available</p>
            </div>
          )}
        </div>

        {/* Top Countries Table */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Country Breakdown</h3>
          
          {summary?.topCountries && summary.topCountries.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Country</th>
                    <th className="table-header-cell">Clicks</th>
                    <th className="table-header-cell">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summary.topCountries.map((country, index) => {
                    const total = summary.topCountries.reduce((sum, c) => sum + c.count, 0);
                    const percentage = total > 0 ? (country.count / total) * 100 : 0;
                    
                    return (
                      <tr key={country.country} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {country.country}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell font-medium">{country.count}</td>
                        <td className="table-cell">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No country data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Status */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-medium text-blue-900">Live Analytics</h3>
              <p className="text-sm text-blue-700">Data updates every 30 seconds</p>
            </div>
          </div>
          
          <div className="text-sm text-blue-600">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;