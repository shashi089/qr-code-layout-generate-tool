<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { StickerLayout } from 'qrlayout-ui';
import { Plus, Layout, Smartphone } from 'lucide-vue-next';
import Table, { type Column } from '../components/Table.vue';
import { storage } from '../services/storage';

const router = useRouter();
const labels = ref<StickerLayout[]>([]);

onMounted(() => {
    storage.initializeDefaults();
    labels.value = storage.getLabels();
});

function handleCreateNew() {
    router.push('/labels/designer');
}

function handleEdit(label: StickerLayout) {
    router.push(`/labels/designer?id=${label.id}`);
}

function handleDelete(label: StickerLayout) {
    if (confirm(`Are you sure you want to delete "${label.name}"?`)) {
        storage.deleteLabel(label.id);
        labels.value = storage.getLabels();
    }
}

const columns: Column<StickerLayout>[] = [
    { header: 'Template Name', id: 'name' },
    { header: 'Target Entity', id: 'targetEntity' },
    { header: 'Dimensions', id: 'dimensions' },
    { header: 'Elements', id: 'elements' }
];
</script>

<template>
    <div class="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Label Templates</h1>
                <p class="text-gray-500 mt-1">Design and manage your QR code layouts</p>
            </div>
            <button
                @click="handleCreateNew"
                class="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            >
                <Plus :size="20" />
                <span>Create New Label</span>
            </button>
        </div>

        <!-- Content Table -->
        <Table
            :data="labels"
            :columns="columns"
            keyField="id"
            @edit="handleEdit"
            @delete="handleDelete"
        >
            <template #cell="{ item, column }">
                <div v-if="column.id === 'name'" class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                        <Layout :size="20" />
                    </div>
                    <div class="font-semibold text-gray-900">{{ item.name }}</div>
                </div>
                <span v-else-if="column.id === 'targetEntity'" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize border border-gray-200">
                    <Smartphone :size="12" />
                    {{ item.targetEntity || "None" }}
                </span>
                <span v-else-if="column.id === 'dimensions'" class="text-gray-600 text-sm font-mono">
                    {{ item.width }}{{ item.unit }} × {{ item.height }}{{ item.unit }}
                </span>
                <span v-else-if="column.id === 'elements'" class="bg-gray-50 px-2 py-1 rounded border border-gray-100 text-sm text-gray-600">
                    {{ item.elements.length }} items
                </span>
            </template>
        </Table>
    </div>
</template>
