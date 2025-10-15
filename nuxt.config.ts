// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Nuxt 4 features
  future: {
    compatibilityVersion: 4,
  },
  
  // Enhanced type safety
  typescript: {
    typeCheck: false // Disabled for now to avoid startup issues
  },
  
  // CSS framework ready
  css: [
    '~/assets/css/main.css'
  ],
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // Auto-import configuration
  imports: {
    dirs: [
      'composables/**'
    ]
  },

  // App configuration
  app: {
    head: {
      title: 'Nuxt 4 Project',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern Nuxt 4 application' }
      ]
    }
  },

  // Runtime config
  runtimeConfig: {
    public: {
      cloudinary: {
        cloudName: 'nguyendangkhoa',
        uploadPreset: 'qldapm-fe'
      }
    }
  }
})
