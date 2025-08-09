import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Users,
  Activity,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import { analyticsAPI } from '../utils/api';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await analyticsAPI.getSummary();
      if (response.data.success) {
        setSummary(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, color = "blue", gradient }) => (
    <div className={`card hover:shadow-lg transition-shadow ${gradient ? gradient : ''}`}>
      <div className="flex items-center justify-between">
        <div className={gradient ? 'text-white' : ''}>
          <p className={`text-sm font-medium ${gradient ? 'text-white/90' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-1 ${gradient ? 'text-white' : `text-${color}-600`}`}>
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${
              gradient ? 'text-white/90' : change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change > 0 ? '+' : ''}{change}% from yesterday
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${
          gradient 
            ? 'bg-white/20 backdrop-blur-sm' 
            : `bg-${color}-100`
        }`}>
          <Icon className={`w-6 h-6 ${
            gradient 
              ? 'text-white' 
              : `text-${color}-600`
          }`} />
        </div>
      </div>
    </div>
  );

  const TopCountriesCard = ({ countries }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
        <Globe className="w-5 h-5 text-gray-400" />
      </div>
      
      {countries && countries.length > 0 ? (
        <div className="space-y-4">
          {countries.map((country, index) => {
            const percentage = countries[0].count > 0 ? (country.count / countries[0].count) * 100 : 0;
            
            return (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <span className="text-sm font-medium text-blue-600">
                      {country.country}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {getCountryName(country.country)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8 text-right">
                    {country.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No country data available</p>
        </div>
      )}
    </div>
  );

  const FilterActionsCard = ({ filterActions }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filter Actions</h3>
        <Shield className="w-5 h-5 text-gray-400" />
      </div>
      
      {filterActions && Object.keys(filterActions).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(filterActions).map(([action, count]) => {
            const total = Object.values(filterActions).reduce((sum, val) => sum + val, 0);
            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            const actionConfig = {
              allow: { label: 'Allowed', color: 'green', icon: CheckCircle },
              redirect: { label: 'Redirected', color: 'yellow', icon: ExternalLink },
              block: { label: 'Blocked', color: 'red', icon: AlertTriangle }
            };
            
            const config = actionConfig[action] || { label: action, color: 'gray', icon: Activity };
            const Icon = config.icon;
            
            return (
              <div key={action} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${config.color}-100`}>
                    <Icon className={`w-4 h-4 text-${config.color}-600`} />
                  </div>
                  <span className="font-medium text-gray-900">{config.label}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${config.color}-600 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No filter data available</p>
        </div>
      )}
    </div>
  );

  const getCountryName = (code) => {
    const countries = {
      'US': 'United States',
      'IT': 'Italy', 
      'DE': 'Germany',
      'FR': 'France',
      'GB': 'United Kingdom',
      'IE': 'Ireland',
      'CA': 'Canada',
      'ES': 'Spain',
      'NL': 'Netherlands',
      'AU': 'Australia',
      'XX': 'Unknown'
    };
    return countries[code] || code;
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Monitor your smart redirect system performance</p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clicks"
          value={summary?.totalClicks || 0}
          icon={Activity}
          change={15}
          color="blue"
          gradient="gradient-blue"
        />
        
        <StatCard
          title="Today's Clicks"
          value={summary?.todayClicks || 0}
          icon={TrendingUp}
          change={8}
          color="green"
          gradient="gradient-green"
        />
        
        <StatCard
          title="Active Links"
          value={summary?.activeLinks || 0}
          icon={ExternalLink}
          color="purple"
          gradient="gradient-purple"
        />
        
        <StatCard
          title="Countries"
          value={summary?.topCountries?.length || 0}
          icon={Globe}
          color="orange"
          gradient="gradient-orange"
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCountriesCard countries={summary?.topCountries || []} />
        <FilterActionsCard filterActions={summary?.filterActions || {}} />
      </div>

      {/* Risk Distribution */}
      {summary?.riskDistribution && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {summary.riskDistribution.low || 0}
              </div>
              <div className="text-sm text-gray-600">Low Risk</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{
                  width: `${((summary.riskDistribution.low || 0) / (summary.todayClicks || 1)) * 100}%`
                }} />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {summary.riskDistribution.medium || 0}
              </div>
              <div className="text-sm text-gray-600">Medium Risk</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{
                  width: `${((summary.riskDistribution.medium || 0) / (summary.todayClicks || 1)) * 100}%`
                }} />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {summary.riskDistribution.high || 0}
              </div>
              <div className="text-sm text-gray-600">High Risk</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-red-600 h-2 rounded-full" style={{
                  width: `${((summary.riskDistribution.high || 0) / (summary.todayClicks || 1)) * 100}%`
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Info Card */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Demo System Active</h3>
            <p className="text-sm text-blue-700 mb-3">
              This dashboard shows real-time data from the Smart Redirect Demo. 
              Test the system using the links and IPs provided in the Test Center.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                Live Demo
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;