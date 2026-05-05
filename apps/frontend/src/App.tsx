import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebsiteType, Feature, GenerateRequest, GenerateResponse } from '@kyro/shared';
import Preview from './Preview.tsx';
import Signup from './Signup.tsx';
import Login from './Login.tsx';
import Dashboard from './Dashboard.tsx';
import Studio from './Studio.tsx';

function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [websiteType, setWebsiteType] = useState<WebsiteType>('basic');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [projectName, setProjectName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const websiteTypes: WebsiteType[] = ['basic', 'ecommerce', 'social', 'blog'];
  const availableFeatures: Feature[] = ['auth', 'payments', 'admin'];

  const toggleFeature = (feature: Feature) => {
    setFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && step === 1) {
      // User is logged in
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const token = localStorage.getItem('token');
    const payload: GenerateRequest = {
      websiteType,
      features,
      projectName
    };

    try {
      const isDev = import.meta.env.DEV;
      const baseUrl = isDev ? 'http://localhost:3001' : '';
      const res = await fetch(`${baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      const data: GenerateResponse = await res.json();
      setResponse(data);
      setStep(3);
    } catch (err) {
      setError('Failed to connect to backend. Make sure backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setWebsiteType('basic');
    setFeatures([]);
    setProjectName('');
    setResponse(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kyro</h1>
          <p className="text-lg text-gray-600">AI Website Generator MVP</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`w-24 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step1: Website Type */}
        {step === 1 && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Website Type</h2>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-sm bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Awesome Website"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              {websiteTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setWebsiteType(type)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                    websiteType === type
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="font-medium capitalize">{type}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Step2: Features */}
        {step === 2 && (
          <div className="bg-white shadow rounded-lg p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Features</h2>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-sm bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
              >
                ← Back to Dashboard
              </button>
            </div>
            <div className="space-y-3">
              {availableFeatures.map(feature => (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  disabled={loading}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                    features.includes(feature)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } disabled:opacity-50`}
                >
                  <span className="font-medium capitalize">{feature}</span>
                  {features.includes(feature) && (
                    <span className="float-right text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600">Generating your project...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step3: Response */}
        {step === 3 && response && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Project</h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {response && response.success && response.data && (
              <div>
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 font-medium">✓ {response.data.message || 'Project generated successfully!'}</p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1"><strong>Project Name:</strong> {response.data.projectName || response.data.projectId}</p>
                  <p className="text-gray-600 text-sm mb-1"><strong>Project ID:</strong> {response.data.projectId}</p>
                  {response.data.downloadPath && (
                    <p className="text-gray-600 text-sm mb-1"><strong>Location:</strong> <span className="font-mono text-xs">{response.data.downloadPath}</span></p>
                  )}
                  {response.data.modules && (
                    <p className="text-gray-600 text-sm mb-1"><strong>Modules:</strong> {response.data.modules.join(', ')}</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded border">
                  <p className="font-medium mb-2 text-gray-700">Generated Files:</p>
                  <ul className="space-y-1">
                    {response.data.structure.map((item: string, idx: number) => (
                      <li key={idx} className="font-mono text-sm text-gray-700 flex items-center gap-2">
                        <span className="text-blue-600">📄</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {response.data.previewUrl && (
                  <a
                    href={response.data.previewUrl}
                    className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                  >
                    View Live Preview
                  </a>
                )}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={reset}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Generate Another
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="text-center py-4 text-gray-500 text-sm mt-8">
        Developed by Yasar Hameed
      </footer>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preview/:projectId" element={<Preview />} />
        <Route path="/studio/:projectId" element={<Studio />} />
      </Routes>
    </BrowserRouter>
  );
}

export { AppWrapper as App };
