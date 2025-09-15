import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build optimization settings
  build: {
    // Enable minification for production
    minify: 'esbuild',
    
    // Generate source maps for debugging
    sourcemap: true,
    
    // Optimize chunk splitting and tree shaking
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'chart-vendor';
            }
            return 'vendor';
          }
        },
        
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `img/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || '')) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        // Optimize entry file names
        entryFileNames: 'js/[name]-[hash].js'
      },
      
      // Enable tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    
    // Target modern browsers for better optimization
    target: 'es2020',
    
    // Optimize CSS
    cssCodeSplit: true,
    
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Enable CSS minification
    cssMinify: true,
    
    // Optimize assets
    assetsInlineLimit: 4096 // 4kb
  },
  
  // Development server optimization
  server: {
    // Enable HMR
    hmr: true
  },
  
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'chart.js',
      'react-chartjs-2'
    ],
    exclude: []
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: true
  },
  
  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  },
  
  // CSS preprocessing
  css: {
    modules: {
      // CSS Modules configuration
      localsConvention: 'camelCase',
      generateScopedName: process.env.NODE_ENV === 'production' 
        ? '[hash:base64:5]' 
        : '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      // Add any CSS preprocessor options here if needed
    }
  }
})
