
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
        host: '0.0.0.0',
        port: 5173,
        origin: 'http://192.168.1.243:5173',
        cors: {
            origin: '*',  // ou 'http://192.168.1.243:8000' pour être plus précis
        },
    },
});
