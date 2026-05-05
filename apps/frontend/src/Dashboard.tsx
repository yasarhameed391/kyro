import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Project {
  projectId: string;
  projectName: string;
  websiteType: string;
  features: string[];
  modules: string[];
  status: string;
  isPublic: boolean;
  createdAt: string;
  previewUrl: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? '' : 'http://localhost:3001';

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${baseUrl}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (projectId: string) => {
    const token = localStorage.getItem('token');
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? '' : 'http://localhost:3001';

    try {
      const res = await axios.post(`${baseUrl}/api/project/${projectId}/toggle-visibility`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchProjects(); // Refresh to get updated visibility
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to toggle visibility');
    }
  };

  const copyLink = (projectId: string) => {
    const url = `${window.location.origin}/public/project/${projectId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(projectId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeploy = async (projectId: string) => {
    const token = localStorage.getItem('token');
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? '' : 'http://localhost:3001';

    try {
      setProjects(prev => prev.map(p =>
        p.projectId === projectId ? { ...p, status: 'deploying' } : p
      ));
      const res = await axios.post(`${baseUrl}/api/deploy/${projectId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchProjects(); // Refresh to get updated status
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Deployment failed');
      fetchProjects();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleGenerate = () => {
    navigate('/generate');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      'generating': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Generating...' },
      'ready': { bg: 'bg-green-100', text: 'text-green-800', label: 'Ready' },
      'deploying': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Deploying...' },
      'deployed': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Deployed' },
      'error': { bg: 'bg-red-100', text: 'text-red-800', label: 'Error' }
    };
    const config = statusConfig[status] || statusConfig['ready'];
    return (
      <span className={`text-xs px-2 py-1 rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kyro Dashboard</h1>
            {user && <p className="text-gray-600">Welcome, {user.username}!</p>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Project
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              ✕
            </button>
          </div>
        )}

        {/* Projects */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Projects</h2>
            <span className="text-sm text-gray-500">{projects.length} project(s)</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-4">You haven't generated any projects yet.</p>
              <button
                onClick={handleGenerate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Generate Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <div key={project.projectId} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{project.projectName || project.projectId}</h3>
                      <p className="text-sm text-gray-600 capitalize">{project.websiteType}</p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.features.map(f => (
                      <span key={f} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={project.previewUrl}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Preview
                    </a>
                    <a
                      href={`/studio/${project.projectId}`}
                      className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
                    >
                      Studio
                    </a>
                    <a
                      href={`/download/${project.projectId}`}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => copyLink(project.projectId)}
                      className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                      title="Copy public link"
                    >
                      {copiedId === project.projectId ? '✓ Copied!' : '📋 Share'}
                    </button>
                    <button
                      onClick={() => toggleVisibility(project.projectId)}
                      className={`text-sm px-3 py-1 rounded transition ${
                        project.isPublic
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={project.isPublic ? 'Make private' : 'Make public'}
                    >
                      {project.isPublic ? '🌐 Public' : '🔒 Private'}
                    </button>
                    {project.status === 'deployed' ? (
                      <a
                        href={`/api/deploy/${project.projectId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition"
                      >
                        🚀 Live
                      </a>
                    ) : project.status === 'deploying' ? (
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
                        Deploying...
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeploy(project.projectId)}
                        className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition"
                      >
                        🚀 Deploy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <footer className="text-center py-4 text-gray-500 text-sm mt-8">
        Developed by Yasar Hameed
      </footer>
    </div>
  );
}

export default Dashboard;
