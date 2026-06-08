import React, { useMemo } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export interface Column<T> {
    header: string;
    accessorKey: keyof T;
    render?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyField: keyof T;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    // Selection Props
    selectedIds?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
}

export function Table<T>({
    data,
    columns,
    onEdit,
    onDelete,
    keyField,
    selectedIds,
    onSelectionChange
}: TableProps<T>) {

    const isSelectionEnabled = !!onSelectionChange;
    const allIds = useMemo(() => data.map(d => String(d[keyField])), [data, keyField]);
    const isAllSelected = isSelectionEnabled && selectedIds?.length === data.length && data.length > 0;
    const isIndeterminate = isSelectionEnabled && (selectedIds?.length || 0) > 0 && (selectedIds?.length || 0) < data.length;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!onSelectionChange) return;
        if (e.target.checked) {
            onSelectionChange(allIds);
        } else {
            onSelectionChange([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (!onSelectionChange || !selectedIds) return;
        if (checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No records found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {/* Table View - Hidden on mobile, shown on md+ */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                        <tr>
                            {isSelectionEnabled && (
                                <th className="px-6 py-3 border-b border-gray-200 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        checked={isAllSelected}
                                        ref={input => {
                                            if (input) input.indeterminate = !!isIndeterminate;
                                        }}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                            )}
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-3 font-semibold border-b border-gray-200">
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-6 py-3 font-semibold border-b border-gray-200 text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((item) => {
                            const id = String(item[keyField]);
                            const isSelected = selectedIds?.includes(id);

                            return (
                                <tr key={id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                                    {isSelectionEnabled && (
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                checked={isSelected}
                                                onChange={(e) => handleSelectRow(id, e.target.checked)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col, idx) => (
                                        <td key={idx} className="px-6 py-4 text-sm text-gray-700">
                                            {col.render ? col.render(item[col.accessorKey], item) : String(item[col.accessorKey])}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View - Shown on small screens, hidden on md+ */}
            <div className="md:hidden divide-y divide-gray-100">
                {data.map((item) => {
                    const id = String(item[keyField]);
                    const isSelected = selectedIds?.includes(id);

                    return (
                        <div key={id} className={`p-4 ${isSelected ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {isSelectionEnabled && (
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={isSelected}
                                            onChange={(e) => handleSelectRow(id, e.target.checked)}
                                        />
                                    )}
                                    <div className="flex flex-col gap-1">
                                        {/* First column usually has primary info */}
                                        {columns.map((col, idx) => (
                                            <div key={idx} className={idx === 0 ? "font-semibold text-gray-900" : "text-sm text-gray-600"}>
                                                {idx > 0 && <span className="text-gray-400 font-medium mr-1">{col.header}:</span>}
                                                {col.render ? col.render(item[col.accessorKey], item) : String(item[col.accessorKey])}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-blue-600 p-2 rounded-lg hover:bg-blue-50 cursor-pointer"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(item)}
                                            className="text-red-600 p-2 rounded-lg hover:bg-red-50 cursor-pointer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
