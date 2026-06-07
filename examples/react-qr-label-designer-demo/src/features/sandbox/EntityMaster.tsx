import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Printer, FileText, Image as ImageIcon, Info, Code, Copy, Check, Terminal, Eye } from 'lucide-react';
import { storage } from '../../services/storage';
import { Table, type Column } from '../../components/Table';
import { StickerPrinter } from 'react-qr-label-designer';
import { exportToPNG, exportToBatchPDF, exportToZPLFile } from '../../services/exportUtils';
import type { StickerLayout } from 'react-qr-label-designer';

interface EntityMasterProps {
    layout: StickerLayout;
}

interface EntityMeta {
    label: string;
    columns: Column<any>[];
    getItems: () => any[];
    addItem: (item: any) => void;
    deleteItem: (id: string) => void;
    defaultFormValues: Record<string, string>;
    fields: { name: string; label: string; placeholder?: string; type?: string }[];
}

const ENTITY_METADATA: Record<string, EntityMeta> = {
    employee: {
        label: 'Employee',
        columns: [
            { header: 'Employee ID', accessorKey: 'employeeId' },
            { header: 'Full Name', accessorKey: 'fullName' },
            { header: 'Department', accessorKey: 'department' },
            { header: 'Join Date', accessorKey: 'joinDate' },
        ],
        getItems: () => storage.getEmployees(),
        addItem: (item) => storage.addEmployee(item),
        deleteItem: (id) => storage.deleteEmployee(id),
        defaultFormValues: { fullName: '', employeeId: '', department: '', joinDate: new Date().toISOString().split('T')[0] },
        fields: [
            { name: 'fullName', label: 'Full Name', placeholder: 'e.g. Kashinath Hosapeti', type: 'text' },
            { name: 'employeeId', label: 'Employee ID', placeholder: 'e.g. EMP-001', type: 'text' },
            { name: 'department', label: 'Department', placeholder: 'e.g. Engineering', type: 'text' },
            { name: 'joinDate', label: 'Join Date', type: 'date' },
        ]
    },
    machine: {
        label: 'Machine',
        columns: [
            { header: 'Machine Code', accessorKey: 'machineCode' },
            { header: 'Machine Name', accessorKey: 'machineName' },
            { header: 'Location', accessorKey: 'location' },
            { header: 'Model', accessorKey: 'model' },
        ],
        getItems: () => storage.getMachines(),
        addItem: (item) => storage.addMachine(item),
        deleteItem: (id) => storage.deleteMachine(id),
        defaultFormValues: { machineName: '', machineCode: '', location: '', model: '' },
        fields: [
            { name: 'machineName', label: 'Machine Name', placeholder: 'e.g. CNC Milling Machine', type: 'text' },
            { name: 'machineCode', label: 'Machine Code', placeholder: 'e.g. MC-101', type: 'text' },
            { name: 'location', label: 'Location', placeholder: 'e.g. Shop Floor A', type: 'text' },
            { name: 'model', label: 'Model', placeholder: 'e.g. XYZ-2000', type: 'text' },
        ]
    }
};

export const EntityMaster: React.FC<EntityMasterProps> = ({ layout }) => {
    const targetEntity = layout.targetEntity || 'employee';
    const meta = ENTITY_METADATA[targetEntity] || ENTITY_METADATA.employee;

    const [items, setItems] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    
    // Developer panel state
    const [showDevPanel, setShowDevPanel] = useState(false);
    const [codeTab, setCodeTab] = useState<'react' | 'headless' | 'json'>('react');
    const [copied, setCopied] = useState(false);

    const printer = useRef(new StickerPrinter());

    useEffect(() => {
        loadData();
        setSelectedIds([]); // reset selection on layout/entity change
    }, [layout, targetEntity]);

    const loadData = () => {
        setItems(meta.getItems());
    };

    const handleOpenModal = (item?: any) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData(meta.defaultFormValues);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({});
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simple verification that required fields are present
        const hasRequired = meta.fields.every(f => !f.placeholder || formData[f.name]);
        if (!hasRequired) return;

        const newItem = {
            id: editingItem?.id || crypto.randomUUID(),
            ...formData
        };

        meta.addItem(newItem);
        loadData();
        handleCloseModal();
    };

    const handleDelete = (item: any) => {
        const identifier = item.fullName || item.machineName || 'this item';
        if (window.confirm(`Are you sure you want to delete ${identifier}?`)) {
            meta.deleteItem(item.id);
            loadData();
            setSelectedIds(prev => prev.filter(id => id !== item.id));
        }
    };

    const getSelectedItems = () => {
        return items.filter(item => selectedIds.includes(item.id));
    };

    const handleExportPNG = async () => {
        const selected = getSelectedItems();
        if (selected.length === 0) return;

        await exportToPNG({
            layout,
            items: selected,
            printer: printer.current,
            baseFilename: `${targetEntity}-label`
        });
    };

    const handleExportPDF = async () => {
        const selected = getSelectedItems();
        if (selected.length === 0) return;

        await exportToBatchPDF({
            layout,
            items: selected,
            printer: printer.current,
            baseFilename: `batch-${targetEntity}-labels`
        });
    };

    const handleExportZPL = () => {
        const selected = getSelectedItems();
        if (selected.length === 0) return;

        exportToZPLFile({
            layout,
            items: selected,
            printer: printer.current,
            baseFilename: `batch-${targetEntity}-labels`
        });
    };

    // --- Dynamic Code Generators ---
    const getReactCode = () => `import { useState } from 'react';
import { QRLabelDesigner, type StickerLayout } from 'react-qr-label-designer';
import 'react-qr-label-designer/style.css';

// Visual design template JSON
const INITIAL_LAYOUT: StickerLayout = ${JSON.stringify(layout, null, 2)};

const SCHEMAS = {
  ${targetEntity}: {
    label: '${meta.label} Master',
    fields: [
${meta.fields.map(f => `      { name: '${f.name}', label: '${f.label}' }`).join(',\n')}
    ],
    sampleData: {
${meta.fields.map(f => `      ${f.name}: '${f.placeholder ? f.placeholder.replace('e.g. ', '') : 'Value'}'`).join(',\n')}
    }
  }
};

export default function MyLabelDesigner() {
  const [layout, setLayout] = useState<StickerLayout>(INITIAL_LAYOUT);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <QRLabelDesigner
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        initialLayout={layout}
        entitySchemas={SCHEMAS}
        onSave={(savedLayout) => {
          console.log('Saved Layout:', savedLayout);
          setLayout(savedLayout);
        }}
      />
    </div>
  );
}`;

    const getHeadlessCode = () => `import { StickerPrinter } from 'react-qr-label-designer';
import { exportToPDF } from 'react-qr-label-designer/pdf'; // PDF sub-path export

const printer = new StickerPrinter();
const layout = ${JSON.stringify(layout, null, 2)};

// Your datasets to inject into variables like {{variableName}}
const dataset = [
  {
    id: '1',
${meta.fields.map(f => `    ${f.name}: '${f.placeholder ? f.placeholder.replace('e.g. ', '') : 'Value'}'`).join(',\n')}
  }
];

// ─── Render to PNG (works in browser) ────────────────────────
const dataUrl = await printer.renderToDataURL(layout, dataset[0], { format: 'png' });

// ─── Export Batch PDF (requires jspdf) ───────────────────────
const pdf = await exportToPDF(layout, dataset);
pdf.save('labels.pdf');

// ─── Export ZPL (send to Zebra/thermal socket) ───────────────
const zplArray = printer.exportToZPL(layout, dataset);
console.log(zplArray.join('\\n'));
`;

    const getActiveCode = () => {
        if (codeTab === 'react') return getReactCode();
        if (codeTab === 'headless') return getHeadlessCode();
        return JSON.stringify(layout, null, 2);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getActiveCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const hasSelection = selectedIds.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left/Main Content: Database grid & Batch Print */}
            <div className={`${showDevPanel ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6 transition-all duration-300 w-full`}>
                
                {/* Header card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 border border-blue-100">
                            Schema: {meta.label}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">Sandbox Database</h3>
                        <p className="text-sm text-gray-500">Inject test records into variables & batch export labels</p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                        <button
                            onClick={() => setShowDevPanel(!showDevPanel)}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all border text-sm cursor-pointer ${
                                showDevPanel
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-xs'
                            }`}
                        >
                            <Code size={16} />
                            <span>{showDevPanel ? 'Hide Dev Studio' : 'Show Dev Studio'}</span>
                        </button>

                        <button
                            onClick={() => handleOpenModal()}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer text-sm shrink-0"
                        >
                            <Plus size={16} />
                            Add {meta.label}
                        </button>
                    </div>
                </div>

                {/* Batch Action Bar */}
                {hasSelection ? (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 text-indigo-900">
                            <span className="font-semibold bg-indigo-100 px-2.5 py-1 rounded-lg text-sm text-indigo-700">
                                {selectedIds.length} Selected
                            </span>
                            <span className="font-medium text-sm">ready for merge-print</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExportPNG}
                                className="flex items-center gap-2 bg-white text-gray-700 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                                title="Download PNG Images"
                            >
                                <ImageIcon size={14} />
                                PNG
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 bg-white text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                                title="Download PDF"
                            >
                                <FileText size={14} />
                                PDF
                            </button>
                            <button
                                onClick={handleExportZPL}
                                className="flex items-center gap-2 bg-white text-gray-700 hover:text-black border border-gray-200 hover:border-gray-400 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                                title="Download ZPL file"
                            >
                                <Printer size={14} />
                                ZPL
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-blue-50/50 border border-blue-100/60 rounded-2xl p-4 flex items-start gap-3">
                        <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                        <p className="text-xs text-blue-900 leading-relaxed">
                            <strong>To print labels:</strong> Check the box next to one or more {meta.label.toLowerCase()}s in the database grid below to open batch export controls.
                        </p>
                    </div>
                )}

                {/* Table card */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <Table
                        data={items}
                        columns={meta.columns}
                        keyField="id"
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                    />
                </div>
            </div>

            {/* Right Side: Developer Integration & Live Code Snippets */}
            {showDevPanel && (
                <div className="lg:col-span-5 space-y-6 animate-in slide-in-from-right-5 duration-300 w-full">
                    
                    {/* Integration card */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Code className="text-indigo-600" size={20} />
                                <h3 className="font-bold text-gray-900">Developer Studio</h3>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer shadow-sm"
                            >
                                {copied ? (
                                    <>
                                        <Check size={14} className="text-green-600" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        <span>Copy Code</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex bg-gray-50 border-b border-gray-100 p-1">
                            <button
                                onClick={() => setCodeTab('react')}
                                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    codeTab === 'react' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <Eye size={13} />
                                React Embed
                            </button>
                            <button
                                onClick={() => setCodeTab('headless')}
                                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    codeTab === 'headless' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <Terminal size={13} />
                                Headless Print
                            </button>
                            <button
                                onClick={() => setCodeTab('json')}
                                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    codeTab === 'json' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                <Code size={13} />
                                Layout Schema
                            </button>
                        </div>

                        {/* Live Editor Snippet */}
                        <div className="flex-1 bg-gray-950 p-4 font-mono text-xs overflow-y-auto text-gray-300 select-all scrollbar-thin">
                            <pre className="whitespace-pre">{getActiveCode()}</pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingItem ? `Edit ${meta.label}` : `Add New ${meta.label}`}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            {meta.fields.map(f => (
                                <div key={f.name} className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">{f.label}</label>
                                    <input
                                        type={f.type || 'text'}
                                        required={!!f.placeholder}
                                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm shadow-xs"
                                        value={formData[f.name] || ''}
                                        onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                                        placeholder={f.placeholder || ''}
                                    />
                                </div>
                            ))}

                            {/* Modal Footer */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors text-sm cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-sm transition-colors text-sm cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
