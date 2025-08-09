import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  Play, 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Copy,
  ExternalLink,
  Smartphone,
  Monitor,
  Info
} from 'lucide-react';
import { testAPI, linksAPI } from '../utils/api';
import { toast } from 'react-hot-toast';

const TestCenter = () => {
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState('');
  const [testIP, setTestIP] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo IPs with descriptions
  const demoIPs = [
    {
      ip: '185.220.101.42',
      description: 'Germany - Tor Network (High Risk)',
      country: 'DE',
      flags: ['Tor', 'High Risk', 'VPN'],
      color: 'red'
    },
    {
      ip: '217.160.0.152',
      description: 'Italy - VPN/Proxy (High Risk)',
      country: 'IT',
      flags: ['VPN', 'Proxy', 'High Risk'],
      color: 'red'
    },
    {
      ip: '79.18.183.45',
      description: 'Italy - Clean Mobile (Low Risk)',
      country: 'IT',
      flags: ['Mobile', 'Clean', 'Low Risk'],
      color: 'green'
    },
    {
      ip: '208.67.222.222',
      description: 'USA - Verizon Residential (Low Risk)',
      country: 'US',
      flags: ['Residential', 'Clean', 'Low Risk'],
      color: 'green'
    },
    {
      ip: '52.210.112.33',
      description: 'Ireland - AWS Datacenter (Medium Risk)',
      country: 'IE',
      flags: ['Datacenter', 'AWS', 'Medium Risk'],
      color: 'yellow'
    },
    {
      ip: '195.154.164.45',
      description: 'France - ProtonVPN (High Risk)',
      country: 'FR',
      flags: ['VPN', 'Proxy', 'High Risk'],
      color: 'red'
    },
    {
      ip: '198.51.100.42',
      description: 'USA - ExpressVPN (High Risk)',
      country: 'US',
      flags: ['VPN', 'High Risk'],
      color: 'red'
    },
    {
      ip: '46.101.123.45',
      description: 'Germany - Deutsche Telekom (Low Risk)',
      country: 'DE',
      flags: ['Residential', 'Clean', 'Low Risk'],
      color: 'green'
    }
  ];

  // Demo User Agents
  const demoUserAgents = [
    {
      name: 'Instagram In-App Browser',
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 308.0.0.18.119 (iPhone13,2; iOS 17_0; en_US; en-US; scale=3.00; 1170x2532; 490677686)',
      type: 'in-app',
      platform: 'iOS'
    },
    {
      name: 'TikTok In-App Browser',
      ua: 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36 musical_ly_2023101101 JsSdk/1.0 NetType/WIFI Channel/googleplay AppName/musical_ly app_version/31.1.1 ByteLocale/en Region/US',
      type: 'in-app',
      platform: 'Android'
    },
    {
      name: 'WhatsApp In-App Browser',
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 WhatsApp/23.20.79',
      type: 'in-app',
      platform: 'iOS'
    },
    {
      name: 'Regular Chrome Mobile',
      ua: 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
      type: 'regular',
      platform: 'Android'
    },
    {
      name: 'Regular Safari Mobile',
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      type: 'regular',
      platform: 'iOS'
    },
    {
      name: 'Desktop Chrome',
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      type: 'desktop',
      platform: 'Windows'
    }
  ];

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await linksAPI.getAll();
      if (response.data.success) {
        setLinks(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedLink(response.data.data[0].shortCode);
        }
      }
    } catch (error) {
      console.error('Failed to fetch links:', error);
      toast.error('Failed to load links');
    }
  };

  const runTest = async () => {
    if (!selectedLink || !testIP) {
      toast.error('Please select a link and test IP');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await testAPI.testRedirect(selectedLink, {
        testIP,
        userAgent: userAgent || undefined
      });

      if (response.data.success) {
        setTestResult(response.data.data);
        toast.success('Test completed successfully');
      } else {
        toast.error(response.data.message || 'Test failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error(error.response?.data?.message || 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const generateTestURL = () => {
    if (!selectedLink) return '';
    return `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'}/${selectedLink}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Center</h1>
        <p className="text-gray-600">Test redirect logic and IP analysis with demo scenarios</p>
      </div>

      {/* Test Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Setup */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            Test Configuration
          </h3>

          <div className="space-y-4">
            {/* Link Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Link to Test
              </label>
              <select
                value={selectedLink}
                onChange={(e) => setSelectedLink(e.target.value)}
                className="input"
              >
                <option value="">Choose a link...</option>
                {links.map((link) => (
                  <option key={link.shortCode} value={link.shortCode}>
                    {link.shortCode} - {link.name}
                  </option>
                ))}
              </select>
              
              {selectedLink && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-mono">
                    {generateTestURL()}
                  </span>
                  <button
                    onClick={() => copyToClipboard(generateTestURL())}
                    className="text-blue-600 hover:text-blue-700 p-1"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* IP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test IP Address
              </label>
              <input
                type="text"
                value={testIP}
                onChange={(e) => setTestIP(e.target.value)}
                placeholder="Enter IP address or select from demo IPs"
                className="input"
              />
            </div>

            {/* User Agent Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Agent (Optional)
              </label>
              <input
                type="text"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                placeholder="Leave empty for default or select from demo user agents"
                className="input"
              />
            </div>

            {/* Test Button */}
            <button
              onClick={runTest}
              disabled={!selectedLink || !testIP || isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running Test...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Test Options */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Demo IP Addresses
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {demoIPs.map((demo, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setTestIP(demo.ip)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {demo.ip}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      demo.color === 'red' ? 'bg-red-100 text-red-800' :
                      demo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {demo.country}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{demo.description}</p>
                <div className="flex flex-wrap gap-1">
                  {demo.flags.map((flag, flagIndex) => (
                    <span
                      key={flagIndex}
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        flag.includes('Risk') 
                          ? flag.includes('High') 
                            ? 'bg-red-100 text-red-700'
                            : flag.includes('Medium')
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo User Agents */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Smartphone className="w-5 h-5 mr-2" />
          Demo User Agents
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoUserAgents.map((demo, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setUserAgent(demo.ua)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{demo.name}</span>
                <div className="flex items-center space-x-1">
                  {demo.type === 'in-app' ? (
                    <Smartphone className="w-4 h-4 text-red-500" />
                  ) : demo.type === 'desktop' ? (
                    <Monitor className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Smartphone className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    demo.type === 'in-app' 
                      ? 'bg-red-100 text-red-700'
                      : demo.type === 'desktop'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {demo.platform}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 truncate">{demo.ua}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Test Results
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IP Analysis */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">IP Analysis</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">IP Address</span>
                  <span className="text-sm text-gray-600">{testResult.ipAnalysis.ip}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Country</span>
                  <span className="text-sm text-gray-600">{testResult.ipAnalysis.country_code}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    testResult.ipAnalysis.risk_score > 70 
                      ? 'bg-red-100 text-red-700'
                      : testResult.ipAnalysis.risk_score > 30
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {testResult.ipAnalysis.risk_score}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className={`p-2 rounded-lg text-center ${
                    testResult.ipAnalysis.is_vpn ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <div className={`text-xs font-medium ${
                      testResult.ipAnalysis.is_vpn ? 'text-red-700' : 'text-green-700'
                    }`}>
                      VPN: {testResult.ipAnalysis.is_vpn ? 'Yes' : 'No'}
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg text-center ${
                    testResult.ipAnalysis.is_proxy ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <div className={`text-xs font-medium ${
                      testResult.ipAnalysis.is_proxy ? 'text-red-700' : 'text-green-700'
                    }`}>
                      Proxy: {testResult.ipAnalysis.is_proxy ? 'Yes' : 'No'}
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg text-center ${
                    testResult.ipAnalysis.is_tor ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <div className={`text-xs font-medium ${
                      testResult.ipAnalysis.is_tor ? 'text-red-700' : 'text-green-700'
                    }`}>
                      Tor: {testResult.ipAnalysis.is_tor ? 'Yes' : 'No'}
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg text-center ${
                    testResult.ipAnalysis.is_mobile ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <div className={`text-xs font-medium ${
                      testResult.ipAnalysis.is_mobile ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      Mobile: {testResult.ipAnalysis.is_mobile ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Redirect Decision */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Redirect Decision</h4>
              
              <div className="space-y-3">
                <div className={`p-4 rounded-lg border-l-4 ${
                  testResult.wouldRedirect 
                    ? testResult.filterDecision.action === 'allow'
                      ? 'bg-green-50 border-green-400'
                      : 'bg-yellow-50 border-yellow-400'
                    : 'bg-red-50 border-red-400'
                }`}>
                  <div className="flex items-center">
                    {testResult.wouldRedirect ? (
                      testResult.filterDecision.action === 'allow' ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      ) : (
                        <ExternalLink className="w-5 h-5 text-yellow-500 mr-2" />
                      )
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    <span className="font-medium">
                      Action: {testResult.filterDecision.action.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Reason: {testResult.filterDecision.reason}
                  </p>
                </div>

                {testResult.appliedRule && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900 mb-1">Applied Rule:</div>
                    <div className="text-sm text-blue-700">{testResult.appliedRule.name}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      Countries: {testResult.appliedRule.countryCodes.join(', ')}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">Final URL:</div>
                  <div className="text-sm text-blue-600 break-all">{testResult.targetUrl}</div>
                </div>

                {testResult.browserDetection && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm font-medium text-purple-900 mb-1">Browser Detection:</div>
                    <div className="text-sm text-purple-700">
                      In-App Browser: {testResult.browserDetection.isInApp ? 'Yes' : 'No'}
                      {testResult.browserDetection.app && ` (${testResult.browserDetection.app})`}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      Confidence: {testResult.browserDetection.confidence}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">How to Use the Test Center</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. <strong>Select a Link:</strong> Choose from the configured redirect links</p>
              <p>2. <strong>Choose Test IP:</strong> Select from demo IPs or enter your own</p>
              <p>3. <strong>Optional User Agent:</strong> Test in-app browser detection</p>
              <p>4. <strong>Run Test:</strong> See the complete redirect decision process</p>
            </div>
            <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
              <strong>Note:</strong> This test simulates the redirect process without actually performing the redirect.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCenter;