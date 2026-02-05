<script lang="ts">
	import './layout.css';
	import 'qrlayout-ui/style.css';
	import { page } from '$app/stores';
	import { Home, Tag, Users, Cpu, Package } from 'lucide-svelte';
	import { storage } from '$lib/services/storage';

	let { children } = $props();

	let pathname = $derived($page.url.pathname);
	// Check if the current route is the designer route to hide navigation
	let isDesigner = $derived(pathname.includes('/designer'));

	function handleReset() {
		if (confirm('Are you sure? This will delete all labels and employees.')) {
			storage.clearAll();
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title>QR Layout Studio (SvelteKit)</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	{#if !isDesigner}
		<div
			class="sticky top-0 z-40 border-b border-gray-200 bg-white bg-white/95 shadow-sm backdrop-blur-lg"
		>
			<div class="mx-auto max-w-7xl px-8">
				<div class="flex items-center justify-between py-4">
					<!-- Logo/Brand -->
					<div class="flex items-center gap-3">
						<div class="rounded-xl bg-gradient-to-br from-orange-400 to-rose-600 p-2.5 shadow-md">
							<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
								/>
							</svg>
						</div>
						<div>
							<h1
								class="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent"
							>
								QR Layout Studio
							</h1>
							<p class="text-xs text-gray-500">Management Dashboard</p>
						</div>
					</div>

					<!-- Navigation Tabs -->
					<nav class="flex gap-2 rounded-xl bg-gray-100 p-1.5">
						<a
							href="/"
							class={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all duration-200 ${
								pathname === '/'
									? 'bg-white text-orange-600 shadow-sm'
									: 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
							}`}
						>
							<Home size={18} />
							<span class="hidden md:inline">Home</span>
						</a>
						<a
							href="/labels"
							class={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all duration-200 ${
								pathname.startsWith('/labels')
									? 'bg-white text-orange-600 shadow-sm'
									: 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
							}`}
						>
							<Tag size={18} />
							<span>Labels</span>
						</a>
						<a
							href="/employees"
							class={`flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-all duration-200 ${
								pathname.startsWith('/employees')
									? 'bg-white text-orange-600 shadow-md'
									: 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
							}`}
						>
							<Users size={18} />
							<span>Employees</span>
						</a>
						<a
							href="/machines"
							class={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all duration-200 ${
								pathname.startsWith('/machines')
									? 'bg-white text-orange-600 shadow-sm'
									: 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
							}`}
						>
							<Cpu size={18} />
							<span class="hidden md:inline">Machines</span>
						</a>
						<a
							href="/storage"
							class={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-all duration-200 ${
								pathname.startsWith('/storage')
									? 'bg-white text-orange-600 shadow-sm'
									: 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
							}`}
						>
							<Package size={18} />
							<span class="hidden md:inline">Storage</span>
						</a>
					</nav>

					<!-- Actions -->
					<button
						onclick={handleReset}
						class="ml-4 cursor-pointer rounded-lg border border-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
					>
						Clear Data
					</button>
				</div>
			</div>
		</div>
	{/if}

	{@render children()}
</div>
