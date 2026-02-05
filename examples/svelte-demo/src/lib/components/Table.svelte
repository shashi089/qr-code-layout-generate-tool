<script lang="ts" generics="T">
    import { Edit2, Trash2 } from 'lucide-svelte';

    export interface Column<T> {
        header: string;
        accessorKey?: keyof T;
        id?: string; // used to identify column in snippet if no accessorKey
        class?: string;
    }

    interface Props {
        data: T[];
        columns: Column<T>[];
        keyField: keyof T;
        selectedIds?: string[];
        onEdit?: (item: T) => void;
        onDelete?: (item: T) => void;
        cell?: import('svelte').Snippet<[T, Column<T>]>;
    }

    let {
        data,
        columns,
        keyField,
        selectedIds = $bindable(),
        onEdit,
        onDelete,
        cell
    }: Props = $props();

    let isSelectionEnabled = $derived(selectedIds !== undefined);
    
    // Checkbox logic
    let allIds = $derived(data.map(d => String(d[keyField])));
    let isAllSelected = $derived(isSelectionEnabled && selectedIds?.length === data.length && data.length > 0);
    let isIndeterminate = $derived(isSelectionEnabled && (selectedIds?.length || 0) > 0 && (selectedIds?.length || 0) < data.length);

    function handleSelectAll(e: Event) {
        const checked = (e.target as HTMLInputElement).checked;
        if (checked) {
            selectedIds = allIds;
        } else {
            selectedIds = [];
        }
    }

    function handleSelectRow(id: string, checked: boolean) {
        if (!selectedIds) return;
        if (checked) {
            selectedIds = [...selectedIds, id];
        } else {
            selectedIds = selectedIds.filter(i => i !== id);
        }
    }

    // Action action for indeterminate state
    function indeterminate(node: HTMLInputElement, val: boolean) {
        $effect(() => {
            node.indeterminate = val;
        });
    }
</script>

{#if data.length === 0}
    <div class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
        <div class="p-4 bg-gray-50 rounded-full mb-3">
             <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        </div>
        <p class="text-gray-500 font-medium text-lg">No records found</p>
        <p class="text-gray-400 text-sm">Add a new item to get started</p>
    </div>
{:else}
    <div class="overflow-hidden bg-white shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 ring-1 ring-black/5">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-50/80 border-b border-gray-200">
                    {#if isSelectionEnabled}
                        <th class="px-6 py-4 w-12">
                            <input
                                type="checkbox"
                                class="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer transition-colors"
                                checked={isAllSelected}
                                use:indeterminate={isIndeterminate}
                                onchange={handleSelectAll}
                            />
                        </th>
                    {/if}
                    {#each columns as col}
                        <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 {col.class || ''}">
                            {col.header}
                        </th>
                    {/each}
                    {#if onEdit || onDelete}
                        <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
                            Actions
                        </th>
                    {/if}
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                {#each data as item (String(item[keyField]))}
                    {@const id = String(item[keyField])}
                    {@const isSelected = selectedIds?.includes(id)}
                    <tr class="group transition-all duration-200 hover:bg-gray-50/60 {isSelected ? 'bg-orange-50/40 hover:bg-orange-50/60' : ''}">
                        {#if isSelectionEnabled}
                            <td class="px-6 py-4">
                                <input
                                    type="checkbox"
                                    class="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer transition-colors"
                                    checked={isSelected}
                                    onchange={(e) => handleSelectRow(id, (e.target as HTMLInputElement).checked)}
                                />
                            </td>
                        {/if}
                        {#each columns as col}
                            <td class="px-6 py-4 text-sm text-gray-700">
                                {#if col.accessorKey}
                                    {item[col.accessorKey]}
                                {:else if cell}
                                    {@render cell(item, col)}
                                {:else}
                                    <span class="text-gray-400">--</span>
                                {/if}
                            </td>
                        {/each}
                        {#if onEdit || onDelete}
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    {#if onEdit}
                                        <button
                                            onclick={() => onEdit(item)}
                                            class="text-orange-600 hover:text-orange-900 p-1.5 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    {/if}
                                    {#if onDelete}
                                        <button
                                            onclick={() => onDelete(item)}
                                            class="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    {/if}
                                </div>
                            </td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
