import React, { useState, useEffect } from 'react';
import { Shield, Users, Check, X, FileText, BarChart2, LogOut, Home, Settings } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const formatDate = (dateString) => 
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('approvals');
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedImageId, setExpandedImageId] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingApprovals();
    // Optionally, you can also fetch user stats here
  }, []);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin-documents/pending-approvals', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setPendingApprovals(response.data);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      toast.error("Error fetching pending approvals");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, isValid) => {
    try {
      setProcessingIds(prev => new Set([...prev, id]));
      await axios.post('http://localhost:5000/api/admin-documents/document-approval', {
        documentId: id,
        isValid,
        adminRemarks: isValid ? "Approved after review" : "Rejected after review"
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      // Remove the approved/rejected document from the pending list by filtering on _id
      setPendingApprovals(prev => prev.filter(doc => doc._id !== id));
      toast.success(`Document ${isValid ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error processing approval:', error);
      toast.error("Error processing document approval");
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  // Format date helper for detailed date/time display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sample analytics data remains unchanged
  const monthlyData = [
    { month: 'Jan', users: 2100, revenue: 3200, matches: 450 },
    { month: 'Feb', users: 2400, revenue: 3800, matches: 520 },
    { month: 'Mar', users: 2200, revenue: 3400, matches: 480 },
    { month: 'Apr', users: 2800, revenue: 4200, matches: 580 },
    { month: 'May', users: 3100, revenue: 4600, matches: 650 },
    { month: 'Jun', users: 3400, revenue: 4900, matches: 720 },
    { month: 'Jul', users: 3200, revenue: 4700, matches: 690 },
    { month: 'Aug', users: 3600, revenue: 5200, matches: 780 },
    { month: 'Sep', users: 3900, revenue: 5600, matches: 850 },
    { month: 'Oct', users: 4200, revenue: 6100, matches: 920 },
    { month: 'Nov', users: 4500, revenue: 6500, matches: 980 },
    { month: 'Dec', users: 4800, revenue: 7000, matches: 1050 }
  ];

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-gray-200" />
            <span className="text-xl font-bold">PremSangam Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <nav className="py-6">
            <div className="px-4 mb-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Management
              </h2>
              <ul className="mt-3 space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                      activeTab === 'approvals' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Document Approvals
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                      activeTab === 'analytics' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <BarChart2 className="h-5 w-5 mr-2" />
                    User Analytics
                  </button>
                </li>
              </ul>
            </div>
            
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'approvals' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pending Document Approvals</h1>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {pendingApprovals.length} Pending
                </span>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              ) : pendingApprovals.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No documents pending approval</h3>
                  <p className="text-gray-500">All documents have been reviewed.</p>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {pendingApprovals.map((doc) => (
                      <li key={doc._id} className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row">
                          {/* Document preview */}
                          <div className="mb-4 sm:mb-0 sm:mr-6">
                            <div className="relative">
                              <img 
                                src={doc.documentUrl || `/uploads/${doc._id}`} 
                                alt={`${doc.docType} document`}
                                className="h-40 w-64 object-cover rounded-md border border-gray-300 cursor-pointer"
                                onClick={() => setExpandedImageId(expandedImageId === doc._id ? null : doc._id)}
                              />
                              {expandedImageId === doc._id && (
                                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setExpandedImageId(null)}>
                                  <div className="relative">
                                    <img 
                                      src={doc.documentUrl || `/uploads/${doc._id}`} 
                                      alt={`${doc.docType} document expanded`}
                                      className="max-h-[80vh] max-w-[90vw] object-contain"
                                    />
                                    <button 
                                      className="absolute top-2 right-2 bg-white rounded-full p-1"
                                      onClick={() => setExpandedImageId(null)}
                                    >
                                      <X className="h-6 w-6" />
                                    </button>
                                  </div>
                                </div>
                              )}
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                Click to enlarge
                              </div>
                            </div>
                          </div>
                          
                          {/* Document details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{doc.userName}</h3>
                                <p className="text-sm text-gray-500">User ID: {doc.userId}</p>
                              </div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {doc.docType}
                              </span>
                            </div>
                            
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Submitted: {formatDate(doc.uploadedAt)}
                              </p>
                            </div>
                            
                            <div className="mt-4 flex space-x-3">
                              <button
                                onClick={() => handleApproval(doc._id, true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Valid Document
                              </button>
                              
                              <button
                                onClick={() => handleApproval(doc._id, false)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Invalid Document
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">User Analytics Dashboard</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Your existing stats cards can go here */}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">New User Registrations</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#4F46E5" 
                          strokeWidth={2}
                          name="New Users"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
          
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                        <Legend />
                        <Bar 
                          dataKey="revenue" 
                          fill="#D6482B"
                          name="Revenue (₹)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
          
                {/* Successful Matches Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Successful Matches</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="matches" 
                          stroke="#059669" 
                          strokeWidth={2}
                          name="Successful Matches"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
          
                {/* Demographics Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">User Demographics</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { age: '18-25', male: 2500, female: 2100 },
                        { age: '26-35', male: 3500, female: 3000 },
                        { age: '36-45', male: 2000, female: 1800 },
                        { age: '46+', male: 1000, female: 900 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="male" fill="#3B82F6" name="Male Users" />
                        <Bar dataKey="female" fill="#EC4899" name="Female Users" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
