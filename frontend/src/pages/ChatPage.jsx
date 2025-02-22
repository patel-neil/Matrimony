import React, { useState, useEffect } from 'react';
import { Bell, MessageCircle, CheckCircle, XCircle, Shield, Clock, Info, ChevronDown, ChevronUp } from 'lucide-react';

const notifications = () => {
  // Sample notification data
  const [connectionRequests, setConnectionRequests] = useState([
    {
      id: 1,
      profileId: 101,
      name: "Priya Sharma",
      age: 28,
      location: "Mumbai, India",
      photo: "/api/placeholder/100/100",
      message: "Hello! I liked your profile and we share similar interests in classical music and travelling. Would love to connect.",
      sentAt: "2025-02-19T14:30:00",
      status: "pending",
      viewed: true
    },
    {
      id: 2,
      profileId: 102,
      name: "Rahul Patel",
      age: 30,
      location: "Bangalore, India",
      photo: "/api/placeholder/100/100",
      message: "Hi there! I noticed we both have similar family values. I would like to know more about you.",
      sentAt: "2025-02-20T09:15:00",
      status: "pending",
      viewed: false
    },
    {
      id: 3,
      profileId: 103,
      name: "Anjali Gupta",
      age: 27,
      location: "Delhi, India",
      photo: "/api/placeholder/100/100",
      message: "Namaste! I'm a software engineer just like you. I believe we would have a lot to talk about.",
      sentAt: "2025-02-20T16:45:00",
      status: "pending",
      viewed: false
    }
  ]);

  const [adminMessages, setAdminMessages] = useState([
    {
      id: 101,
      title: "Profile Verification Complete",
      message: "Your profile has been verified successfully. Your ID badge is now visible to other members.",
      sentAt: "2025-02-18T10:00:00",
      priority: "high",
      read: true
    },
    {
      id: 102,
      title: "Complete Your Preferences",
      message: "Please complete your partner preferences to receive better match recommendations.",
      sentAt: "2025-02-20T11:30:00",
      priority: "medium",
      read: false
    },
    {
      id: 103,
      title: "Premium Membership Offer",
      message: "Exclusive 25% off on premium membership valid until February 28, 2025. Upgrade now to unlock advanced features.",
      sentAt: "2025-02-21T08:00:00",
      priority: "low",
      read: false
    }
  ]);

  const [activeChats, setActiveChats] = useState([]);
  const [expandedSection, setExpandedSection] = useState('requests');
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Count unread notifications
  useEffect(() => {
    const unreadRequests = connectionRequests.filter(req => !req.viewed).length;
    const unreadMessages = adminMessages.filter(msg => !msg.read).length;
    setNewNotificationsCount(unreadRequests + unreadMessages);
  }, [connectionRequests, adminMessages]);

  // Simulate WebSocket or polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving a new connection request (for demo purposes)
      const random = Math.random();
      if (random < 0.1) { // 10% chance of new notification every interval
        const newRequest = {
          id: Math.floor(Math.random() * 1000) + 10,
          profileId: Math.floor(Math.random() * 1000) + 200,
          name: ["Vikram Singh", "Kavya Reddy", "Arjun Mehta"][Math.floor(Math.random() * 3)],
          age: Math.floor(Math.random() * 10) + 25,
          location: ["Chennai, India", "Kolkata, India", "Hyderabad, India"][Math.floor(Math.random() * 3)],
          photo: "/api/placeholder/100/100",
          message: "Hello! I found your profile interesting and would like to connect.",
          sentAt: new Date().toISOString(),
          status: "pending",
          viewed: false
        };
        setConnectionRequests(prev => [newRequest, ...prev]);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Accept connection request
  const handleAcceptRequest = (id) => {
    setConnectionRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? { ...req, status: 'accepted', viewed: true } : req
      )
    );
    
    // Add to active chats
    const acceptedRequest = connectionRequests.find(req => req.id === id);
    if (acceptedRequest) {
      setActiveChats(prev => [...prev, {
        profileId: acceptedRequest.profileId,
        name: acceptedRequest.name,
        photo: acceptedRequest.photo
      }]);
    }
  };

  // Decline connection request
  const handleDeclineRequest = (id) => {
    setConnectionRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? { ...req, status: 'declined', viewed: true } : req
      )
    );
  };

  // Mark admin message as read
  const handleReadMessage = (id) => {
    setAdminMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      )
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  // Open chat with a connection
  const openChat = (profileId) => {
    console.log(`Opening chat with profile ${profileId}`);
    // Here you would typically implement opening a chat interface
  };

  // Toggle section expansion (for mobile)
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Get priority color for admin messages
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-700 bg-red-50';
      case 'medium': return 'text-amber-700 bg-amber-50';
      case 'low': return 'text-green-700 bg-green-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50/30">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header with Notification Count */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-serif text-maroon-800 flex items-center">
            <Bell size={24} className="mr-2 text-amber-700" />
            Notifications
            {newNotificationsCount > 0 && (
              <span className="ml-2 text-sm bg-maroon-600 text-white px-2 py-1 rounded-full">
                {newNotificationsCount} new
              </span>
            )}
          </h1>
          
          {activeChats.length > 0 && (
            <div className="hidden md:flex items-center">
              <span className="text-sm text-gray-600 mr-2">Active Connections:</span>
              <div className="flex -space-x-2">
                {activeChats.slice(0, 3).map((chat, index) => (
                  <div 
                    key={chat.profileId}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden cursor-pointer"
                    onClick={() => openChat(chat.profileId)}
                  >
                    <img src={chat.photo} alt={chat.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {activeChats.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-800 border-2 border-white">
                    +{activeChats.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Connection Requests Section */}
          <section className="md:w-3/5">
            <div 
              className={`bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden transition-all duration-300 ${expandedSection !== 'requests' && !isDesktop ? 'max-h-16' : ''}`}
            >
              <div 
                className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-100/80 to-amber-50 cursor-pointer md:cursor-default"
                onClick={() => !isDesktop && toggleSection('requests')}
              >
                <h2 className="text-xl font-serif text-amber-900 flex items-center">
                  <MessageCircle size={20} className="mr-2 text-amber-700" />
                  Connection Requests
                  <span className="ml-2 text-sm bg-amber-600/20 text-amber-800 px-2 py-0.5 rounded-full">
                    {connectionRequests.filter(r => r.status === 'pending').length}
                  </span>
                </h2>
                {!isDesktop && (
                  <button className="text-amber-800">
                    {expandedSection === 'requests' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
              </div>
              
              {(expandedSection === 'requests' || isDesktop) && (
                <div className="p-4 space-y-4">
                  {connectionRequests.filter(req => req.status === 'pending').length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle size={24} className="text-amber-300" />
                      </div>
                      <p className="text-gray-500">No pending connection requests</p>
                    </div>
                  ) : (
                    connectionRequests
                      .filter(request => request.status === 'pending')
                      .map(request => (
                        <div 
                          key={request.id} 
                          className={`bg-cream-50 rounded-lg p-4 border-l-4 ${request.viewed ? 'border-amber-200' : 'border-amber-500'} transition-all hover:shadow-md`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-100">
                                <img 
                                  src={request.photo} 
                                  alt={request.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className="text-lg font-medium text-maroon-800">
                                  {request.name}, {request.age}
                                </h3>
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock size={12} className="mr-1" />
                                  {formatDate(request.sentAt)}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{request.location}</p>
                              
                              <div className="bg-white p-3 rounded-lg border border-amber-100 mb-3 text-sm">
                                "{request.message}"
                              </div>
                              
                              <div className="flex gap-3 mt-2">
                                <button 
                                  onClick={() => handleAcceptRequest(request.id)}
                                  className="flex-1 flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                                  aria-label={`Accept request from ${request.name}`}
                                >
                                  <CheckCircle size={16} />
                                  Accept
                                </button>
                                
                                <button 
                                  onClick={() => handleDeclineRequest(request.id)}
                                  className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                                  aria-label={`Decline request from ${request.name}`}
                                >
                                  <XCircle size={16} />
                                  Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                  
                  {/* Accepted and Declined Sections */}
                  {connectionRequests.some(r => r.status === 'accepted' || r.status === 'declined') && (
                    <div className="mt-6 pt-4 border-t border-amber-100">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">RECENT ACTIVITY</h3>
                      
                      {connectionRequests
                        .filter(request => request.status !== 'pending')
                        .slice(0, 3)
                        .map(request => (
                          <div 
                            key={request.id} 
                            className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
                              request.status === 'accepted' 
                                ? 'bg-green-50 border-l-2 border-green-300'
                                : 'bg-gray-50 border-l-2 border-gray-300'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img 
                                src={request.photo} 
                                alt={request.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-800">{request.name}</p>
                                <span className="text-xs text-gray-500">{formatDate(request.sentAt)}</span>
                              </div>
                              
                              <div className="flex items-center text-xs">
                                {request.status === 'accepted' ? (
                                  <span className="text-green-600 flex items-center">
                                    <CheckCircle size={12} className="mr-1" />
                                    Connection accepted
                                  </span>
                                ) : (
                                  <span className="text-gray-500 flex items-center">
                                    <XCircle size={12} className="mr-1" />
                                    Request declined
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {request.status === 'accepted' && (
                              <button 
                                onClick={() => openChat(request.profileId)}
                                className="bg-amber-100 text-amber-800 py-1 px-3 rounded text-xs font-medium hover:bg-amber-200 transition-colors"
                              >
                                Chat
                              </button>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
          
          {/* Admin Messages Section */}
          <section className="md:w-2/5">
            <div 
              className={`bg-white rounded-xl shadow-sm border border-maroon-200 overflow-hidden transition-all duration-300 ${expandedSection !== 'admin' && !isDesktop ? 'max-h-16' : ''}`}
            >
              <div
                className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-maroon-100/50 to-maroon-50 cursor-pointer md:cursor-default"
                onClick={() => !isDesktop && toggleSection('admin')}
              >
                <h2 className="text-xl font-serif text-maroon-800 flex items-center">
                  <Shield size={20} className="mr-2 text-maroon-700" />
                  Admin Messages
                  {adminMessages.filter(m => !m.read).length > 0 && (
                    <span className="ml-2 text-sm bg-maroon-600/20 text-maroon-800 px-2 py-0.5 rounded-full">
                      {adminMessages.filter(m => !m.read).length} unread
                    </span>
                  )}
                </h2>
                {!isDesktop && (
                  <button className="text-maroon-800">
                    {expandedSection === 'admin' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
              </div>
              
              {(expandedSection === 'admin' || isDesktop) && (
                <div className="p-4 space-y-3">
                  {adminMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-maroon-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Info size={24} className="text-maroon-300" />
                      </div>
                      <p className="text-gray-500">No admin messages</p>
                    </div>
                  ) : (
                    adminMessages.map(message => (
                      <div 
                        key={message.id}
                        className={`rounded-lg border ${message.read ? 'border-gray-100' : 'border-maroon-200'} overflow-hidden transition-all hover:shadow-sm`}
                        onClick={() => !message.read && handleReadMessage(message.id)}
                      >
                        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-maroon-50 to-white">
                          <div className={`p-2 rounded-full ${getPriorityColor(message.priority)}`}>
                            <Shield size={16} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="text-sm font-medium text-gray-800">{message.title}</h3>
                              <div className="flex items-center">
                                {!message.read && (
                                  <span className="w-2 h-2 bg-maroon-500 rounded-full mr-1"></span>
                                )}
                                <span className="text-xs text-gray-500">{formatDate(message.sentAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-white">
                          <p className="text-sm text-gray-600">{message.message}</p>
                        </div>
                        
                        {message.priority === 'high' && (
                          <div className="px-3 py-2 bg-maroon-50 border-t border-maroon-100 flex justify-end">
                            <button className="text-xs bg-maroon-100 text-maroon-800 px-3 py-1 rounded hover:bg-maroon-200 transition-colors">
                              Take Action
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            {/* Active Connections - Mobile View */}
            {activeChats.length > 0 && !isDesktop && (
              <div className="mt-6 bg-white rounded-xl shadow-sm p-4 border border-amber-200">
                <h3 className="text-lg font-serif text-amber-900 mb-3">Active Connections</h3>
                <div className="flex flex-wrap gap-3">
                  {activeChats.map(chat => (
                    <div 
                      key={chat.profileId}
                      onClick={() => openChat(chat.profileId)}
                      className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={chat.photo} alt={chat.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-amber-900">{chat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
        
        {/* Activity Stats */}
        <div className="mt-8 bg-white bg-opacity-70 rounded-xl p-4 border border-amber-100">
          <h3 className="text-sm font-medium text-gray-600 mb-3">YOUR ACTIVITY</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-white p-3 rounded-lg border border-amber-100">
              <p className="text-xs text-gray-500 mb-1">Pending Requests</p>
              <p className="text-2xl font-medium text-amber-800">
                {connectionRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-3 rounded-lg border border-green-100">
              <p className="text-xs text-gray-500 mb-1">Accepted Connections</p>
              <p className="text-2xl font-medium text-green-800">
                {connectionRequests.filter(r => r.status === 'accepted').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Profile Views</p>
              <p className="text-2xl font-medium text-gray-800">42</p>
            </div>
            <div className="bg-gradient-to-br from-maroon-50 to-white p-3 rounded-lg border border-maroon-100">
              <p className="text-xs text-gray-500 mb-1">Unread Messages</p>
              <p className="text-2xl font-medium text-maroon-800">
                {adminMessages.filter(m => !m.read).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default notifications;