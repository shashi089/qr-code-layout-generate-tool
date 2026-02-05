<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, X, Printer, FileText, Image as ImageIcon, Info } from 'lucide-svelte';
	import { storage, type Machine } from '$lib/services/storage';
	import Table from '$lib/components/Table.svelte';
	import { StickerPrinter } from 'qrlayout-core';
	import { exportToPNG, exportToBatchPDF, exportToZPLFile } from '$lib/services/exportUtils';
	import type { StickerLayout } from 'qrlayout-ui';

	let machines = $state<Machine[]>([]);
	let labels = $state<StickerLayout[]>([]);
	let selectedLayoutId = $state<string>('');
	let selectedMachineIds = $state<string[]>([]);

	let isModalOpen = $state(false);
	let editingMachine = $state<Machine | null>(null);
	let formData = $state<Partial<Machine>>({});

	let printer: StickerPrinter;

	onMount(() => {
		printer = new StickerPrinter();
		loadData();
	});

	function loadData() {
		machines = storage.getMachines();
		const loadedLabels = storage.getLabels();
		const machineLabels = loadedLabels.filter((l) => l.targetEntity === 'machine');
		labels = machineLabels;
		if (machineLabels.length > 0 && !selectedLayoutId) {
			selectedLayoutId = machineLabels[0].id;
		}
	}

	function handleOpenModal(machine?: Machine) {
		if (machine) {
			editingMachine = machine;
			formData = { ...machine };
		} else {
			editingMachine = null;
			formData = {};
		}
		isModalOpen = true;
	}

	function handleCloseModal() {
		isModalOpen = false;
		editingMachine = null;
		formData = {};
	}

	function handleSave(e: Event) {
		e.preventDefault();
		if (!formData.machineName || !formData.machineCode) return;

		const machine: Machine = {
			id: editingMachine?.id || crypto.randomUUID(),
			machineName: formData.machineName,
			machineCode: formData.machineCode,
			location: formData.location || '',
			model: formData.model || ''
		};

		storage.addMachine(machine);
		loadData();
		handleCloseModal();
	}

	function handleDelete(machine: Machine) {
		if (confirm(`Are you sure you want to delete ${machine.machineName}?`)) {
			storage.deleteMachine(machine.id);
			loadData();
			selectedMachineIds = selectedMachineIds.filter((id) => id !== machine.id);
		}
	}

	// --- Export Logic ---

	function getSelectedMachines() {
		return machines.filter((m) => selectedMachineIds.includes(m.id));
	}

	function getActiveLayout() {
		return labels.find((l) => l.id === selectedLayoutId);
	}

	async function handleExportPNG() {
		const layout = getActiveLayout();
		const selected = getSelectedMachines();
		if (!layout) return;

		await exportToPNG({
			layout,
			items: selected,
			printer,
			baseFilename: 'machine-label'
		});
	}

	async function handleExportPDF() {
		const layout = getActiveLayout();
		const selected = getSelectedMachines();
		if (!layout) return;

		await exportToBatchPDF({
			layout,
			items: selected,
			printer,
			baseFilename: 'batch-machine-labels'
		});
	}

	function handleExportZPL() {
		const layout = getActiveLayout();
		const selected = getSelectedMachines();
		if (!layout) return;

		exportToZPLFile({
			layout,
			items: selected,
			printer,
			baseFilename: 'batch-machine-labels'
		});
	}

	const columns = [
		{ header: 'Machine Code', accessorKey: 'machineCode' as const },
		{ header: 'Machine Name', accessorKey: 'machineName' as const },
		{ header: 'Location', accessorKey: 'location' as const },
		{ header: 'Model', accessorKey: 'model' as const }
	];

	let hasSelection = $derived(selectedMachineIds.length > 0);
	let hasLayout = $derived(!!selectedLayoutId);
</script>

<div class="animate-in fade-in mx-auto max-w-7xl px-8 py-8 duration-500">
	<div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h2 class="text-2xl font-bold text-gray-900">Machine Master</h2>
			<p class="text-gray-500">Manage equipment and print asset labels</p>
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
				<span class="hidden sm:inline">Add Machine</span>
			</button>
		</div>
	</div>

	{#if !hasSelection}
		<div
			class="animate-in fade-in mb-6 flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4"
		>
			<Info class="mt-0.5 shrink-0 text-orange-600" size={20} />
			<div class="text-sm text-orange-900">
				<p class="font-semibold">Batch Export Instructions:</p>
				<ol class="mt-1 ml-4 list-decimal space-y-0.5 text-orange-800">
					<li>Select a <strong>Layout Template</strong> from the dropdown above.</li>
					<li>Check the box next to one or more machines in the table.</li>
					<li>
						Click the appearing <strong>Export</strong> buttons (PNG, PDF, or ZPL) to generate labels.
					</li>
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
					>{selectedMachineIds.length}</span
				>
				<span class="font-medium">Selected</span>
			</div>

			<div class="flex items-center gap-2">
				<button
					onclick={handleExportPNG}
					disabled={!hasLayout}
					class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
					title="Download as PNG Images"
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
		data={machines}
		{columns}
		keyField="id"
		onEdit={handleOpenModal}
		onDelete={handleDelete}
		bind:selectedIds={selectedMachineIds}
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
						{editingMachine ? 'Edit Machine' : 'Add New Machine'}
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
						<label class="block text-sm font-medium text-gray-700">Machine Name</label>
						<input
							type="text"
							required
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							bind:value={formData.machineName}
							placeholder="e.g. CNC Milling Machine"
						/>
					</div>

					<div class="space-y-1.5">
						<label class="block text-sm font-medium text-gray-700">Machine Code</label>
						<input
							type="text"
							required
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							bind:value={formData.machineCode}
							placeholder="e.g. MC-101"
						/>
					</div>

					<div class="space-y-1.5">
						<label class="block text-sm font-medium text-gray-700">Location</label>
						<input
							type="text"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							bind:value={formData.location}
							placeholder="e.g. Shop Floor A"
						/>
					</div>

					<div class="space-y-1.5">
						<label class="block text-sm font-medium text-gray-700">Model</label>
						<input
							type="text"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							bind:value={formData.model}
							placeholder="e.g. XYZ-2000"
						/>
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
