# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- `npm install` - Install all dependencies
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run generate` - Generate static site

### TypeScript
- TypeScript checking is disabled in nuxt.config.ts for faster startup
- TSConfig references are handled by Nuxt automatically via `.nuxt/tsconfig.*.json` files
- Use `vue-tsc --noEmit` for manual type checking if needed

## Architecture Overview

### Framework Stack
- **Nuxt 4.1.1** with compatibility version 4 enabled
- **Vue 3.5+** with Composition API
- **TypeScript** with full type safety
- **Tailwind CSS** for styling via `@nuxtjs/tailwindcss`

### Project Structure
```
app/
├── app.vue              # Root application component
├── pages/               # File-based routing (index.vue, about.vue)
├── components/          # Auto-imported Vue components
├── layouts/             # Layout components (default.vue)
├── composables/         # Auto-imported composables (useCounter.ts)
└── assets/css/          # Global styles (main.css)
```

### Key Architectural Patterns

#### Auto-Import System
- Components in `app/components/` are auto-imported
- Composables in `app/composables/` are auto-imported  
- Vue 3 APIs (`ref`, `computed`, etc.) are auto-imported
- Nuxt composables (`useHead`, `definePageMeta`, etc.) are auto-imported

#### File-Based Routing
- Pages in `app/pages/` automatically become routes
- `index.vue` → `/`
- `about.vue` → `/about`

#### Layout System
- `app/layouts/default.vue` provides the main application shell
- Includes navigation, main content area, and footer
- Uses `<slot />` to render page content

#### Component Architecture
- Components use `<script setup lang="ts">` with TypeScript
- Props are defined with TypeScript interfaces
- Scoped styling with `<style scoped>`

#### Composables Pattern
- Business logic extracted into reusable composables
- Example: `useCounter.ts` demonstrates state management pattern
- Return reactive state and methods

#### SEO and Meta Management
- `definePageMeta()` for page-level configuration
- `useHead()` for dynamic meta tags and titles
- Global head configuration in `nuxt.config.ts`

### Styling Architecture
- **Global styles**: `app/assets/css/main.css`
- **CSS variables**: Custom properties defined in `:root`
- **Utility classes**: Custom Tailwind extensions (`.btn-primary`, `.btn-secondary`)
- **Component styles**: Scoped styles in individual components
- **Responsive design**: Mobile-first approach with Tailwind breakpoints

### Configuration
- **Main config**: `nuxt.config.ts` with Nuxt 4 compatibility enabled
- **TypeScript**: References-based configuration for optimal performance
- **Tailwind**: Integrated via module with custom CSS file
- **Dev tools**: Enabled in development mode

### Development Patterns
- Use `definePageMeta()` for page-specific configuration
- Implement composables for shared logic
- Leverage auto-imports for cleaner code
- Use TypeScript interfaces for prop definitions
- Apply responsive design with Tailwind classes
