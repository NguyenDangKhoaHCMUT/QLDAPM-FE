# Nuxt 4 Project 🚀

A modern **Nuxt 4** application with TypeScript, Tailwind CSS, and best practices for beginners.

## 📋 Prerequisites

Before you start, make sure you have the following installed on your computer:

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - To check if installed: `node --version`

2. **npm** (comes with Node.js)
   - To check if installed: `npm --version`

3. **Git** (optional but recommended)
   - Download from [git-scm.com](https://git-scm.com/)

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

First, you need to install all the required packages. Open your terminal/command prompt in the project folder and run:

```bash
npm install
```

**What this does:** Downloads all the necessary packages and libraries that the project needs to run.

### Step 2: Start the Development Server

Once installation is complete, start the development server:

```bash
npm run dev
```

**What this does:** 
- Starts a local development server
- Opens your project at `http://localhost:3000`
- Automatically refreshes the page when you make changes to the code

### Step 3: View Your Project

Open your web browser and go to:
```
http://localhost:3000
```

You should see your Nuxt 4 application running! 🎉

## 📁 Project Structure

Here's what each folder contains:

```
QLDAPM-FE/
├── app/                    # Main application code
│   ├── components/         # Reusable Vue components
│   ├── pages/             # Your website pages (routes)
│   ├── layouts/           # Page layouts
│   ├── composables/       # Reusable logic functions
│   └── assets/            # CSS, images, fonts
├── public/                # Static files (images, favicon, etc.)
├── nuxt.config.ts         # Nuxt configuration
├── package.json           # Project dependencies and scripts
└── README.md              # This file
```

## 🛠 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run generate` | Generate static site |

## ✨ What's Included

- **Nuxt 4.1.1** - Latest version with enhanced performance
- **Vue 3.5+** - Modern Vue.js framework
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Auto-imports** - No need to manually import components and composables
- **File-based routing** - Pages are automatically created based on file structure
- **SEO optimized** - Built-in meta tags and head management

## 📝 Making Your First Changes

### 1. Edit the Home Page
Open `app/pages/index.vue` and modify the content to see changes instantly.

### 2. Add a New Page
Create a new file in `app/pages/` (e.g., `contact.vue`) and it will automatically become available at `/contact`.

### 3. Create Components
Add reusable components in `app/components/` and they'll be auto-imported in your pages.

## 🎨 Styling

This project uses **Tailwind CSS**. You can:

- Use Tailwind classes directly in your components: `class="bg-blue-500 text-white p-4"`
- Add custom CSS in `app/assets/css/main.css`
- Create component-specific styles using `<style scoped>`

## 🐛 Common Issues

### Port Already in Use
If port 3000 is busy, the server will automatically use the next available port.

### PowerShell Execution Policy (Windows)
If you get execution policy errors, run:
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node Version Issues
Make sure you're using Node.js version 18 or higher:
```bash
node --version
```

## 📚 Learning Resources

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Vue 3 Guide](https://vuejs.org/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Look at the terminal output for detailed error information
3. Refer to the [Nuxt documentation](https://nuxt.com/docs)
4. Ask questions in the [Nuxt community](https://discord.nuxt.com/)

## 🚢 Deployment

When you're ready to deploy your project:

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to platforms like:**
   - [Vercel](https://vercel.com/)
   - [Netlify](https://netlify.com/)
   - [Cloudflare Pages](https://pages.cloudflare.com/)

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for detailed instructions.

---

**Happy coding! 🎉**
