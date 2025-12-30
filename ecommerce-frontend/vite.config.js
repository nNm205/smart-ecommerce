import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/products': 'http://localhost:8087/api',
            '/categories': 'http://localhost:8087/api',
            '/admin': 'http://localhost:8087/api',
            '/auth': 'http://localhost:8087/api',
        },
    },
});