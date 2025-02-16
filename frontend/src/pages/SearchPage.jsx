import React, { useState } from 'react';
import { Filter, Heart } from 'lucide-react';

const SearchPage = () => {
  const [filters, setFilters] = useState({
    ageRange: [25, 35],
    location: '',
    religion: '',
    profession: ''
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters Section */}
      <div className="flex gap-6">
        <div className="w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Filters</h2>
            <Filter className="h-5 w-5 text-gray-600" />
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
              <div className="flex gap-4">
                <input type="number" className="w-20 p-2 border rounded" placeholder="25" />
                <span className="text-gray-500">to</span>
                <input type="number" className="w-20 p-2 border rounded" placeholder="35" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input type="text" className="w-full p-2 border rounded" placeholder="City, Country" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <select className="w-full p-2 border rounded">
                <option>All Religions</option>
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
                <option>Sikh</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
              <input type="text" className="w-full p-2 border rounded" placeholder="e.g. Doctor, Engineer" />
            </div>

            <button className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="w-3/4 space-y-6">
          {[1, 2, 3, 4].map((profile) => (
            <div key={profile} className="bg-white p-6 rounded-lg shadow-sm flex gap-6">
              <div className="w-40 h-40 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">Priya Shah, 28</h3>
                    <p className="text-gray-600">Software Engineer</p>
                    <p className="text-gray-600">New York, USA</p>
                  </div>
                  <Heart className="h-6 w-6 text-gray-400 hover:text-rose-600 cursor-pointer" />
                </div>
                <p className="mt-4 text-gray-700">
                  Passionate about technology and travel. Looking for someone who shares my enthusiasm for life and adventure.
                </p>
                <div className="mt-4 flex gap-4">
                  <button className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700">
                    View Profile
                  </button>
                  <button className="border border-rose-600 text-rose-600 px-6 py-2 rounded hover:bg-rose-50">
                    Send Interest
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;