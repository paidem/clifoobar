import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const proxyHost = env.DJANGO_PROXY_HOST || "127.0.0.1";
    const proxyPort = env.DJANGO_PROXY_PORT || "8000";
    const proxyTarget = `http://${proxyHost}:${proxyPort}`;

    return {
        plugins: [
            react({
                include: /\.(js|jsx|ts|tsx)$/,
            }),
        ],
        define: {
            "process.env.REACT_APP_VERSION": JSON.stringify(
                env.REACT_APP_VERSION || env.VITE_APP_VERSION || ""
            ),
        },
        server: {
            proxy: {
                "/api": {
                    target: proxyTarget,
                    changeOrigin: true,
                },
                "/admin": {
                    target: proxyTarget,
                    changeOrigin: true,
                },
                "/staticfiles": {
                    target: proxyTarget,
                    changeOrigin: true,
                },
            },
        },
        test: {
            environment: "jsdom",
            setupFiles: "./src/setupTests.js",
            globals: true,
        },
    };
});
