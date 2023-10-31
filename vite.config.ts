import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    wasm(),
    topLevelAwait(),
    svelte()
  ],
  base: "/wilson",
})
