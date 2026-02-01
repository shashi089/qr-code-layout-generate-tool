<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink, RouterView } from 'vue-router';
import { Home, Tag, Users, Cpu, Package } from 'lucide-vue-next';
import { storage } from './services/storage';

const route = useRoute();

// Check if the current route is the designer route to hide navigation
// Note: In original svelte code it checks for 'designer'.
// I assume designer route might be '/labels/designer' or similar.
const isDesigner = computed(() => route.path.includes('/designer'));

function handleReset() {
  if (confirm('Are you sure? This will delete all labels and employees.')) {
    storage.clearAll();
    window.location.reload();
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="!isDesigner" class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 backdrop-blur-lg bg-white/95">
      <div class="max-w-7xl mx-auto px-8">
        <div class="flex items-center justify-between py-4">
          <!-- Logo/Brand -->
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                QR Layout Studio
              </h1>
              <p class="text-xs text-gray-500">Management Dashboard</p>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <nav class="flex gap-2 bg-gray-100 p-1.5 rounded-xl">
            <RouterLink
              to="/"
              class="flex items-center gap-2 px-4 py-2 font-semibold transition-all duration-200 rounded-lg"
              :class="{ 'bg-white text-teal-600 shadow-sm': route.path === '/', 'text-gray-600 hover:text-gray-900 hover:bg-white/50': route.path !== '/' }"
            >
              <Home :size="18" />
              <span class="hidden md:inline">Home</span>
            </RouterLink>
            <RouterLink
              to="/labels"
              class="flex items-center gap-2 px-4 py-2 font-semibold transition-all duration-200 rounded-lg"
              :class="{ 'bg-white text-teal-600 shadow-sm': route.path.startsWith('/labels'), 'text-gray-600 hover:text-gray-900 hover:bg-white/50': !route.path.startsWith('/labels') }"
            >
              <Tag :size="18" />
              <span>Labels</span>
            </RouterLink>
            <RouterLink
              to="/employees"
              class="flex items-center gap-2 px-5 py-2.5 font-semibold transition-all duration-200 rounded-lg"
              :class="{ 'bg-white text-teal-600 shadow-md': route.path.startsWith('/employees'), 'text-gray-600 hover:text-gray-900 hover:bg-white/50': !route.path.startsWith('/employees') }"
            >
              <Users :size="18" />
              <span>Employees</span>
            </RouterLink>
            <RouterLink
              to="/machines"
              class="flex items-center gap-2 px-4 py-2 font-semibold transition-all duration-200 rounded-lg"
              :class="{ 'bg-white text-teal-600 shadow-sm': route.path.startsWith('/machines'), 'text-gray-600 hover:text-gray-900 hover:bg-white/50': !route.path.startsWith('/machines') }"
            >
              <Cpu :size="18" />
              <span class="hidden md:inline">Machines</span>
            </RouterLink>
            <RouterLink
              to="/storage"
              class="flex items-center gap-2 px-4 py-2 font-semibold transition-all duration-200 rounded-lg"
              :class="{ 'bg-white text-teal-600 shadow-sm': route.path.startsWith('/storage'), 'text-gray-600 hover:text-gray-900 hover:bg-white/50': !route.path.startsWith('/storage') }"
            >
              <Package :size="18" />
              <span class="hidden md:inline">Storage</span>
            </RouterLink>
          </nav>

          <!-- Actions -->
          <button
            @click="handleReset"
            class="ml-4 text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-100"
          >
            Clear Data
          </button>
        </div>
      </div>
    </div>

    <RouterView />
  </div>
</template>
