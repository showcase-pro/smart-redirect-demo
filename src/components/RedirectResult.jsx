import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Globe, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const RedirectResult = () => {
  const [searchParams] = useSearchParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setResultData(decodedData);
      } catch (error) {
        console.error('Error parsing redirect data:', error);
      }
    }
    setLoading(false);
  }, [searchParams]);

  const getCountryFlag = (countryCode) => {
    if (!countryCode) return '🌍';
    const flags = {
      'US': '🇺🇸', 'DE': '🇩🇪', 'GB': '🇬🇧', 'FR': '🇫🇷',
      'KR': '🇰🇷', 'JP': '🇯🇵', 'CN': '🇨🇳', 'CA': '🇨🇦'
    };
    return flags[countryCode] || '🌍';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'vpn': return <Shield className="w-5 h-5 text-orange-500" />;
      case 'proxy': return <Shield className="w-5 h-5 text-yellow-500" />;
      case 'tor': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Globe className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'safe': return 'Safe Connection';
      case 'vpn': return 'VPN Detected';
      case 'proxy': return 'Proxy Detected';
      case 'tor': return 'Tor Network Detected';
      default: return 'Unknown Status';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600">No Data Available</h1>
          <p className="mt-4 text-gray-600">Redirect information is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Redirect Analysis</h1>
              <div className="flex items-center space-x-2">
                {getStatusIcon(resultData.status)}
                <span className="text-lg font-semibold text-gray-700">
                  {getStatusText(resultData.status)}
                </span>
              </div>
            </div>

            {/* Connection Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Connection Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">IP Address:</span>
                    <span className="font-mono font-semibold">{resultData.clientIP}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="flex items-center">
                      {getCountryFlag(resultData.country)} {resultData.country}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span>{resultData.city || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISP:</span>
                    <span>{resultData.isp || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">VPN:</span>
                    <span className={`font-semibold ${resultData.isVPN ? 'text-orange-600' : 'text-green-600'}`}>
                      {resultData.isVPN ? 'Detected' : 'Not Detected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Proxy:</span>
                    <span className={`font-semibold ${resultData.isProxy ? 'text-yellow-600' : 'text-green-600'}`}>
                      {resultData.isProxy ? 'Detected' : 'Not Detected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tor:</span>
                    <span className={`font-semibold ${resultData.isTor ? 'text-red-600' : 'text-green-600'}`}>
                      {resultData.isTor ? 'Detected' : 'Not Detected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fraud Score:</span>
                    <span className={`font-semibold ${
                      resultData.fraudScore > 75 ? 'text-red-600' : 
                      resultData.fraudScore > 50 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {resultData.fraudScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Info */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Browser Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Browser:</span>
                <span className="ml-2 font-semibold">{resultData.browser || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-600">Platform:</span>
                <span className="ml-2 font-semibold">{resultData.platform || 'Unknown'}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">User Agent:</span>
                <p className="mt-1 text-sm font-mono bg-gray-100 p-2 rounded break-all">
                  {resultData.userAgent}
                </p>
              </div>
            </div>
          </div>

          {/* Redirect Info */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Redirect Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Short Link:</span>
                <span className="font-semibold">{resultData.shortCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Applied Rule:</span>
                <span className="font-semibold">{resultData.appliedRule || 'Default'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Original Destination:</span>
                <span className="font-semibold">{resultData.originalUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timestamp:</span>
                <span className="font-semibold">{new Date(resultData.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedirectResult;