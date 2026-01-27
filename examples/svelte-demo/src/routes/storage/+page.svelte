<script lang="ts">
    import { onMount } from 'svelte';
    import { Plus, X, Printer, FileText, Image as ImageIcon, Info } from 'lucide-svelte';
    import { storage, type Bin } from '$lib/services/storage';
    import Table from '$lib/components/Table.svelte';
    import { StickerPrinter } from 'qrlayout-core';
    import { exportToPDF } from 'qrlayout-core/pdf';
    import type { StickerLayout } from 'qrlayout-ui';

    let bins = $state<Bin[]>([]);
    let labels = $state<StickerLayout[]>([]);
    let selectedLayoutId = $state<string>('');
    let selectedBinIds = $state<string[]>([]);
    
    let isModalOpen = $state(false);
    let editingBin = $state<Bin | null>(null);
    let formData = $state<Partial<Bin>>({});

    let printer: StickerPrinter;

    onMount(() => {
        printer = new StickerPrinter();
        loadData();
    });

    function loadData() {
        bins = storage.getBins();
        const loadedLabels = storage.getLabels();
        const binLabels = loadedLabels.filter(l => l.targetEntity === 'storage');
        labels = binLabels;
        if (binLabels.length > 0 && !selectedLayoutId) {
            selectedLayoutId = binLabels[0].id;
        }
    }

    function handleOpenModal(bin?: Bin) {
        if (bin) {
            editingBin = bin;
            formData = { ...bin };
        } else {
            editingBin = null;
            formData = {};
        }
        isModalOpen = true;
    }

    function handleCloseModal() {
        isModalOpen = false;
        editingBin = null;
        formData = {};
    }

    function handleSave(e: Event) {
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
    }

    function handleDelete(bin: Bin) {
        if (confirm(`Are you sure you want to delete Bin ${bin.binCode}?`)) {
            storage.deleteBin(bin.id);
            loadData();
            selectedBinIds = selectedBinIds.filter(id => id !== bin.id);
        }
    }

    // --- Export Logic ---

    function getSelectedBins() {
        return bins.filter(b => selectedBinIds.includes(b.id));
    }

    function getActiveLayout() {
        return labels.find(l => l.id === selectedLayoutId);
    }

    async function handleExportPNG() {
        const layout = getActiveLayout();
        const selected = getSelectedBins();
        if (!layout || selected.length === 0) return;

        for (const item of selected) {
            const dataUrl = await printer.renderToDataURL(layout, item as any, { format: 'png' });

            const link = document.createElement('a');
            link.download = `bin-${item.binCode}.png`;
            link.href = dataUrl;
            link.click();
        }
    }

    async function handleExportPDF() {
        const layout = getActiveLayout();
        const selected = getSelectedBins();
        if (!layout || selected.length === 0) return;

        const pdf = await exportToPDF(layout, selected as any[]);
        pdf.save(`batch-bin-labels-${Date.now()}.pdf`);
    }

    function handleExportZPL() {
        const layout = getActiveLayout();
        const selected = getSelectedBins();
        if (!layout || selected.length === 0) return;

        const zplArray = printer.exportToZPL(layout, selected as any[]);
        const zplContent = zplArray.join('\n');

        console.log('ZPL Code generated:', zplContent);

        const blob = new Blob([zplContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `batch-bin-labels.zpl`;
        link.click();
    }

    const columns = [
        { header: 'BIN Code', accessorKey: 'binCode' as const },
        { header: 'Storage Type', accessorKey: 'storageType' as const },
        { header: 'Aisle', accessorKey: 'aisle' as const },
        { header: 'Rack', accessorKey: 'rack' as const },
    ];

    let hasSelection = $derived(selectedBinIds.length > 0);
    let hasLayout = $derived(!!selectedLayoutId);
</script>

<div class="max-w-7xl mx-auto px-8 py-8 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h2 class="text-2xl font-bold text-gray-900">Storage Master (BINs)</h2>
            <p class="text-gray-500">Manage warehouse locations and print storage labels</p>
        </div>

        <div class="flex items-center gap-3">
            <div class="relative">
                <select
                    class="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm cursor-pointer"
                    bind:value={selectedLayoutId}
                >
                    <option value="" disabled>Select Layout Template</option>
                    {#each labels as label}
                        <option value={label.id}>{label.name}</option>
                    {/each}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>

            <button
                onclick={() => handleOpenModal()}
                class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
            >
                <Plus size={18} />
                <span class="hidden sm:inline">Add BIN</span>
            </button>
        </div>
    </div>

    {#if !hasSelection}
        <div class="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in">
            <Info class="text-teal-600 shrink-0 mt-0.5" size={20} />
            <div class="text-sm text-teal-900">
                <p class="font-semibold">Warehouse Labeling Instructions:</p>
                <ol class="list-decimal ml-4 mt-1 space-y-0.5 text-teal-800">
                    <li>Select a <strong>Storage BIN Label</strong> layout from the dropdown.</li>
                    <li>Select the target bins from the table below.</li>
                    <li>Download PNG or PDF for standard labels, or ZPL for thermal industrial printers.</li>
                </ol>
            </div>
        </div>
    {/if}

    {#if hasSelection}
        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2">
            <div class="flex items-center gap-2 text-amber-900">
                <span class="font-semibold bg-amber-100 px-2 py-0.5 rounded text-sm">{selectedBinIds.length}</span>
                <span class="font-medium">Selected Bins</span>
            </div>

            <div class="flex items-center gap-2">
                <button
                    onclick={handleExportPNG}
                    disabled={!hasLayout}
                    class="flex items-center gap-2 bg-white text-gray-700 hover:text-teal-600 border border-gray-200 hover:border-teal-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Download as PNG"
                >
                    <ImageIcon size={16} />
                    PNG
                </button>
                <button
                    onclick={handleExportPDF}
                    disabled={!hasLayout}
                    class="flex items-center gap-2 bg-white text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Download as PDF"
                >
                    <FileText size={16} />
                    PDF
                </button>
                <button
                    onclick={handleExportZPL}
                    disabled={!hasLayout}
                    class="flex items-center gap-2 bg-white text-gray-700 hover:text-black border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Generate ZPL Code"
                >
                    <Printer size={16} />
                    ZPL
                </button>
            </div>
        </div>
    {/if}

    <Table
        data={bins}
        {columns}
        keyField="id"
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        bind:selectedIds={selectedBinIds}
    />

    {#if isModalOpen}
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {editingBin ? 'Edit BIN' : 'Add New BIN'}
                    </h3>
                    <button
                        onclick={handleCloseModal}
                        class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onsubmit={handleSave} class="p-6 space-y-4">
                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-gray-700">BIN Code</label>
                        <input
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            bind:value={formData.binCode}
                            placeholder="e.g. BIN-A1-R42"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-gray-700">Storage Type</label>
                        <input
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            bind:value={formData.storageType}
                            placeholder="e.g. Pallet Rack"
                        />
                    </div>

                    <div class="flex gap-4">
                        <div class="flex-1 space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700">Aisle</label>
                            <input
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                bind:value={formData.aisle}
                                placeholder="e.g. Aisle 01"
                            />
                        </div>
                        <div class="flex-1 space-y-1.5">
                            <label class="block text-sm font-medium text-gray-700">Rack</label>
                            <input
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                bind:value={formData.rack}
                                placeholder="e.g. R-4"
                            />
                        </div>
                    </div>

                    <div class="flex gap-3 pt-4 mt-2">
                        <button
                            type="button"
                            onclick={handleCloseModal}
                            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium shadow-sm transition-colors cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>
