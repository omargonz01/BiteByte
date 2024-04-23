import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "BiteByte",
        short_name: "BiteByte",
        description:
          "An app that helps identify macro nutrient information of your food with a snap of a pic.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/src/assets/Images/appIcon.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
