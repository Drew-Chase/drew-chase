import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {copyFileSync} from "node:fs";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        {
            name: "spa-fallback",
            apply: "build",
            writeBundle() {
                copyFileSync("dist/index.html", "dist/404.html");
            }
        }
    ],
    clearScreen: false,
    server: {
        host: true,
        port: 3000,
        strictPort: true,
        hmr: {
            protocol: "ws",
            host: "localhost",
            port: 3000,
            clientPort: 3000,
            overlay: true
        },
        watch: {
            ignored: ["**/src-*/**"]
        }
    },
    build: {
        outDir: "dist",
        reportCompressedSize: true,
        rollupOptions: {
            output: {
                advancedChunks: {
                    groups: [
                        {
                            name: "react",
                            test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
                        },
                    ],
                },
            }
        }
    }
});
