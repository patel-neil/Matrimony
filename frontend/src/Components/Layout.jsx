import React from 'react';
import { UserButton, SignInButton, useUser } from "@clerk/clerk-react";
import { Bell, Heart, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-rose-600">Shadi.com</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-rose-600">Home</Link>
            <Link to="/search" className="text-gray-600 hover:text-rose-600">Search</Link>
            <Link to="/matches" className="text-gray-600 hover:text-rose-600">Matches</Link>
            <Link to="/chat" className="text-gray-600 hover:text-rose-600">Chat</Link>
            <Link to="/preference" className="text-gray-600 hover:text-rose-600">Preferences</Link> 
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
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

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;