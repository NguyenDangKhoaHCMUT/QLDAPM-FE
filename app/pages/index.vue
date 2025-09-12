<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="text-center py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Nuxt 4! 🚀
      </h1>
      <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        This is a modern Nuxt 4 application with the latest features, 
        TypeScript support, and optimized performance.
      </p>
      <div class="space-x-4">
        <NuxtLink 
          to="/about" 
          class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Learn More
        </NuxtLink>
        <a 
          href="https://nuxt.com" 
          target="_blank" 
          class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Documentation
        </a>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FeatureCard
        icon="⚡"
        title="Lightning Fast"
        description="Optimized performance with Nuxt 4's new architecture"
      />
      <FeatureCard
        icon="🔒"
        title="Type Safe"
        description="Full TypeScript support with enhanced type checking"
      />
      <FeatureCard
        icon="🎨"
        title="Modern UI"
        description="Beautiful components with Tailwind CSS ready"
      />
      <FeatureCard
        icon="📱"
        title="Responsive"
        description="Mobile-first design that works on all devices"
      />
      <FeatureCard
        icon="🔧"
        title="Developer Experience"
        description="Enhanced dev tools and hot module replacement"
      />
      <FeatureCard
        icon="🚀"
        title="Production Ready"
        description="Optimized builds and deployment strategies"
      />
    </div>

    <!-- Stats Section -->
    <div class="bg-white rounded-lg shadow-sm p-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Project Info
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-3xl font-bold text-green-600">{{ nuxtVersion }}</div>
          <div class="text-sm text-gray-600">Nuxt Version</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-blue-600">{{ vueVersion }}</div>
          <div class="text-sm text-gray-600">Vue Version</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-purple-600">TypeScript</div>
          <div class="text-sm text-gray-600">Full Support</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  title: 'Home - Nuxt 4 Project',
  description: 'Welcome to your new Nuxt 4 application'
})

// Reactive data
const nuxtVersion = ref('4.1.1')
const vueVersion = ref('3.5+')

// SEO
useHead({
  title: 'Home - Nuxt 4 Project',
  meta: [
    { name: 'description', content: 'Welcome to your new Nuxt 4 application with modern features' },
    { name: 'keywords', content: 'Nuxt, Vue, TypeScript, Web Development' }
  ]
})
</script>

<style scoped>
/* Add any scoped styles here */
</style>
