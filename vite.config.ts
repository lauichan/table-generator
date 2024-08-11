import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@components", replacement: "/src/components" },
      { find: "@hooks", replacement: "/src/hooks" },
      { find: "@store", replacement: "/src/store" },
      { find: "@utils", replacement: "/src/utils" },
      { find: "@", replacement: "/src" },
    ],
  },
});
