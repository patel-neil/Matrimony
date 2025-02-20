import {React, useEffect} from 'react';
import { UserButton, SignInButton, useUser } from "@clerk/clerk-react";
import { Bell, Heart, Search, LogIn, Shield } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user, isSignedIn } = useUser();

  // Function to send user details to the backend
  const saveUserToDB = async () => {
    if (!user) return; // Ensure user is available

    try {
      const response = await axios.post("http://localhost:5000/api/users/save-user", {
        id: user.id,
        username: user.username || user.firstName || user.emailAddresses[0]?.emailAddress.split("@")[0],
        email: user.emailAddresses[0]?.emailAddress,
        phoneNumber: user.phoneNumbers[0]?.phoneNumber || "",
        createdAt: user.createdAt,
      });

      console.log("User saved:", response.data);
    } catch (error) {
      console.error("Error saving user:", error.response?.data || error.message);
    }
  };

  // Run the function when the user logs in
  useEffect(() => {
    if (isSignedIn) {
      saveUserToDB();
    }
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-rose-600">PremSangam</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-rose-600">Home</a>
            <a href="/search" className="text-gray-600 hover:text-rose-600">Search</a>
            <a href="/matches" className="text-gray-600 hover:text-rose-600">Matches</a>
            <a href="/chat" className="text-gray-600 hover:text-rose-600">Chat</a>
            <a href="/profile" className="text-gray-600 hover:text-rose-600">Profile</a>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Admin Login Button */}
            <Link to="/admin-login">
              <button className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                <Shield className="h-5 w-5" />
                <span>Admin</span>
              </button>
            </Link>
            
            {isSignedIn ? (
              <>
                <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-rose-600" />
                <Heart className="h-5 w-5 text-gray-600 cursor-pointer hover:text-rose-600" />
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="flex items-center space-x-2 bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 transition-colors">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </button>
              </SignInButton>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Find Your Perfect Match
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
            Join millions of happy couples who found their soulmate on PremSangam
          </p>
          
          {/* Search Form */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex shadow-lg rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search by location, community, or profession..."
                className="flex-1 px-6 py-4 focus:outline-none"
              />
              <button className="bg-rose-600 px-6 py-4 text-white hover:bg-rose-700 flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-rose-600">10M+</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-rose-600">1M+</div>
              <div className="text-gray-600">Success Stories</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-rose-600">150+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;