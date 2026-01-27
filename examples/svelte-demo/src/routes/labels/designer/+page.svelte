<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { QRLayoutDesigner, type EntitySchema, type StickerLayout } from 'qrlayout-ui';
    import { storage } from '$lib/services/storage';
    import { ArrowLeft } from 'lucide-svelte';

    let container: HTMLDivElement;
    let designer: QRLayoutDesigner | null = null;
    let layoutId = $derived($page.url.searchParams.get('id'));

    const SAMPLE_SCHEMAS: Record<string, EntitySchema> = {
      employee: {
        label: "Employee Master",
        fields: [
          { name: "fullName", label: "Full Name" },
          { name: "employeeId", label: "Employee ID" },
          { name: "department", label: "Department" },
          { name: "joinDate", label: "Join Date" },
        ],
        sampleData: {
          fullName: "Aditi Sharma",
          employeeId: "EMP-092",
          department: "Quality Assurance",
          joinDate: "2023-11-05"
        }
      },
      machine: {
        label: "Machine Master",
        fields: [
          { name: "machineName", label: "Machine Name" },
          { name: "machineCode", label: "Machine Code" },
          { name: "location", label: "Location" },
          { name: "model", label: "Model" },
        ],
        sampleData: {
          machineName: "Tata hydraulic Press",
          machineCode: "P-4500-X",
          location: "Assembly Line 04",
          model: "THP-2024"
        }
      },
      storage: {
        label: "Storage Master",
        fields: [
          { name: "binCode", label: "BIN Code" },
          { name: "storageType", label: "Storage Type" },
          { name: "aisle", label: "Aisle" },
          { name: "rack", label: "Rack Number" },
        ],
        sampleData: {
          binCode: "WH-CHE-A12",
          storageType: "Cold Storage",
          aisle: "Chennai Aisle 12",
          rack: "R-08"
        }
      }
    };

    const DEFAULT_NEW_LAYOUT: Omit<StickerLayout, 'id'> = {
      name: "New QR Label",
      targetEntity: "employee",
      width: 100,
      height: 60,
      unit: "mm",
      backgroundColor: "#ffffff",
      elements: []
    };

    onMount(() => {
        let initialLayout: StickerLayout;
        const currentLayoutId = $page.url.searchParams.get('id');

        if (currentLayoutId) {
            const found = storage.getLabels().find(l => l.id === currentLayoutId);
            if (found) {
                initialLayout = found;
            } else {
                initialLayout = { ...DEFAULT_NEW_LAYOUT, id: crypto.randomUUID() } as StickerLayout;
            }
        } else {
            initialLayout = { ...DEFAULT_NEW_LAYOUT, id: crypto.randomUUID() } as StickerLayout;
        }

        if (container) {
             designer = new QRLayoutDesigner({
                element: container,
                entitySchemas: SAMPLE_SCHEMAS,
                initialLayout: initialLayout,
                onSave: (savedLayout) => {
                    storage.addLabel(savedLayout);
                    goto('/labels');
                }
            });
        }
    });

    onDestroy(() => {
        if (designer) {
            designer.destroy();
            designer = null;
        }
    });

    function handleBack() {
        goto('/labels');
    }
</script>

<div class="relative min-h-screen bg-white">
    <button
        onclick={handleBack}
        class="fixed top-4 left-4 z-[9999] flex items-center gap-2 bg-white hover:bg-teal-50 text-gray-700 hover:text-teal-700 px-4 py-2 rounded-lg font-medium shadow-md transition-all border border-gray-200 hover:border-teal-200 cursor-pointer"
    >
        <ArrowLeft size={18} />
        Back to Labels
    </button>
    <div
        class="designer-container h-screen w-screen"
        bind:this={container}
    ></div>
</div>
