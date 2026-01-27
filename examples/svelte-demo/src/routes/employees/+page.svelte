<script lang="ts">
    import { onMount } from 'svelte';
    import { Plus, X, Printer, FileText, Image as ImageIcon, Info } from 'lucide-svelte';
    import { storage, type Employee } from '$lib/services/storage';
    import Table from '$lib/components/Table.svelte';
    import { StickerPrinter } from 'qrlayout-core';
    import { exportToPDF } from 'qrlayout-core/pdf';
    import type { StickerLayout } from 'qrlayout-ui';

    let employees = $state<Employee[]>([]);
    let labels = $state<StickerLayout[]>([]);
    let selectedLayoutId = $state<string>('');
    let selectedEmployeeIds = $state<string[]>([]);
    
    let isModalOpen = $state(false);
    let editingEmployee = $state<Employee | null>(null);
    let formData = $state<Partial<Employee>>({});

    // Printer instance
    let printer: StickerPrinter;

    onMount(() => {
        printer = new StickerPrinter();
        loadData();
    });

    function loadData() {
        employees = storage.getEmployees();
        const loadedLabels = storage.getLabels();
        const employeeLabels = loadedLabels.filter(l => l.targetEntity === 'employee');
        labels = employeeLabels;
        if (employeeLabels.length > 0 && !selectedLayoutId) {
            selectedLayoutId = employeeLabels[0].id;
        }
    }

    function handleOpenModal(employee?: Employee) {
        if (employee) {
            editingEmployee = employee;
            formData = { ...employee };
        } else {
            editingEmployee = null;
            formData = {};
        }
        isModalOpen = true;
    }

    function handleCloseModal() {
        isModalOpen = false;
        editingEmployee = null;
        formData = {};
    }

    function handleSave(e: Event) {
        e.preventDefault();
        if (!formData.fullName || !formData.employeeId) return;

        const employee: Employee = {
            id: editingEmployee?.id || crypto.randomUUID(),
            fullName: formData.fullName,
            employeeId: formData.employeeId,
            department: formData.department || '',
            joinDate: formData.joinDate || new Date().toISOString().split('T')[0]
        };

        storage.addEmployee(employee);
        loadData();
        handleCloseModal();
    }

    function handleDelete(employee: Employee) {
        if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
            storage.deleteEmployee(employee.id);
            loadData();
            // Remove from selection if deleted
            selectedEmployeeIds = selectedEmployeeIds.filter(id => id !== employee.id);
        }
    }

    // --- Export Logic ---

    function getSelectedEmployees() {
        return employees.filter(e => selectedEmployeeIds.includes(e.id));
    }

    function getActiveLayout() {
        return labels.find(l => l.id === selectedLayoutId);
    }

    async function handleExportPNG() {
        const layout = getActiveLayout();
        const selected = getSelectedEmployees();
        if (!layout || selected.length === 0) return;

        for (const emp of selected) {
            const dataUrl = await printer.renderToDataURL(layout, emp as any, { format: 'png' });

            const link = document.createElement('a');
            link.download = `${emp.fullName}-badge.png`;
            link.href = dataUrl;
            link.click();
        }
    }

    async function handleExportPDF() {
        const layout = getActiveLayout();
        const selected = getSelectedEmployees();
        if (!layout || selected.length === 0) return;

        const pdf = await exportToPDF(layout, selected as any[]);
        pdf.save(`batch-badges-${Date.now()}.pdf`);
    }

    function handleExportZPL() {
        const layout = getActiveLayout();
        const selected = getSelectedEmployees();
        if (!layout || selected.length === 0) return;

        const zplArray = printer.exportToZPL(layout, selected as any[]);
        const zplContent = zplArray.join('\n');

        console.log('ZPL Code generated:', zplContent);

        // Download ZPL txt
        const blob = new Blob([zplContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `batch-badges.zpl`;
        link.click();
    }

    const columns = [
        { header: 'Employee ID', accessorKey: 'employeeId' as const }, // as const to help TS inference
        { header: 'Full Name', accessorKey: 'fullName' as const },
        { header: 'Department', accessorKey: 'department' as const },
        { header: 'Join Date', accessorKey: 'joinDate' as const },
    ];

    let hasSelection = $derived(selectedEmployeeIds.length > 0);
    let hasLayout = $derived(!!selectedLayoutId);
</script>

<div class="max-w-7xl mx-auto px-8 py-8 animate-in fade-in duration-500">
    <!-- Top Bar: Title & Configuration -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h2 class="text-2xl font-bold text-gray-900">Employee Master</h2>
            <p class="text-gray-500">Manage records and print badges</p>
        </div>

        <div class="flex items-center gap-3">
            <!-- Layout Selector -->
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
                <span class="hidden sm:inline">Add Employee</span>
            </button>
        </div>
    </div>

    <!-- Info Guide -->
    {#if !hasSelection}
        <div class="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in">
            <Info class="text-teal-600 shrink-0 mt-0.5" size={20} />
            <div class="text-sm text-teal-900">
                <p class="font-semibold">Batch Export Instructions:</p>
                <ol class="list-decimal ml-4 mt-1 space-y-0.5 text-teal-800">
                    <li>Select a <strong>Layout Template</strong> from the dropdown above.</li>
                    <li>Check the box next to one or more employees in the table.</li>
                    <li>Click the appearing <strong>Export</strong> buttons (PNG, PDF, or ZPL) to generate badges.</li>
                </ol>
            </div>
        </div>
    {/if}

    <!-- Batch Actions Toolkit -->
    {#if hasSelection}
        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2">
            <div class="flex items-center gap-2 text-amber-900">
                <span class="font-semibold bg-amber-100 px-2 py-0.5 rounded text-sm">{selectedEmployeeIds.length}</span>
                <span class="font-medium">Selected</span>
            </div>

            <div class="flex items-center gap-2">
                <button
                    onclick={handleExportPNG}
                    disabled={!hasLayout}
                    class="flex items-center gap-2 bg-white text-gray-700 hover:text-teal-600 border border-gray-200 hover:border-teal-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Download as PNG Images"
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
        data={employees}
        {columns}
        keyField="id"
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        bind:selectedIds={selectedEmployeeIds}
    />

    <!-- Modal Overlay -->
    {#if isModalOpen}
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <!-- Modal Header -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                    </h3>
                    <button
                        onclick={handleCloseModal}
                        class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <!-- Modal Body -->
                <form onsubmit={handleSave} class="p-6 space-y-4">
                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                            bind:value={formData.fullName}
                            placeholder="e.g. Kashinath Hosapeti"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-gray-700">Employee ID</label>
                        <input
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                            bind:value={formData.employeeId}
                            placeholder="e.g. EMP-001"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-gray-700">Department</label>
                        <input
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                            bind:value={formData.department}
                            placeholder="e.g. Engineering"
                        />
                    </div>

                    <div class="space-y-1.5">
                        <label class="block text-sm font-medium text-gray-700">Join Date</label>
                        <input
                            type="date"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                            bind:value={formData.joinDate}
                        />
                    </div>

                    <!-- Modal Footer -->
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
