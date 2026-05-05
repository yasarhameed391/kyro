import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Kyro<span className="text-blue-600">.</span>
        </h1>
        <p className="text-2xl text-gray-600 mb-4">
          Build full-stack apps instantly with AI
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Describe your project and let Kyro generate a complete website with authentication,
          payments, admin dashboard, and more. Edit visually with Kyro Studio.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-blue-600 text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Describe your website type and features. Kyro generates the complete project structure.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-blue-600 text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Visual Studio</h3>
            <p className="text-gray-600">
              Edit your generated projects visually with Kyro Studio's file tree and code editor.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-blue-600 text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">One-Click Deploy</h3>
            <p className="text-gray-600">
              Deploy your projects instantly and get a live URL with Kyro Cloud.
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center py-8 text-gray-500 text-sm border-t">
        Developed by Yasar Hameed
      </footer>
    </div>
  );
}

export default Landing;
