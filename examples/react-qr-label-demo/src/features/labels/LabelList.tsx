import React, { useState, useEffect } from 'react';
import type { StickerLayout } from 'react-qr-label';
import { Plus, Layout, User, Cpu, Trash2, Edit3, Sparkles } from 'lucide-react';
import { EntityMaster } from '../sandbox/EntityMaster';

interface LabelListProps {
    labels: StickerLayout[];
    onCreateNew: () => void;
    onEdit: (label: StickerLayout) => void;
    onDelete: (id: string) => void;
}

export const LabelList: React.FC<LabelListProps> = ({
    labels,
    onCreateNew,
    onEdit,
    onDelete
}) => {
    const [selectedLabelId, setSelectedLabelId] = useState<string>('');

    // Set initial selection
    useEffect(() => {
        if (labels.length > 0 && !selectedLabelId) {
            setSelectedLabelId(labels[0].id);
        }
    }, [labels, selectedLabelId]);

    const activeLabel = labels.find(l => l.id === selectedLabelId) || labels[0];

    const handleDelete = (label: StickerLayout, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent selecting the deleted label card
        if (confirm(`Are you sure you want to delete "${label.name}"?`)) {
            onDelete(label.id);
            if (selectedLabelId === label.id) {
                setSelectedLabelId('');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sticker Studio</h1>
                    <p className="text-gray-500 mt-1">Design layouts visually and test merge-printing dynamically</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer text-sm"
                >
                    <Plus size={18} />
                    <span>Create Custom Layout</span>
                </button>
            </div>

            {labels.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md p-16 text-center max-w-2xl mx-auto space-y-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                        <Layout size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">No Layout Templates Available</h3>
                        <p className="text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                            Create a custom canvas or return to the landing page to load pre-configured industrial stories.
                        </p>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onCreateNew}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer text-sm"
                        >
                            Create Layout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Template List (4 Cols) */}
                    <div className="xl:col-span-4 space-y-4">
                        <div className="bg-gray-100/60 p-2.5 rounded-xl border border-gray-200/50">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2">
                                Layout Templates ({labels.length})
                            </span>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                            {labels.map(label => {
                                const isSelected = label.id === selectedLabelId;
                                const isEmployee = label.targetEntity === 'employee';

                                return (
                                    <div
                                        key={label.id}
                                        onClick={() => setSelectedLabelId(label.id)}
                                        className={`group relative p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                                            isSelected
                                                ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600/20'
                                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                    isSelected ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                                                }`}>
                                                    <Layout size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 leading-tight pr-4">
                                                        {label.name}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                            isEmployee
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                                : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                        }`}>
                                                            {isEmployee ? <User size={10} /> : <Cpu size={10} />}
                                                            {label.targetEntity || 'None'}
                                                        </span>
                                                        <span className="text-gray-500 text-[10px] font-semibold font-mono">
                                                            {label.width}{label.unit} × {label.height}{label.unit}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions row visible on selection or hover */}
                                        <div className={`flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 transition-all ${
                                            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        }`}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(label);
                                                }}
                                                className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors border border-gray-200 cursor-pointer"
                                            >
                                                <Edit3 size={12} />
                                                Edit Canvas
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(label, e)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100 ml-auto"
                                                title="Delete Template"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Database Grid & Dev Integration (8 Cols) */}
                    <div className="xl:col-span-8">
                        {activeLabel ? (
                            <EntityMaster layout={activeLabel} />
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md p-16 text-center">
                                <Sparkles className="text-blue-600 mx-auto mb-4 animate-bounce" size={24} />
                                <h3 className="font-bold text-gray-900">Select a layout template</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    Choose a layout template from the left sidebar to open the database sandbox workspace.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};
