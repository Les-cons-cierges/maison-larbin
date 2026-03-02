
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    root: "assets",
    base: "/",
    build: {
        outDir: "../assets/components",
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: {
                app: "./main.jsx",
            },
        },
    },
    server: {
        strictPort: true,
        port: 5173,
    },
});
