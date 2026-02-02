import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      includeAssets:[
        "favicon.ico",
        "apple-touch-icon.png"
      ],
      manifest:{
        name: "Property Listing App",
        short_name: "Properties",
        description: "Browse and manage property listings offline",
        theme_color:"#0f172a",
        background_color:"#ffffff",
        display:"standalone",
        start_url:"/",
        scope:"/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
       workbox: {
        runtimeCaching: [
          {
            // Cache Supabase property list API
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/properties.*/,

            handler: "NetworkFirst",

            options: {
              cacheName: "supabase-properties-api",

              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              },

              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
