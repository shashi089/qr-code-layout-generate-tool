<script lang="ts">
	import { ArrowRight, Box, CreditCard, Printer, QrCode, Scan, Settings } from 'lucide-svelte';
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Hero Section -->
	<div
		class="relative overflow-hidden bg-gradient-to-br from-orange-950 via-orange-900 to-rose-950 pt-24 pb-32 text-white"
	>
		<div
			class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"
		></div>
		<div class="relative z-10 mx-auto max-w-7xl px-8">
			<div class="grid items-center gap-12 lg:grid-cols-2">
				<div class="space-y-8">
					<div
						class="inline-flex items-center gap-2 rounded-full border border-orange-700/50 bg-orange-800/50 px-4 py-2 text-sm font-medium text-orange-100 backdrop-blur-sm"
					>
						<span class="relative flex h-2 w-2">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"
							></span>
							<span class="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
						</span>
						v1.0 Now Available with Svelte 5
					</div>
					<h1 class="text-5xl leading-tight font-bold tracking-tight lg:text-7xl">
						Design. Print. <br />
						<span class="bg-gradient-to-r from-orange-400 to-rose-300 bg-clip-text text-transparent"
							>Track Everything.</span
						>
					</h1>
					<p class="max-w-lg text-xl leading-relaxed font-light text-orange-100">
						The complete industrial labeling solution. Create dynamic QR code layouts for assets,
						employees, and inventory in minutes using our visual designer.
					</p>
					<div class="flex flex-wrap gap-4 pt-4">
						<a
							href="/labels"
							class="flex transform items-center gap-2 rounded-xl border border-orange-500/50 bg-orange-600 px-8 py-4 font-bold text-white shadow-lg shadow-orange-900/40 transition-all hover:-translate-y-1 hover:bg-orange-500"
						>
							Start Designing <ArrowRight size={20} />
						</a>
						<a
							href="https://github.com/shashi089/qr-code-layout-generate-tool"
							target="_blank"
							class="decoration-none flex items-center gap-2 rounded-xl border border-orange-700 bg-orange-800/40 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all hover:bg-orange-700/50"
						>
							View Logic
						</a>
					</div>
				</div>

				<!-- Hero Visual -->
				<div class="relative flex items-center justify-center lg:h-[500px]">
					<div class="absolute inset-0 rounded-full bg-orange-500/20 blur-3xl"></div>
					<div
						class="relative w-full max-w-md rotate-3 rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl transition-all duration-700 hover:rotate-0"
					>
						<div class="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 font-bold text-white"
								>
									<QrCode size={24} />
								</div>
								<div>
									<div class="font-semibold text-white">Asset Tag #8842</div>
									<div class="text-xs text-orange-200">Generated just now</div>
								</div>
							</div>
							<div
								class="rounded border border-orange-500/30 bg-orange-500/20 px-3 py-1 font-mono text-xs text-orange-200"
							>
								45 x 25 mm
							</div>
						</div>
						<div class="space-y-4">
							<div
								class="flex h-32 items-center justify-center rounded-lg bg-white p-2 shadow-inner"
							>
								<div
									class="relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden rounded border-2 border-dashed border-gray-300 bg-gray-50"
								>
									<div
										class="absolute top-2 left-2 h-16 w-16 rounded-sm bg-gray-900 opacity-90"
									></div>
									<div class="ml-20 w-3/4 space-y-2">
										<div class="h-3 w-3/4 rounded bg-gray-900 opacity-80"></div>
										<div class="h-2 w-1/2 rounded bg-gray-400"></div>
										<div class="h-2 w-full rounded bg-gray-300"></div>
									</div>
								</div>
							</div>
							<div class="flex gap-3">
								<div class="h-2 w-1/3 animate-pulse rounded bg-white/20"></div>
								<div class="h-2 w-1/3 rounded bg-white/10"></div>
							</div>
							<button
								class="mt-2 w-full rounded-lg border border-orange-500/50 bg-orange-600 py-3 font-bold text-white shadow-lg shadow-orange-950/20 transition-colors hover:bg-orange-500"
							>
								Download ZPL
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Features / Use Cases -->
	<div class="relative z-20 mx-auto -mt-24 max-w-7xl px-8 pb-24">
		<div class="grid gap-8 md:grid-cols-3">
			<!-- Feature 1 -->
			<div
				class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2 hover:transform"
			>
				<div
					class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white"
				>
					<Box size={28} />
				</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Warehouse & Storage</h3>
				<p class="mb-6 leading-relaxed text-gray-500">
					Organize your inventory with high-visibility bin labels. Generate sequential location tags
					(Aisle-Rack-Bin) and export in batch for massive labeling operations.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center gap-2">
						<div class="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
						Batch ZPL Export
					</li>
					<li class="flex items-center gap-2">
						<div class="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
						Custom Dimensions
					</li>
				</ul>
			</div>

			<!-- Feature 2 -->
			<div
				class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2 hover:transform md:-mt-8"
			>
				<div class="absolute top-0 right-0 p-4 opacity-5">
					<Settings size={120} />
				</div>
				<div
					class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white"
				>
					<Settings size={28} />
				</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Asset Management</h3>
				<p class="mb-6 leading-relaxed text-gray-500">
					Track expensive machinery and tools. Create durable asset tags that link directly to
					maintenance logs, manuals, or digital twins via compressed QR codes.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center gap-2">
						<div class="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
						Machine Specifications
					</li>
					<li class="flex items-center gap-2">
						<div class="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
						PDF Catalog Generation
					</li>
				</ul>
			</div>

			<!-- Feature 3 -->
			<div
				class="group rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2 hover:transform"
			>
				<div
					class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white"
				>
					<CreditCard size={28} />
				</div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Employee Badges</h3>
				<p class="mb-6 leading-relaxed text-gray-500">
					Secure your facility with professional ID credentials. Merge employee data and access
					control QR codes into a standardized card format.
				</p>
				<ul class="space-y-2 text-sm text-gray-600">
					<li class="flex items-center gap-2">
						<div class="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
						Digital Verification
					</li>
					<li class="flex items-center gap-2">
						<div class="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
						Department Coding
					</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Workflow Section -->
	<div class="mx-auto max-w-7xl px-8 py-16">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold text-gray-900">How it Works</h2>
			<p class="mx-auto max-w-2xl text-gray-500">
				Three simple steps to go from data to printed label.
			</p>
		</div>

		<div class="relative grid gap-8 md:grid-cols-3">
			<div class="absolute top-1/2 left-0 -z-10 hidden h-0.5 w-full bg-gray-200 md:block"></div>

			<!-- Step 1 -->
			<div class="relative rounded-xl border border-gray-200 bg-white p-6 text-center">
				<div
					class="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-500 bg-white text-xl font-bold text-orange-600"
				>
					1
				</div>
				<h4 class="mb-2 text-lg font-bold">Design Layout</h4>
				<p class="text-sm text-gray-500">
					Use the drag-and-drop editor to create your perfect label template with placeholders.
				</p>
			</div>

			<!-- Step 2 -->
			<div class="relative rounded-xl border border-gray-200 bg-white p-6 text-center">
				<div
					class="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-500 bg-white text-xl font-bold text-orange-600"
				>
					2
				</div>
				<h4 class="mb-2 text-lg font-bold">Manage Data</h4>
				<p class="text-sm text-gray-500">
					Add or import your master data (employees, machines, bins) into the local system.
				</p>
			</div>

			<!-- Step 3 -->
			<div class="relative rounded-xl border border-gray-200 bg-white p-6 text-center">
				<div
					class="relative z-10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-500 bg-white text-xl font-bold text-orange-600"
				>
					3
				</div>
				<h4 class="mb-2 text-lg font-bold">Batch Print</h4>
				<p class="text-sm text-gray-500">
					Select records and instantly generate PDF or ZPL files for your thermal printers.
				</p>
			</div>
		</div>
	</div>

	<!-- CTA Footer -->
	<div class="mt-12 bg-gray-900 py-24 text-white">
		<div class="mx-auto max-w-4xl px-8 text-center">
			<h2 class="mb-8 text-3xl font-bold md:text-5xl">Ready to upgrade your workflow?</h2>
			<p class="mb-10 text-lg text-gray-400">
				Join thousands of industrial facilities optimizing their labeling process today. Open source
				and free for local use.
			</p>
			<a
				href="/labels"
				class="inline-flex items-center gap-3 rounded-xl bg-orange-600 px-8 py-4 font-bold text-white shadow-lg shadow-orange-950/50 transition-colors hover:bg-orange-500"
			>
				Launch Application <Scan size={20} />
			</a>
		</div>
	</div>
</div>
