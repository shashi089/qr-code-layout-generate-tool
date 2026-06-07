// App.tsx
import { useEffect, useState } from 'react';
import { QRLabelDesigner, type EntitySchema, type StickerLayout } from 'react-qr-label-designer';
import 'react-qr-label-designer/style.css';
import './App.css';
import { LabelList } from './features/labels/LabelList';
import { storage } from './services/storage';
import { ArrowLeft, Home, Github, BookOpen, Layers } from 'lucide-react';
import { LandingPage } from './features/home/LandingPage';
import { DocsPage } from './features/docs/DocsPage';

// Sample Schema (mapped to designer variables)
const SAMPLE_SCHEMAS: Record<string, EntitySchema> = {
  employee: {
    label: "Employee Master",
    fields: [
      { name: "fullName", label: "Full Name" },
      { name: "employeeId", label: "Employee ID" },
      { name: "department", label: "Department" },
      { name: "joinDate", label: "Join Date" },
    ],
    sampleData: {
      fullName: "Arjun Mehta",
      employeeId: "EMP-001",
      department: "Operations",
      joinDate: "2023-01-10"
    }
  },
  machine: {
    label: "Machine Master",
    fields: [
      { name: "machineName", label: "Machine Name" },
      { name: "machineCode", label: "Machine Code" },
      { name: "location", label: "Location" },
      { name: "model", label: "Model" },
    ],
    sampleData: {
      machineName: "CNC Router X1",
      machineCode: "CNC-01",
      location: "Section A",
      model: "2024-Pro"
    }
  }
};

// Initial Default Layout for New Labels
const DEFAULT_NEW_LAYOUT: Omit<StickerLayout, 'id'> = {
  name: "New QR Label",
  targetEntity: "employee",
  width: 100,
  height: 60,
  unit: "mm",
  backgroundColor: "#ffffff",
  elements: []
};

type MainView = 'home' | 'docs' | 'labels';
type SubView = 'list' | 'designer';

function App() {
  const [mainView, setMainView] = useState<MainView>('home');
  const [subView, setSubView] = useState<SubView>('list');
  const [labels, setLabels] = useState<StickerLayout[]>([]);
  const [editingLayout, setEditingLayout] = useState<StickerLayout | null>(null);

  // Load data on mount
  useEffect(() => {
    storage.initializeDefaults();
    setLabels(storage.getLabels());
  }, []);

  const handleCreateNew = () => {
    setEditingLayout(null);
    setSubView('designer');
  };

  const handleEdit = (layout: StickerLayout) => {
    setEditingLayout(layout);
    setSubView('designer');
  };

  const handleDelete = (id: string) => {
    storage.deleteLabel(id);
    setLabels(storage.getLabels());
  };

  const handleBackToList = () => {
    setSubView('list');
    setEditingLayout(null);
  };

  const handleMainViewChange = (view: MainView) => {
    setMainView(view);
    setSubView('list'); // Reset subview when switching main tabs
  };

  const handleLoadPreset = (presetId: string) => {
    storage.initializeDefaults();
    const defaultLabels = storage.getLabels();
    const preset = defaultLabels.find(l => l.id === presetId);
    if (preset) {
      setEditingLayout(preset);
      setSubView('designer');
      setMainView('labels');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* If acting as Designer, cover full screen */}
      {subView === 'designer' ? (
        <div className="fixed inset-0 z-50 bg-white">
          <button
            onClick={handleBackToList}
            className="fixed top-4 left-4 z-[9999] flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-md transition-all border border-gray-200 cursor-pointer text-sm"
          >
            <ArrowLeft size={16} />
            Back to Studio
          </button>
          <QRLabelDesigner
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            className="designer-container"
            entitySchemas={SAMPLE_SCHEMAS}
            initialLayout={editingLayout || { ...DEFAULT_NEW_LAYOUT, id: crypto.randomUUID() } as StickerLayout}
            onSave={(layout) => {
              console.log(layout, "layout");
              storage.addLabel(layout);
              setLabels(storage.getLabels());
              setSubView('list');
              setEditingLayout(null);
            }}
          />
        </div>
      ) : (
        <>
          {/* Navigation Bar */}
          <div className="bg-white border-b border-gray-200 shadow-xs sticky top-0 z-40 backdrop-blur-lg bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row items-center justify-between py-4 gap-4">
                
                {/* Logo and Mobile Actions */}
                <div className="flex items-center justify-between w-full lg:w-auto gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-full">
                        QR Label Designer
                      </h1>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">by</p>
                        <a
                          href="https://github.com/shashi089"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] sm:text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          @shashi089
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Clear Data Action */}
                  <button
                    onClick={() => {
                      if (confirm('Are you sure? This will delete all custom layouts and test records.')) {
                        storage.clearAll();
                        setLabels([]);
                        window.location.reload();
                      }
                    }}
                    className="lg:hidden text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-100 whitespace-nowrap"
                  >
                    Clear Data
                  </button>
                </div>

                {/* Navigation Tabs */}
                <div className="w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                  <nav className="flex gap-1.5 sm:gap-2 bg-gray-100 p-1 sm:p-1.5 rounded-xl w-max mx-auto lg:mx-0">
                    <button
                      onClick={() => handleMainViewChange('home')}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all duration-200 rounded-lg cursor-pointer ${mainView === 'home'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        }`}
                    >
                      <Home size={16} />
                      <span>Home</span>
                    </button>
                    <button
                      onClick={() => handleMainViewChange('labels')}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all duration-200 rounded-lg cursor-pointer ${mainView === 'labels'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        }`}
                    >
                      <Layers size={16} />
                      <span>Sticker Studio</span>
                    </button>
                    <button
                      onClick={() => handleMainViewChange('docs')}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all duration-200 rounded-lg cursor-pointer ${mainView === 'docs'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                        }`}
                    >
                      <BookOpen size={16} />
                      <span>Docs</span>
                    </button>
                  </nav>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-3">
                  <a
                    href="https://github.com/shashi089/qr-code-layout-generate-tool"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 font-bold px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                  >
                    <Github size={16} />
                    <span>Source Code</span>
                  </a>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure? This will delete all custom layouts and test records.')) {
                        storage.clearAll();
                        setLabels([]);
                        window.location.reload();
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-100 whitespace-nowrap"
                  >
                    Clear Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Pages */}
          <div className="animate-in fade-in duration-300">
            {mainView === 'home' ? (
              <LandingPage onNavigate={handleMainViewChange} onLoadPreset={handleLoadPreset} />
            ) : mainView === 'labels' ? (
              <LabelList
                labels={labels}
                onCreateNew={handleCreateNew}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <DocsPage />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
