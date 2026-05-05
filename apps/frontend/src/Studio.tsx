import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

function Studio() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState<any>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deployStatus, setDeployStatus] = useState<string>('');
  const [deployUrl, setDeployUrl] = useState<string>('');

  useEffect(() => {
    if (!projectId) return;

    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? '' : 'http://localhost:3001';

    fetch(`${baseUrl}/api/project/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMetadata(data.data);
          buildFileTree(data.data.structure || []);
        } else {
          setError(data.error || 'Project not found');
        }
      })
      .catch(() => {
        setError('Failed to load project');
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const buildFileTree = (structure: string[]) => {
    const tree: FileNode[] = [];
    const dirs: { [key: string]: FileNode } = {};

    structure.forEach(item => {
      if (item.endsWith('/')) {
        // Directory
        const dirName = item.slice(0, -1);
        if (!dirs[dirName]) {
          dirs[dirName] = {
            name: dirName,
            path: dirName,
            isDirectory: true,
            children: []
          };
          tree.push(dirs[dirName]);
        }
      } else {
        // File
        const parts = item.split('/');
        const fileName = parts[parts.length - 1];
        const parentPath = parts.slice(0, -1).join('/');

        const fileNode: FileNode = {
          name: fileName,
          path: item,
          isDirectory: false
        };

        if (parentPath && dirs[parentPath]) {
          dirs[parentPath].children?.push(fileNode);
        } else {
          tree.push(fileNode);
        }
      }
    });

    setFiles(tree);
  };

  const loadFileContent = async (filePath: string) => {
    if (!projectId) return;

    try {
      setSelectedFile(filePath);

      // Use /api proxy in dev mode
      const isDev = import.meta.env.DEV;
      const baseUrl = isDev ? '' : 'http://localhost:3001';

      const res = await fetch(`${baseUrl}/api/project/${projectId}/file?path=${encodeURIComponent(filePath)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setFileContent(data.content);
      } else {
        setError(data.error || 'Failed to load file');
        setFileContent('');
      }
    } catch (err) {
      setError('Failed to load file content');
      setFileContent('');
    }
  };

  const handleSave = async () => {
    if (!projectId || !selectedFile) return;

    setSaving(true);
    try {
      const isDev = import.meta.env.DEV;
      const baseUrl = isDev ? '' : 'http://localhost:3001';

      const res = await fetch(`${baseUrl}/api/project/${projectId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          filePath: selectedFile,
          content: fileContent
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('File saved successfully!');
      } else {
        setError(data.error || 'Failed to save file');
      }
    } catch (err) {
      setError('Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const checkDeployment = async () => {
    if (!projectId) return;
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? '' : 'http://localhost:3001';

    try {
      const res = await axios.get(`${baseUrl}/api/deploy/${projectId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setDeployStatus(res.data.data.status);
        setDeployUrl(res.data.data.url || '');
      }
    } catch {
      // Not deployed
    }
  };

  const handleDeploy = async () => {
    if (!projectId) return;
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? '' : 'http://localhost:3001';

    setDeployStatus('deploying');

    try {
      const res = await axios.post(`${baseUrl}/api/deploy/${projectId}`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        setDeployStatus(res.data.data.status);
        setDeployUrl(res.data.data.url || '');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Deployment failed');
      setDeployStatus('error');
    }
  };

  useEffect(() => {
    checkDeployment();
  }, [projectId]);

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.path}>
        <div
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 ${
            selectedFile === node.path ? 'bg-blue-50' : ''
          }`}
          style={{ paddingLeft: `${depth * 16}px` }}
          onClick={() => !node.isDirectory && loadFileContent(node.path)}
        >
          <span>{node.isDirectory ? '📁' : '📄'}</span>
          <span className="text-sm">{node.name}</span>
        </div>
        {node.isDirectory && node.children && renderFileTree(node.children, depth + 1)}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading studio...</p>
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
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{metadata.projectName || 'Project'}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="capitalize">{metadata.websiteType}</span>
            <span>•</span>
            <span>{new Date(metadata.createdAt).toLocaleDateString()}</span>
            {metadata.status && (
              <>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  metadata.status === 'ready' ? 'bg-green-100 text-green-800' :
                  metadata.status === 'deployed' ? 'bg-purple-100 text-purple-800' :
                  metadata.status === 'deploying' ? 'bg-blue-100 text-blue-800' :
                  metadata.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {metadata.status === 'ready' ? 'Ready' :
                   metadata.status === 'deployed' ? 'Deployed' :
                   metadata.status === 'deploying' ? 'Deploying...' :
                   metadata.status === 'generating' ? 'Generating...' : metadata.status}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={!selectedFile || saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => window.location.href = `/api/download/${projectId}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Download
          </button>
          {deployStatus === 'deployed' ? (
            <a
              href={deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              🚀 Live
            </a>
          ) : deployStatus === 'deploying' ? (
            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
              Deploying...
            </span>
          ) : (
            <button
              onClick={handleDeploy}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              🚀 Deploy
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - File Tree */}
        <div className="w-64 bg-white border-r overflow-y-auto p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-3">FILES</h2>
          {renderFileTree(files)}
        </div>

        {/* Center Panel - Editor */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              <div className="bg-gray-100 px-4 py-2 border-b">
                <span className="text-sm font-mono text-gray-700">{selectedFile}</span>
              </div>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="flex-1 w-full p-4 font-mono text-sm bg-white border-0 focus:ring-0 resize-none"
                placeholder="Select a file to edit..."
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg">Select a file to start editing</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Properties */}
        <div className="w-64 bg-white border-l p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-3">PROPERTIES</h2>
          {selectedFile ? (
            <div>
              <p className="text-xs text-gray-500 mb-1">File Path</p>
              <p className="text-sm font-mono bg-gray-50 p-2 rounded">{selectedFile}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No file selected</p>
          )}
        </div>
      </div>

      <footer className="text-center py-4 text-gray-500 text-sm">
        Developed by Yasar Hameed
      </footer>
    </div>
  );
}

export default Studio;
