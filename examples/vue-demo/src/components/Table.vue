<script setup lang="ts" generic="T">
import { computed } from 'vue';
import { Edit2, Trash2 } from 'lucide-vue-next';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    id?: string;
    class?: string;
}

const props = defineProps<{
    data: T[];
    columns: Column<T>[];
    keyField: keyof T;
    selectedIds?: string[];
}>();

const emit = defineEmits<{
    (e: 'update:selectedIds', value: string[]): void;
}>();

// Selection Logic
const isSelectionEnabled = computed(() => props.selectedIds !== undefined);
const allIds = computed(() => props.data.map(d => String(d[props.keyField])));
const isAllSelected = computed(() => {
    return isSelectionEnabled.value && props.selectedIds?.length === props.data.length && props.data.length > 0;
});
const isIndeterminate = computed(() => {
    const len = props.selectedIds?.length || 0;
    return isSelectionEnabled.value && len > 0 && len < props.data.length;
});

function handleSelectAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
        emit('update:selectedIds', allIds.value);
    } else {
        emit('update:selectedIds', []);
    }
}

function handleSelectRow(id: string, checked: boolean) {
    if (!props.selectedIds) return;
    let newSelection = [...props.selectedIds];
    if (checked) {
        newSelection.push(id);
    } else {
        newSelection = newSelection.filter(i => i !== id);
    }
    emit('update:selectedIds', newSelection);
}

// Custom directive for indeterminate state isn't strictly needed in Vue 3 script setup if we use :indeterminate prop (if supported) or ref
// But HTML input element needs `.indeterminate` property set via JS.
const vIndeterminate = {
  updated(el: HTMLInputElement, binding: any) {
    el.indeterminate = binding.value;
  },
  mounted(el: HTMLInputElement, binding: any) {
    el.indeterminate = binding.value;
  }
}
</script>

<template>
    <div v-if="data.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
        <div class="p-4 bg-gray-50 rounded-full mb-3">
             <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        </div>
        <p class="text-gray-500 font-medium text-lg">No records found</p>
        <p class="text-gray-400 text-sm">Add a new item to get started</p>
    </div>

    <div v-else class="overflow-hidden bg-white shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 ring-1 ring-black/5">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-50/80 border-b border-gray-200">
                    <th v-if="isSelectionEnabled" class="px-6 py-4 w-12">
                        <input
                            type="checkbox"
                            class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer transition-colors"
                            :checked="isAllSelected"
                            v-indeterminate="isIndeterminate"
                            @change="handleSelectAll"
                        />
                    </th>
                    <th v-for="col in columns" :key="col.header" class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500" :class="col.class || ''">
                        {{ col.header }}
                    </th>
                    <th v-if="$attrs.onEdit || $attrs.onDelete" class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <tr v-for="item in data" :key="String(item[keyField])" 
                    class="group transition-all duration-200 hover:bg-gray-50/60"
                    :class="{ 'bg-teal-50/40 hover:bg-teal-50/60': selectedIds?.includes(String(item[keyField])) }"
                >
                    <td v-if="isSelectionEnabled" class="px-6 py-4">
                        <input
                            type="checkbox"
                            class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer transition-colors"
                            :checked="selectedIds?.includes(String(item[keyField]))"
                            @change="(e) => handleSelectRow(String(item[keyField]), (e.target as HTMLInputElement).checked)"
                        />
                    </td>
                    <td v-for="col in columns" :key="col.header" class="px-6 py-4 text-sm text-gray-700">
                        <slot name="cell" :item="item" :column="col">
                            <span v-if="col.accessorKey">{{ item[col.accessorKey] }}</span>
                            <span v-else class="text-gray-400">--</span>
                        </slot>
                    </td>
                    <td v-if="$attrs.onEdit || $attrs.onDelete" class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <button v-if="$attrs.onEdit"
                                @click="($attrs.onEdit as Function)(item)"
                                class="text-teal-600 hover:text-teal-900 p-1.5 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
                                title="Edit"
                            >
                                <Edit2 :size="16" />
                            </button>
                            <button v-if="$attrs.onDelete"
                                @click="($attrs.onDelete as Function)(item)"
                                class="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete"
                            >
                                <Trash2 :size="16" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
