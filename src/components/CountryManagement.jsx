import React, { useState, useEffect } from 'react';
import { Globe, Plus, Edit, Trash2, Save, X, Wifi, Network } from 'lucide-react';
import { countriesAPI } from '../utils/api';
import { toast } from 'react-hot-toast';

const CountryManagement = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({ 
    type: 'country', 
    countryCode: '', 
    ipRange: '', 
    targetUrl: '', 
    name: '' 
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await countriesAPI.getConfig();
      if (response.data.success) {
        setRules(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch rules:', error);
      toast.error('Failed to load redirect rules');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async () => {
    const { type, countryCode, ipRange, targetUrl, name } = newRule;
    
    if (!targetUrl) {
      toast.error('Target URL is required');
      return;
    }
    
    if (type === 'country' && !countryCode) {
      toast.error('Country code is required');
      return;
    }
    
    if (type === 'ip' && !ipRange) {
      toast.error('IP range is required');
      return;
    }

    try {
      await countriesAPI.addRule(type, countryCode.toUpperCase(), ipRange, targetUrl, name);
      toast.success('Rule added successfully');
      fetchRules();
      setShowAddForm(false);
      setNewRule({ type: 'country', countryCode: '', ipRange: '', targetUrl: '', name: '' });
    } catch (error) {
      toast.error('Failed to add rule');
    }
  };

  const handleDeleteRule = async (ruleId, displayName) => {
    if (window.confirm(`Are you sure you want to delete the rule "${displayName}"?`)) {
      try {
        await countriesAPI.deleteRule(ruleId);
        toast.success('Rule deleted successfully');
        fetchRules();
      } catch (error) {
        toast.error('Failed to delete rule');
      }
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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Network className="h-7 w-7" />
            Redirect Rules Management
          </h1>
          <p className="text-gray-600 mt-1">Configure redirect rules by country or IP range</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      {/* Add Rule Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Add New Redirect Rule</h3>
          
          {/* Rule Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rule Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="country"
                  checked={newRule.type === 'country'}
                  onChange={(e) => setNewRule({...newRule, type: e.target.value})}
                  className="mr-2"
                />
                <Globe className="h-4 w-4 mr-1" />
                Country
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="ip"
                  checked={newRule.type === 'ip'}
                  onChange={(e) => setNewRule({...newRule, type: e.target.value})}
                  className="mr-2"
                />
                <Wifi className="h-4 w-4 mr-1" />
                IP Range
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newRule.type === 'country' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code (e.g., US, GB, DE)
                </label>
                <input
                  type="text"
                  value={newRule.countryCode}
                  onChange={(e) => setNewRule({...newRule, countryCode: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="US"
                  maxLength="2"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP Range
                </label>
                <input
                  type="text"
                  value={newRule.ipRange}
                  onChange={(e) => setNewRule({...newRule, ipRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="192.168.1.0/24 or 192.168.1.1-192.168.1.100 or 192.168.1.1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports CIDR (192.168.1.0/24), range (192.168.1.1-192.168.1.100), or single IP
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target URL
              </label>
              <input
                type="url"
                value={newRule.targetUrl}
                onChange={(e) => setNewRule({...newRule, targetUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={newRule.name}
              onChange={(e) => setNewRule({...newRule, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description of this rule"
            />
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleAddRule}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Add Rule
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewRule({ type: 'country', countryCode: '', ipRange: '', targetUrl: '', name: '' });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Redirect Rules ({rules.length})
          </h2>
        </div>
        
        {rules.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Network className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No redirect rules configured</p>
            <p className="text-sm">Add your first rule to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {rules.map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                onDelete={handleDeleteRule}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Country rules:</strong> Redirect based on visitor's country (e.g., US, GB, DE)</li>
          <li>• <strong>IP rules:</strong> Redirect based on specific IP addresses or ranges</li>
          <li>• <strong>IP formats:</strong> Single IP (192.168.1.1), CIDR (192.168.1.0/24), or Range (192.168.1.1-192.168.1.100)</li>
          <li>• <strong>Priority:</strong> Rules are processed in order - first match wins</li>
          <li>• <strong>Unregistered clients:</strong> Show info page with IP details if no rule matches</li>
        </ul>
      </div>
    </div>
  );
};

const RuleRow = ({ rule, onDelete }) => {
  const getDisplayValue = () => {
    if (rule.type === 'country' || rule.countryCodes.length > 0) {
      return rule.countryCodes.join(', ');
    } else {
      return rule.ipRanges.join(', ');
    }
  };

  const getIcon = () => {
    if (rule.type === 'country' || rule.countryCodes.length > 0) {
      return <Globe className="h-5 w-5 text-blue-600" />;
    } else {
      return <Wifi className="h-5 w-5 text-green-600" />;
    }
  };

  const getTypeLabel = () => {
    if (rule.type === 'country' || rule.countryCodes.length > 0) {
      return 'Country';
    } else {
      return 'IP Range';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-grow">
            <div className="flex items-center space-x-3">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {getTypeLabel()}
              </span>
              <span className="font-mono text-sm font-semibold text-gray-900">
                {getDisplayValue()}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {rule.name || 'No description'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              <a 
                href={rule.targetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline"
              >
                → {rule.targetUrl}
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDelete(rule.id, getDisplayValue())}
            className="text-red-600 hover:text-red-800 p-2"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryManagement;