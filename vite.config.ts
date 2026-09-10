import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath, URL } from "node:url";

// Le visualiseur de bundle n'est branche que sur `npm run analyze`.
// Sinon il ecrirait un stats.html dans dist/ a chaque build de production.
const analyse = process.env.ANALYZE === "1";

export default defineConfig({
  plugins: [
    react(),       // 1. compile le JSX, gere le rechargement a chaud
    tailwindcss(), // 2. genere le CSS Tailwind v4 (pas de PostCSS, pas de config JS)
    svgr(),        // 3. `import Figure from "...svg?react"` -> composant React
    ...(analyse
      ? [visualizer({ filename: "dist/stats.html", gzipSize: true, brotliSize: true })]
      : []),
  ],
  resolve: {
    // Alias "@" -> src/. Doit etre declare AUSSI dans tsconfig.app.json,
    // sinon Vite resout mais TypeScript se plaint : c'est l'oubli n°1.
    // `import.meta.url` et non `__dirname` : le projet est en ESM ("type": "module"),
    // ou __dirname n'existe pas.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
