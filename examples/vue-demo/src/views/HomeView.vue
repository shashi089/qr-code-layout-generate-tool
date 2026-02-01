<script setup lang="ts">
import { ArrowRight, Box, CreditCard, QrCode, Scan, Settings } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white pb-32 pt-24 overflow-hidden relative">
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div class="max-w-7xl mx-auto px-8 relative z-10">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <div class="space-y-8">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-800/50 border border-teal-700/50 backdrop-blur-sm text-teal-100 text-sm font-medium">
                        <span class="relative flex h-2 w-2">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        v1.0 Now Available with Vue 3
                    </div>
                    <h1 class="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                        Design. Print. <br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Track Everything.</span>
                    </h1>
                    <p class="text-xl text-teal-100 font-light leading-relaxed max-w-lg">
                        The complete industrial labeling solution. Create dynamic QR code layouts for assets, employees, and inventory in minutes using our visual designer.
                    </p>
                    <div class="flex flex-wrap gap-4 pt-4">
                        <RouterLink to="/labels" class="bg-emerald-500 hover:bg-emerald-400 text-teal-950 px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                            Start Designing <ArrowRight :size="20" />
                        </RouterLink>
                        <a href="https://github.com/shashi089/qr-code-layout-generate-tool" target="_blank" class="bg-teal-800/40 hover:bg-teal-700/50 text-white border border-teal-700 decoration-none px-8 py-4 rounded-xl font-medium transition-all backdrop-blur-sm flex items-center gap-2">
                            View Logic
                        </a>
                    </div>
                </div>
                
                <!-- Hero Visual -->
                <div class="relative lg:h-[500px] flex items-center justify-center">
                    <div class="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                    <div class="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 w-full max-w-md">
                        <div class="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-teal-950 font-bold">
                                    <QrCode :size="24" />
                                </div>
                                <div>
                                    <div class="text-white font-semibold">Asset Tag #8842</div>
                                    <div class="text-teal-200 text-xs">Generated just now</div>
                                </div>
                            </div>
                            <div class="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                                45 x 25 mm
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="h-32 bg-white rounded-lg p-2 flex items-center justify-center shadow-inner">
                                <div class="border-2 border-dashed border-gray-300 rounded w-full h-full flex items-center justify-center flex-col gap-2 relative overflow-hidden bg-gray-50">
                                    <div class="absolute top-2 left-2 w-16 h-16 bg-gray-900 rounded-sm opacity-90"></div>
                                    <div class="ml-20 w-3/4 space-y-2">
                                        <div class="h-3 bg-gray-900 rounded w-3/4 opacity-80"></div>
                                        <div class="h-2 bg-gray-400 rounded w-1/2"></div>
                                        <div class="h-2 bg-gray-300 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-3">
                                <div class="h-2 bg-white/20 rounded w-1/3 animate-pulse"></div>
                                <div class="h-2 bg-white/10 rounded w-1/3"></div>
                            </div>
                            <button class="w-full py-3 bg-emerald-500 text-teal-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors mt-2">
                                Download ZPL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Features / Use Cases -->
    <div class="max-w-7xl mx-auto px-8 -mt-24 relative z-20 pb-24">
        <div class="grid md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:transform hover:-translate-y-2 transition-all duration-300 group">
                <div class="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Box :size="28" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Warehouse & Storage</h3>
                <p class="text-gray-500 leading-relaxed mb-6">
                    Organize your inventory with high-visibility bin labels. Generate sequential location tags (Aisle-Rack-Bin) and export in batch for massive labeling operations.
                </p>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>Batch ZPL Export</li>
                    <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>Custom Dimensions</li>
                </ul>
            </div>

            <!-- Feature 2 -->
            <div class="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200 hover:transform hover:-translate-y-2 transition-all duration-300 md:-mt-8 group relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-5">
                    <Settings :size="120" />
                </div>
                <div class="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Settings :size="28" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Asset Management</h3>
                <p class="text-gray-500 leading-relaxed mb-6">
                    Track expensive machinery and tools. Create durable asset tags that link directly to maintenance logs, manuals, or digital twins via compressed QR codes.
                </p>
                 <ul class="space-y-2 text-sm text-gray-600">
                    <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>Machine Specifications</li>
                    <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>PDF Catalog Generation</li>
                </ul>
            </div>

            <!-- Feature 3 -->
            <div class="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:transform hover:-translate-y-2 transition-all duration-300 group">
                <div class="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <CreditCard :size="28" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">Employee Badges</h3>
                <p class="text-gray-500 leading-relaxed mb-6">
                    Secure your facility with professional ID credentials. Merge employee data and access control QR codes into a standardized card format.
                </p>
                 <ul class="space-y-2 text-sm text-gray-600">
                    <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>Digital Verification</li>
                    <li class="flex items-center gap-2"><div class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>Department Coding</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Workflow Section -->
    <div class="max-w-7xl mx-auto px-8 py-16">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">How it Works</h2>
            <p class="text-gray-500 max-w-2xl mx-auto">Three simple steps to go from data to printed label.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 relative">
            <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 hidden md:block"></div>
            
            <!-- Step 1 -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 text-center relative">
                <div class="w-12 h-12 bg-white border-2 border-teal-500 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">1</div>
                <h4 class="font-bold text-lg mb-2">Design Layout</h4>
                <p class="text-sm text-gray-500">Use the drag-and-drop editor to create your perfect label template with placeholders.</p>
            </div>

             <!-- Step 2 -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 text-center relative">
                <div class="w-12 h-12 bg-white border-2 border-teal-500 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">2</div>
                <h4 class="font-bold text-lg mb-2">Manage Data</h4>
                <p class="text-sm text-gray-500">Add or import your master data (employees, machines, bins) into the local system.</p>
            </div>

             <!-- Step 3 -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 text-center relative">
                <div class="w-12 h-12 bg-white border-2 border-teal-500 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">3</div>
                <h4 class="font-bold text-lg mb-2">Batch Print</h4>
                <p class="text-sm text-gray-500">Select records and instantly generate PDF or ZPL files for your thermal printers.</p>
            </div>
        </div>
    </div>
    
    <!-- CTA Footer -->
    <div class="bg-gray-900 text-white py-24 mt-12">
        <div class="max-w-4xl mx-auto text-center px-8">
            <h2 class="text-3xl md:text-5xl font-bold mb-8">Ready to upgrade your workflow?</h2>
            <p class="text-gray-400 mb-10 text-lg">Join thousands of industrial facilities optimizing their labeling process today. Open source and free for local use.</p>
            <RouterLink to="/labels" class="inline-flex items-center gap-3 bg-teal-500 text-teal-950 px-8 py-4 rounded-xl font-bold hover:bg-teal-400 transition-colors">
                Launch Application <Scan :size="20" />
            </RouterLink>
        </div>
    </div>
  </div>
</template>
