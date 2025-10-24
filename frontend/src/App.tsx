import { SwipeView } from './components/SwipeView';
import { mockProperties } from './data/mockProperties';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">HomeMatch</h1>
          <p className="text-sm text-gray-600">Find your dream home</p>
        </div>
      </div>

      {/* Main Content */}
      <SwipeView properties={mockProperties} />
    </div>
  );
}

export default App;
