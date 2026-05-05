import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectMetadata } from '@kyro/shared';

function Preview() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState<ProjectMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? 'http://localhost:3001' : '';
    const token = localStorage.getItem('token');

    fetch(`${baseUrl}/project/${projectId}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMetadata(data.data);
        } else {
          setError(data.error || 'Project not found');
        }
      })
      .catch(() => {
        setError('Failed to load project metadata');
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleDownload = () => {
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? 'http://localhost:3001' : '';
    window.location.href = `${baseUrl}/download/${projectId}`;
  };

  const handleRegenerate = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading project preview...</p>
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">!</div>
          <p className="text-gray-700 text-lg mb-4">{error || 'Project not found'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              Back to Generator
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kyro Preview</h1>
              <p className="text-gray-600">Project: {metadata.projectName || metadata.projectId}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download ZIP
              </button>
              <button
                onClick={handleRegenerate}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Regenerate
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Website Type</h3>
            <p className="text-lg font-semibold text-gray-900 capitalize">{metadata.websiteType}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Features</h3>
            <div className="flex flex-wrap gap-2">
              {metadata.features.map((f: any) => (
                <span key={f} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Modules</h3>
            <p className="text-lg font-semibold text-gray-900">{metadata.modules.length}</p>
          </div>
        </div>

        {/* Project Structure */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Project Structure</h2>
          <div className="bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto">
            <ul className="space-y-1">
              {metadata.structure.map((item: string, idx: number) => (
                <li key={idx} className="font-mono text-sm text-gray-700 flex items-center gap-2">
                  {item.endsWith('/') ? (
                    <span className="text-blue-600">📁</span>
                  ) : (
                    <span className="text-gray-600">📄</span>
                  )}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modules */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Modules</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metadata.modules.map((mod: string) => (
              <div key={mod} className="bg-gray-50 p-4 rounded border">
                <p className="font-medium text-gray-900 capitalize">{mod}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Note */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Preview shows project structure only. Runtime preview will be available in a future update.
          </p>
        </div>
      </div>
      <footer className="text-center py-4 text-gray-500 text-sm mt-8">
        Developed by Yasar Hameed
      </footer>
    </div>
  );
}

export default Preview;
