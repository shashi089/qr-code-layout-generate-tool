import { useState, useEffect, useRef } from 'react';
import { Plus, X, Printer, FileText, Image as ImageIcon, Info } from 'lucide-react';
import { storage, type Bin } from '../../services/storage';
import { Table, type Column } from '../../components/Table';
import { StickerPrinter } from 'qrlayout-core';
import { exportToPDF } from 'qrlayout-core/pdf';
import type { StickerLayout } from 'qrlayout-ui';

export function BinMaster() {
    const [bins, setBins] = useState<Bin[]>([]);
    const [labels, setLabels] = useState<StickerLayout[]>([]);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string>('');

    // Selection State
    const [selectedBinIds, setSelectedBinIds] = useState<string[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBin, setEditingBin] = useState<Bin | null>(null);
    const printer = useRef(new StickerPrinter());

    // Form State
    const [formData, setFormData] = useState<Partial<Bin>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setBins(storage.getBins());
        const loadedLabels = storage.getLabels();
        // Filter labels for 'bin' entity
        const binLabels = loadedLabels.filter(l => l.targetEntity === 'storage');
        setLabels(binLabels);
        if (binLabels.length > 0 && !selectedLayoutId) {
            setSelectedLayoutId(binLabels[0].id);
        }
    };

    const handleOpenModal = (bin?: Bin) => {
        if (bin) {
            setEditingBin(bin);
            setFormData(bin);
        } else {
            setEditingBin(null);
            setFormData({});
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBin(null);
        setFormData({});
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.binCode || !formData.aisle) return;

        const bin: Bin = {
            id: editingBin?.id || crypto.randomUUID(),
            binCode: formData.binCode,
            storageType: formData.storageType || '',
            aisle: formData.aisle,
            rack: formData.rack || ''
        };

        storage.addBin(bin);
        loadData();
        handleCloseModal();
    };

    const handleDelete = (bin: Bin) => {
        if (window.confirm(`Are you sure you want to delete Bin ${bin.binCode}?`)) {
            storage.deleteBin(bin.id);
            loadData();
            // Remove from selection if deleted
            setSelectedBinIds(prev => prev.filter(id => id !== bin.id));
        }
    };

    // --- Export Logic ---

    const getSelectedBins = () => {
        return bins.filter(b => selectedBinIds.includes(b.id));
    };

    const getActiveLayout = () => {
        return labels.find(l => l.id === selectedLayoutId);
    };

    const handleExportPNG = async () => {
        const layout = getActiveLayout();
        const selected = getSelectedBins();
        if (!layout || selected.length === 0) return;

        for (const item of selected) {
            const dataUrl = await printer.current.renderToDataURL(layout, item as any, { format: 'png' });

            const link = document.createElement('a');
            link.download = `bin-${item.binCode}.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    const handleExportPDF = async () => {
        const layout = getActiveLayout();
        const selected = getSelectedBins();
        if (!layout || selected.length === 0) return;

        const pdf = await exportToPDF(layout, selected as any[]);
        pdf.save(`batch-bin-labels-${Date.now()}.pdf`);
    };

    const handleExportZPL = () => {
        const layout = getActiveLayout();
        const selected = getSelectedBins();
        if (!layout || selected.length === 0) return;

        const zplArray = printer.current.exportToZPL(layout, selected as any[]);
        const zplContent = zplArray.join('\n');

        console.log('ZPL Code generated:', zplContent);

        // Download ZPL txt
        const blob = new Blob([zplContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `batch-bin-labels.zpl`;
        link.click();
    };

    const columns: Column<Bin>[] = [
        { header: 'BIN Code', accessorKey: 'binCode' },
        { header: 'Storage Type', accessorKey: 'storageType' },
        { header: 'Aisle', accessorKey: 'aisle' },
        { header: 'Rack', accessorKey: 'rack' },
    ];

    const hasSelection = selectedBinIds.length > 0;
    const hasLayout = !!selectedLayoutId;

    return (
        <div className="max-w-7xl mx-auto px-8 py-8 animate-in fade-in duration-500">
            {/* Top Bar: Title & Configuration */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Storage Master (BINs)</h2>
                    <p className="text-gray-500">Manage warehouse locations and print storage labels</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Layout Selector */}
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm cursor-pointer"
                            value={selectedLayoutId}
                            onChange={(e) => setSelectedLayoutId(e.target.value)}
                        >
                            <option value="" disabled>Select Layout Template</option>
                            {labels.map(label => (
                                <option key={label.id} value={label.id}>{label.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add BIN</span>
                    </button>
                </div>
            </div>

            {/* Info Guide */}
            {!hasSelection && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in">
                    <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-900">
                        <p className="font-semibold">Warehouse Labeling Instructions:</p>
                        <ol className="list-decimal ml-4 mt-1 space-y-0.5 text-blue-800">
                            <li>Select a <strong>Storage BIN Label</strong> layout from the dropdown.</li>
                            <li>Select the target bins from the table below.</li>
                            <li>Download PNG or PDF for standard labels, or ZPL for thermal industrial printers.</li>
                        </ol>
                    </div>
                </div>
            )}

            {/* Batch Actions Toolkit */}
            {hasSelection && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-indigo-900">
                        <span className="font-semibold bg-indigo-100 px-2 py-0.5 rounded text-sm">{selectedBinIds.length}</span>
                        <span className="font-medium">Selected Bins</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportPNG}
                            disabled={!hasLayout}
                            className="flex items-center gap-2 bg-white text-gray-700 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title="Download as PNG"
                        >
                            <ImageIcon size={16} />
                            PNG
                        </button>
                        <button
                            onClick={handleExportPDF}
                            disabled={!hasLayout}
                            className="flex items-center gap-2 bg-white text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title="Download as PDF"
                        >
                            <FileText size={16} />
                            PDF
                        </button>
                        <button
                            onClick={handleExportZPL}
                            disabled={!hasLayout}
                            className="flex items-center gap-2 bg-white text-gray-700 hover:text-black border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title="Generate ZPL Code"
                        >
                            <Printer size={16} />
                            ZPL
                        </button>
                    </div>
                </div>
            )}

            <Table
                data={bins}
                columns={columns}
                keyField="id"
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                selectedIds={selectedBinIds}
                onSelectionChange={setSelectedBinIds}
            />

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingBin ? 'Edit BIN' : 'Add New BIN'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">BIN Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.binCode || ''}
                                    onChange={e => setFormData({ ...formData, binCode: e.target.value })}
                                    placeholder="e.g. BIN-A1-R42"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Storage Type</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData.storageType || ''}
                                    onChange={e => setFormData({ ...formData, storageType: e.target.value })}
                                    placeholder="e.g. Pallet Rack"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Aisle</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.aisle || ''}
                                        onChange={e => setFormData({ ...formData, aisle: e.target.value })}
                                        placeholder="e.g. Aisle 01"
                                    />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Rack</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.rack || ''}
                                        onChange={e => setFormData({ ...formData, rack: e.target.value })}
                                        placeholder="e.g. R-4"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 mt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors cursor-pointer"
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
}
