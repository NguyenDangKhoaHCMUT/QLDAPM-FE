<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        About This Project
      </h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Learn more about this Nuxt 4 application and its features.
      </p>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Project Details -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          🚀 Project Features
        </h2>
        <ul class="space-y-3 text-gray-600">
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            Nuxt 4 with latest performance optimizations
          </li>
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            Full TypeScript support with type checking
          </li>
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            Auto-imported components and composables
          </li>
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            File-based routing system
          </li>
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            SEO-friendly with meta tags management
          </li>
          <li class="flex items-start">
            <span class="text-green-500 mr-2">✓</span>
            Development tools and hot reload
          </li>
        </ul>
      </div>

      <!-- Technology Stack -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          🛠 Technology Stack
        </h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="font-medium">Nuxt.js</span>
            <span class="text-sm text-gray-600">{{ techStack.nuxt }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="font-medium">Vue.js</span>
            <span class="text-sm text-gray-600">{{ techStack.vue }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="font-medium">TypeScript</span>
            <span class="text-sm text-gray-600">{{ techStack.typescript }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span class="font-medium">Node.js</span>
            <span class="text-sm text-gray-600">{{ techStack.node }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Getting Started -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        🏁 Getting Started
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <span class="text-blue-600 font-semibold">1</span>
          </div>
          <h3 class="font-medium mb-2">Install Dependencies</h3>
          <p class="text-sm text-gray-600">Run <code class="bg-gray-100 px-2 py-1 rounded">npm install</code> to install all packages</p>
        </div>
        <div class="text-center">
          <div class="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <span class="text-green-600 font-semibold">2</span>
          </div>
          <h3 class="font-medium mb-2">Start Development</h3>
          <p class="text-sm text-gray-600">Run <code class="bg-gray-100 px-2 py-1 rounded">npm run dev</code> to start the dev server</p>
        </div>
        <div class="text-center">
          <div class="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <span class="text-purple-600 font-semibold">3</span>
          </div>
          <h3 class="font-medium mb-2">Build & Deploy</h3>
          <p class="text-sm text-gray-600">Run <code class="bg-gray-100 px-2 py-1 rounded">npm run build</code> for production</p>
        </div>
      </div>
    </div>

    <!-- Back to Home -->
    <div class="text-center">
      <NuxtLink 
        to="/" 
        class="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        ← Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  title: 'About - Nuxt 4 Project',
  description: 'Learn about this Nuxt 4 application and its features'
})

// Reactive data
const techStack = ref({
  nuxt: '4.1.1',
  vue: '3.5.21',
  typescript: 'Latest',
  node: '18+'
})

// SEO
useHead({
  title: 'About - Nuxt 4 Project',
  meta: [
    { name: 'description', content: 'Learn about this Nuxt 4 application and its modern features' },
    { name: 'keywords', content: 'About, Nuxt 4, Vue 3, TypeScript, Features' }
  ]
})
</script>

<style scoped>
code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
