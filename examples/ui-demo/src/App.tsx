// App.tsx
import { useEffect, useRef, useState } from 'react';
import { QRLayoutDesigner, type EntitySchema, type StickerLayout } from 'qrlayout-ui';
import 'qrlayout-ui/style.css';
import './App.css';
import { LabelList } from './features/labels/LabelList';
import { storage } from './services/storage';
import { ArrowLeft, Tag, Users } from 'lucide-react';
import { EmployeeMaster } from './features/employees/EmployeeMaster';

// ... (Existing SAMPLE_SCHEMAS and DEFAULT_NEW_LAYOUT remain unchanged)

// Sample Schema
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
      fullName: "Alex Johnson",
      employeeId: "EMP-2024-889",
      department: "Engineering",
      joinDate: "2024-01-15"
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

type MainView = 'labels' | 'employees';
type SubView = 'list' | 'designer';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const designerRef = useRef<QRLayoutDesigner | null>(null);

  const [mainView, setMainView] = useState<MainView>('labels');
  const [subView, setSubView] = useState<SubView>('list');
  const [labels, setLabels] = useState<StickerLayout[]>([]);
  const [editingLayout, setEditingLayout] = useState<StickerLayout | null>(null);

  // Load data on mount
  useEffect(() => {
    setLabels(storage.getLabels());
  }, []);

  // Initialize Designer when switching to designer view
  useEffect(() => {
    if (subView !== 'designer' || !containerRef.current) return;

    // Use editingLayout or create a new one
    const initialLayout = editingLayout || {
      ...DEFAULT_NEW_LAYOUT,
      id: crypto.randomUUID()
    };

    // Initialize Designer
    designerRef.current = new QRLayoutDesigner({
      element: containerRef.current,
      entitySchemas: SAMPLE_SCHEMAS,
      initialLayout: initialLayout as StickerLayout,
      onSave: (layout) => {
        console.log(layout, "layout")
        storage.addLabel(layout);
        setLabels(storage.getLabels());
        setSubView('list');
        setEditingLayout(null);
      }
    });

    return () => {
      if (designerRef.current) {
        designerRef.current.destroy();
        designerRef.current = null;
      }
    };
  }, [subView, editingLayout]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}

      {/* If acting as Designer, cover full screen (or manage as modal) */}
      {subView === 'designer' ? (
        <div className="relative">
          <button
            onClick={handleBackToList}
            className="fixed top-4 left-4 z-[9999] flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-md transition-all border border-gray-200 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Labels
          </button>
          <div
            className="designer-container"
            ref={containerRef}
          />
        </div>
      ) : (
        <>
          {/* Navigation Bar */}
          <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 backdrop-blur-lg bg-white/95">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex items-center justify-between py-4">
                {/* Logo/Brand */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      QR Layout Studio
                    </h1>
                    <p className="text-xs text-gray-500">Management Dashboard</p>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex gap-2 bg-gray-100 p-1.5 rounded-xl">
                  <button
                    onClick={() => handleMainViewChange('labels')}
                    className={`flex items-center gap-2 px-5 py-2.5 font-semibold transition-all duration-200 rounded-lg cursor-pointer ${mainView === 'labels'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                  >
                    <Tag size={18} />
                    <span>Labels</span>
                  </button>
                  <button
                    onClick={() => handleMainViewChange('employees')}
                    className={`flex items-center gap-2 px-5 py-2.5 font-semibold transition-all duration-200 rounded-lg cursor-pointer ${mainView === 'employees'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                  >
                    <Users size={18} />
                    <span>Employees</span>
                  </button>
                </nav>

                {/* Actions */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure? This will delete all labels and employees.')) {
                      storage.clearAll();
                      setLabels([]);
                      // Force reload to clear any other state if strictly needed, 
                      // or just clearing state is enough if EmployeeMaster fetches on mount.
                      // For EmployeeMaster, we might need a way to trigger reload, but page refresh is simplest for "Reset"
                      window.location.reload();
                    }
                  }}
                  className="ml-4 text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-100"
                >
                  Clear Data
                </button>
              </div>
            </div>
          </div>

          {/* Content Based on Tab */}
          {mainView === 'labels' ? (
            <LabelList
              labels={labels}
              onCreateNew={handleCreateNew}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <EmployeeMaster />
          )}
        </>
      )}
    </div>
  )
}

export default App
