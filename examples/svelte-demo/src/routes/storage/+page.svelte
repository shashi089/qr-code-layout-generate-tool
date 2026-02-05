<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, X, Printer, FileText, Image as ImageIcon, Info } from 'lucide-svelte';
	import { storage, type Bin } from '$lib/services/storage';
	import Table from '$lib/components/Table.svelte';
	import { StickerPrinter } from 'qrlayout-core';
	import { exportToPNG, exportToBatchPDF, exportToZPLFile } from '$lib/services/exportUtils';
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
		const binLabels = loadedLabels.filter((l) => l.targetEntity === 'storage');
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
			selectedBinIds = selectedBinIds.filter((id) => id !== bin.id);
		}
	}

	// --- Export Logic ---

	function getSelectedBins() {
		return bins.filter((b) => selectedBinIds.includes(b.id));
	}

	function getActiveLayout() {
		return labels.find((l) => l.id === selectedLayoutId);
	}

	async function handleExportPNG() {
		const layout = getActiveLayout();
		const selected = getSelectedBins();
		if (!layout) return;

		await exportToPNG({
			layout,
			items: selected,
			printer,
			baseFilename: 'bin-label'
		});
	}

	async function handleExportPDF() {
		const layout = getActiveLayout();
		const selected = getSelectedBins();
		if (!layout) return;

		await exportToBatchPDF({
			layout,
			items: selected,
			printer,
			baseFilename: 'batch-bin-labels'
		});
	}

	function handleExportZPL() {
		const layout = getActiveLayout();
		const selected = getSelectedBins();
		if (!layout) return;

		exportToZPLFile({
			layout,
			items: selected,
			printer,
			baseFilename: 'batch-bin-labels'
		});
	}

	const columns = [
		{ header: 'BIN Code', accessorKey: 'binCode' as const },
		{ header: 'Storage Type', accessorKey: 'storageType' as const },
		{ header: 'Aisle', accessorKey: 'aisle' as const },
		{ header: 'Rack', accessorKey: 'rack' as const }
	];

	let hasSelection = $derived(selectedBinIds.length > 0);
	let hasLayout = $derived(!!selectedLayoutId);
</script>

<div class="animate-in fade-in mx-auto max-w-7xl px-8 py-8 duration-500">
	<div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">Storage Master (BINs)</h2>
			<p class="text-gray-500">Manage warehouse locations and print storage labels</p>
		</div>

		<div class="flex items-center gap-3">
			<div class="relative">
				<select
					class="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-4 text-gray-700 shadow-sm focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
					bind:value={selectedLayoutId}
				>
					<option value="" disabled>Select Layout Template</option>
					{#each labels as label}
						<option value={label.id}>{label.name}</option>
					{/each}
				</select>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
				>
					<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
						><path
							d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
						/></svg
					>
				</div>
			</div>

			<button
				onclick={() => handleOpenModal()}
				class="flex cursor-pointer items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-orange-700"
			>
				<Plus size={18} />
				<span class="hidden sm:inline">Add BIN</span>
			</button>
		</div>
	</div>

	{#if !hasSelection}
		<div
			class="animate-in fade-in mb-6 flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4"
		>
			<Info class="mt-0.5 shrink-0 text-orange-600" size={20} />
			<div class="text-sm text-orange-900">
				<p class="font-semibold">Warehouse Labeling Instructions:</p>
				<ol class="mt-1 ml-4 list-decimal space-y-0.5 text-orange-800">
					<li>Select a <strong>Storage BIN Label</strong> layout from the dropdown.</li>
					<li>Select the target bins from the table below.</li>
					<li>Download PNG or PDF for standard labels, or ZPL for thermal industrial printers.</li>
				</ol>
			</div>
		</div>
	{/if}

	{#if hasSelection}
		<div
			class="animate-in slide-in-from-top-2 mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-100 bg-amber-50 p-4"
		>
			<div class="flex items-center gap-2 text-amber-900">
				<span class="rounded bg-amber-100 px-2 py-0.5 text-sm font-semibold"
					>{selectedBinIds.length}</span
				>
				<span class="font-medium">Selected Bins</span>
			</div>

			<div class="flex items-center gap-2">
				<button
					onclick={handleExportPNG}
					disabled={!hasLayout}
					class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
					title="Download as PNG"
				>
					<ImageIcon size={16} />
					PNG
				</button>
				<button
					onclick={handleExportPDF}
					disabled={!hasLayout}
					class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-red-200 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
					title="Download as PDF"
				>
					<FileText size={16} />
					PDF
				</button>
				<button
					onclick={handleExportZPL}
					disabled={!hasLayout}
					class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
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
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		>
			<div
				class="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
			>
				<div
					class="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4"
				>
					<h3 class="text-lg font-semibold text-gray-900">
						{editingBin ? 'Edit BIN' : 'Add New BIN'}
					</h3>
					<button
						onclick={handleCloseModal}
						class="cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
					>
						<X size={20} />
					</button>
				</div>

				<form onsubmit={handleSave} class="space-y-4 p-6">
					<div class="space-y-1.5">
						<label class="block text-sm font-medium text-gray-700">BIN Code</label>
						<input
							type="text"
							required
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							bind:value={formData.binCode}
							placeholder="e.g. BIN-A1-R42"
						/>
					</div>

					<div class="space-y-1.5">
						<label class="block text-sm font-medium text-gray-700">Storage Type</label>
						<input
							type="text"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							bind:value={formData.storageType}
							placeholder="e.g. Pallet Rack"
						/>
					</div>

					<div class="flex gap-4">
						<div class="flex-1 space-y-1.5">
							<label class="block text-sm font-medium text-gray-700">Aisle</label>
							<input
								type="text"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								bind:value={formData.aisle}
								placeholder="e.g. Aisle 01"
							/>
						</div>
						<div class="flex-1 space-y-1.5">
							<label class="block text-sm font-medium text-gray-700">Rack</label>
							<input
								type="text"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								bind:value={formData.rack}
								placeholder="e.g. R-4"
							/>
						</div>
					</div>

					<div class="mt-2 flex gap-3 pt-4">
						<button
							type="button"
							onclick={handleCloseModal}
							class="flex-1 cursor-pointer rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="flex-1 cursor-pointer rounded-lg bg-orange-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-orange-700"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>
