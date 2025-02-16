import React from 'react';
import { Star, Heart } from 'lucide-react';

const MatchesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((match) => (
          <div key={match} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Jessica Smith, 27</h3>
                  <p className="text-gray-600">Doctor</p>
                  <p className="text-gray-600">London, UK</p>
                </div>
                <div className="flex gap-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  <span className="text-gray-600">98% Match</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Kind-hearted doctor who loves helping others. Enjoys cooking and weekend getaways.
              </p>
              <div className="flex gap-4">
                <button className="flex-1 bg-rose-600 text-white py-2 rounded hover:bg-rose-700">
                  Connect Now
                </button>
                <button className="w-12 h-12 flex items-center justify-center border border-rose-600 text-rose-600 rounded hover:bg-rose-50">
                  <Heart className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchesPage;