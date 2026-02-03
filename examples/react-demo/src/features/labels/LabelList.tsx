import React from 'react';
import type { StickerLayout } from 'qrlayout-ui';
import { Plus, Layout, Smartphone } from 'lucide-react';
import { Table, type Column } from '../../components/Table';

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

    const handleDelete = (label: StickerLayout) => {
        if (confirm(`Are you sure you want to delete "${label.name}"?`)) {
            onDelete(label.id);
        }
    };

    const columns: Column<StickerLayout>[] = [
        {
            header: 'Template Name',
            accessorKey: 'name',
            render: (_val, item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                        <Layout size={20} />
                    </div>
                    <div className="font-semibold text-gray-900">{item.name}</div>
                </div>
            )
        },
        {
            header: 'Target Entity',
            accessorKey: 'targetEntity',
            render: (val: string) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize border border-gray-200">
                    <Smartphone size={12} />
                    {val || "None"}
                </span>
            )
        },
        {
            header: 'Dimensions',
            accessorKey: 'width',
            render: (_val, item) => (
                <span className="text-gray-600 text-sm font-mono">
                    {item.width}{item.unit} × {item.height}{item.unit}
                </span>
            )
        },
        {
            header: 'Elements',
            accessorKey: 'elements',
            render: (val: any[]) => (
                <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100 text-sm text-gray-600">
                    {val.length} items
                </span>
            )
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Label Templates</h1>
                    <p className="text-gray-500 mt-1">Design and manage your QR code layouts</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                >
                    <Plus size={20} />
                    <span>Create New Label</span>
                </button>
            </div>

            {/* Content Table */}
            <Table
                data={labels}
                columns={columns}
                keyField="id"
                onEdit={onEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};
