import React, { useState, useEffect } from 'react';
import { Heart, X, ChevronRight, Filter, ChevronDown } from 'lucide-react';

const Matches = () => {
  // Sample data for matches
  const [matches, setMatches] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      age: 28,
      location: "Mumbai, India",
      occupation: "Software Engineer",
      education: "M.Tech in Computer Science",
      religion: "Hindu",
      photo: "/api/placeholder/300/300",
      preferences: {
        diet: "Vegetarian",
        smoking: "Never",
        drinking: "Occasionally"
      }
    },
    {
      id: 2,
      name: "Rahul Patel",
      age: 30,
      location: "Bangalore, India",
      occupation: "Financial Analyst",
      education: "MBA in Finance",
      religion: "Jain",
      photo: "/api/placeholder/300/300",
      preferences: {
        diet: "Vegan",
        smoking: "Never",
        drinking: "Never"
      }
    },
    {
      id: 3,
      name: "Anjali Gupta",
      age: 27,
      location: "Delhi, India",
      occupation: "Marketing Manager",
      education: "MBA in Marketing",
      religion: "Hindu",
      photo: "/api/placeholder/300/300",
      preferences: {
        diet: "Non-vegetarian",
        smoking: "Never",
        drinking: "Socially"
      }
    },
    {
      id: 4,
      name: "Arjun Mehta",
      age: 31,
      location: "Pune, India",
      occupation: "Doctor",
      education: "MBBS, MD",
      religion: "Hindu",
      photo: "/api/placeholder/300/300",
      preferences: {
        diet: "Vegetarian",
        smoking: "Never",
        drinking: "Never"
      }
    },
    {
      id: 5,
      name: "Kavya Reddy",
      age: 26,
      location: "Hyderabad, India",
      occupation: "UI/UX Designer",
      education: "B.Des in Design",
      religion: "Hindu",
      photo: "/api/placeholder/300/300",
      preferences: {
        diet: "Vegetarian",
        smoking: "Never",
        drinking: "Occasionally"
      }
    },
    {
      id: 6,
      name: "Vikram Singh",
      age: 32,
      location: "Chandigarh, India",
      occupation: "Civil Engineer",
      education: "B.Tech in Civil Engineering",
      religion: "Sikh",
      photo: "/api/placeholder/300/300",
      preferences: {
        diet: "Non-vegetarian",
        smoking: "Never",
        drinking: "Occasionally"
      }
    },
  ]);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Function to handle sending interest request
  const handleSendRequest = (id, e) => {
    e.stopPropagation();
    console.log(`Interest request sent to profile ${id}`);
    // Here you would typically make an API call
  };

  // Function to handle removing a match
  const handleCloseMatch = (id, e) => {
    e.stopPropagation();
    setMatches(matches.filter(match => match.id !== id));
  };

  // Function to navigate to profile detail page
  const navigateToProfile = (id) => {
    console.log(`Navigating to profile ${id}`);
    // Here you would use router.push or similar for navigation
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = isMobile ? 4 : 6;
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(matches.length / matchesPerPage);

  // Reset to first page when screen size changes affecting items per page
  useEffect(() => {
    setCurrentPage(1);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-rose-50/30">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-serif text-rose-900 mb-6 md:mb-8 text-center md:text-left">
          Find Your Perfect Match
        </h1>
        
        {/* Filters Section - Collapsible on Mobile */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 font-sans">
          <div className="flex items-center justify-between mb-2 md:mb-0">
            <h2 className="text-base md:text-lg font-medium text-rose-800">
              <span className="flex items-center gap-2">
                <Filter size={18} className="text-rose-600" />
                Quick Filters
              </span>
            </h2>
            
            <button 
              className="md:hidden text-rose-700 flex items-center"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              aria-expanded={isFilterOpen}
              aria-controls="filter-options"
            >
              {isFilterOpen ? "Hide" : "Show"} <ChevronDown size={16} className={`ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <div 
            id="filter-options"
            className={`flex flex-col md:flex-row flex-wrap gap-3 mt-3 md:mt-0 ${isMobile && !isFilterOpen ? 'hidden' : 'flex'}`}
          >
            <button className="bg-rose-100/70 text-rose-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
              Age: 25-35
            </button>
            <button className="bg-rose-100/70 text-rose-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
              Location: Any
            </button>
            <button className="bg-rose-100/70 text-rose-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
              Religion: Any
            </button>
            <button className="mt-2 md:mt-0 md:ml-auto text-rose-700 font-medium hover:text-rose-800 transition-colors flex items-center focus:outline-none focus:underline">
              Advanced Filters <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Matches Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {currentMatches.map((match) => (
            <div 
              key={match.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 font-sans border border-rose-100"
              onClick={() => navigateToProfile(match.id)}
              onKeyDown={(e) => e.key === 'Enter' && navigateToProfile(match.id)}
              tabIndex="0"
              role="button"
              aria-label={`View ${match.name}'s profile details`}
            >
              {/* Profile Photo with Accessibility */}
              <div className="relative h-56 sm:h-64 bg-rose-50">
                <img 
                  src={match.photo} 
                  alt={`${match.name}'s profile portrait`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-900/80 to-transparent p-4">
                  <h3 className="text-white text-lg md:text-xl font-medium font-serif tracking-wide">
                    {match.name}, {match.age}
                  </h3>
                  <p className="text-white/90 text-sm flex items-center gap-1">
                    {match.location}
                  </p>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="p-4">
                <div className="flex flex-col gap-1 mb-3 text-sm md:text-base">
                  <p className="text-gray-700">
                    <span className="font-medium text-rose-800">Occupation:</span> {match.occupation}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-rose-800">Education:</span> {match.education}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-rose-800">Religion:</span> {match.religion}
                  </p>
                </div>
                
                {/* Preferences Tags */}
                <div className="mt-2">
                  <h4 className="text-xs md:text-sm font-medium text-rose-700 mb-2">Lifestyle Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-rose-50 text-rose-800 text-xs px-2 py-1 rounded-full">
                      {match.preferences.diet}
                    </span>
                    {match.preferences.smoking === "Never" && (
                      <span className="bg-rose-50 text-rose-800 text-xs px-2 py-1 rounded-full">
                        Non-smoker
                      </span>
                    )}
                    <span className="bg-rose-50 text-rose-800 text-xs px-2 py-1 rounded-full">
                      Drinks: {match.preferences.drinking}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons - Improved for Accessibility */}
              <div className="flex border-t border-rose-100">
                <button 
                  onClick={(e) => handleSendRequest(match.id, e)}
                  className="flex-1 py-3 flex justify-center items-center gap-2 text-rose-600 font-medium hover:bg-rose-50 transition-colors focus:outline-none focus:bg-rose-100"
                  aria-label={`Send interest request to ${match.name}`}
                >
                  <Heart size={18} aria-hidden="true" />
                  <span className="text-sm md:text-base">Send Request</span>
                </button>
                <div className="w-px bg-rose-100" aria-hidden="true"></div>
                <button 
                  onClick={(e) => handleCloseMatch(match.id, e)}
                  className="flex-1 py-3 flex justify-center items-center gap-2 text-gray-600 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-100"
                  aria-label={`Remove ${match.name} from matches`}
                >
                  <X size={18} aria-hidden="true" />
                  <span className="text-sm md:text-base">Close Match</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {matches.length === 0 && (
          <div className="text-center py-12 md:py-16 px-4">
            <div className="bg-rose-50 rounded-full h-12 w-12 md:h-16 md:w-16 flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-rose-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-medium text-rose-900 mb-2 font-serif">No Matches Found</h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base">
              We couldn't find any profiles matching your criteria. Try adjusting your preferences to see more potential matches.
            </p>
            <button className="mt-6 bg-rose-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
              Adjust Preferences
            </button>
          </div>
        )}

        {/* Pagination - Enhanced for Mobile */}
        {totalPages > 1 && (
          <div className="mt-8 md:mt-12 flex justify-center">
            <nav className="flex items-center gap-1" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 md:px-3 py-2 rounded-md text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-rose-500"
                aria-label="Previous page"
              >
                Previous
              </button>
              
              {/* Show limited page numbers on mobile */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (isMobile) {
                    // On mobile, show current page, first, last, and adjacent pages
                    return page === 1 || 
                           page === totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  }
                  return true; // Show all pages on desktop
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {/* Add ellipsis if pages are skipped */}
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-md text-sm font-medium ${
                        currentPage === page 
                          ? "bg-rose-600 text-white" 
                          : "text-rose-700 hover:bg-rose-50"
                      } focus:outline-none focus:ring-2 focus:ring-rose-500`}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 md:px-3 py-2 rounded-md text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-rose-500"
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          </div>
        )}
        
        {/* Results Count */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {indexOfFirstMatch + 1}-{Math.min(indexOfLastMatch, matches.length)} of {matches.length} matches
        </div>
      </main>
    </div>
  );
};

export default Matches;