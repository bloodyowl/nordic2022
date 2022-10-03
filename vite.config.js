import { defineConfig } from "vite";
import pluginReact from "@vitejs/plugin-react";

export default defineConfig({
  root: "./src",
  plugins: [pluginReact()],
});
