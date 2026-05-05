import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ProjectData {
  projectId: string;
  projectName: string;
  websiteType: string;
  features: string[];
  modules: string[];
  structure: string[];
  status: string;
  liveUrl: string | null;
  createdAt: string;
}

function PublicView() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? '' : 'http://localhost:3001';

    fetch(`${baseUrl}/api/public/project/${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProject(data.data);
        } else {
          setError(data.error || 'Project not found');
        }
      })
      .catch(() => {
        setError('Failed to load project');
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">🔒</div>
          <p className="text-gray-700 text-lg mb-2">Project Not Available</p>
          <p className="text-gray-500 text-sm mb-6">{error || 'This project is private or does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Kyro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{project.projectName || 'Project'}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="capitalize">{project.websiteType}</span>
                <span>•</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Public</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyLink}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Kyro Home
              </button>
            </div>
          </div>
        </div>

        {/* Live URL */}
        {project.liveUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium mb-2">🚀 Live Project</p>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-900 underline"
            >
              {project.liveUrl}
            </a>
          </div>
        )}

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Website Type</h3>
            <p className="text-lg font-semibold text-gray-900 capitalize">{project.websiteType}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Features</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {project.features.map((f: string) => (
                <span key={f} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Modules</h3>
            <p className="text-lg font-semibold text-gray-900">{project.modules.length}</p>
          </div>
        </div>

        {/* Project Structure */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Project Structure</h2>
          <div className="bg-gray-50 p-4 rounded border max-h-96 overflow-y-auto">
            <ul className="space-y-1">
              {project.structure.map((item: string, idx: number) => (
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

        <footer className="text-center py-4 text-gray-500 text-sm mt-8">
          Hosted on Kyro • Developed by Yasar Hameed
        </footer>
      </div>
    </div>
  );
}

export default PublicView;
