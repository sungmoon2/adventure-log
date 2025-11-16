import { usePlaces } from '../../features/places/hooks/usePlaces';

export function Dashboard() {
  const { data: allPlaces, isLoading } = usePlaces({}, 0, 100);

  const mustVisitPlaces = allPlaces?.filter(
    (place) => place.priority === 'high' || place.priority === 'medium'
  ) || [];

  const stats = {
    total: allPlaces?.length || 0,
    visited: allPlaces?.filter((p) => p.visit_status === 'visited').length || 0,
    mustVisit: mustVisitPlaces.length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-sm text-gray-600 mb-2">Total Places</h2>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-sm text-gray-600 mb-2">Visited</h2>
            <p className="text-3xl font-bold">{stats.visited}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-sm text-gray-600 mb-2">Must Visit</h2>
            <p className="text-3xl font-bold">{stats.mustVisit}</p>
          </div>
        </div>

        {/* Must Visit Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Must Visit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mustVisitPlaces.length === 0 ? (
              <p className="text-gray-500">No high priority places yet</p>
            ) : (
              mustVisitPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-lg mb-2">{place.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{place.category}</p>
                  <p className="text-sm text-gray-500">{place.region_main}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        place.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {place.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">No recent activity</p>
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
          aria-label="Add new place"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>
    </div>
  );
}
