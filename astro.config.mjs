import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://paldaneparish.in",

  output: "static",

  trailingSlash: "never",

  adapter: netlify({
    // Keep edge middleware OFF unless required later
    edgeMiddleware: false,
  }),

  integrations: [tailwind(), react()],

  vite: {
    optimizeDeps: {
      exclude: ["@supabase/supabase-js"],
    },
  },

  image: {
    domains: [
      // Add your Supabase project domain here later:
      // "xxxxxxxxxxxxxxxx.supabase.co"
    ],
  },
});
