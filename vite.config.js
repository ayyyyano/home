/* eslint-disable no-undef */
import { defineConfig, loadEnv } from "vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import viteCompression from "vite-plugin-compression";

// 环境变量默认值 (避免 Vercel 等平台缺少 .env 文件时构建崩溃)
const ENV_DEFAULTS = {
  VITE_SITE_NAME: "Nekro's SEKAI",
  VITE_SITE_AUTHOR: 'Nekro',
  VITE_SITE_KEYWORDS: 'Nekro,Ayyyyano,个人主页',
  VITE_SITE_DES: '谢谢你在人群中找到我。',
  VITE_SITE_URL: 'nekro.top',
  VITE_SITE_LOGO: '/images/icon/favicon.ico',
  VITE_SITE_MAIN_LOGO: '/images/icon/logo.png',
  VITE_SITE_APPLE_LOGO: '/images/logo/apple-touch-icon.png',
  VITE_DESC_HELLO: 'Hello !',
  VITE_DESC_TEXT: '谢谢你在人群中找到我。',
  VITE_DESC_HELLO_OTHER: 'Oops !',
  VITE_DESC_TEXT_OTHER: '哎呀，这都被你发现了（ 再点击一次可关闭 ）',
  VITE_WEATHER_KEY: '',
  VITE_SITE_START: '2026-04-10',
  VITE_SITE_ICP: '萌ICP备20262514号',
  VITE_SONG_API: 'https://meting-api.nekro.top/api',
  VITE_SONG_SERVER: 'netease',
  VITE_SONG_TYPE: 'song',
  VITE_SONG_ID: '2057797340',
};
for (const [key, value] of Object.entries(ENV_DEFAULTS)) {
  if (!process.env[key]) process.env[key] = value;
}

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue"],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: /(.*?)\.(js|css|woff2|woff)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "js-css-cache",
              },
            },
            {
              urlPattern: /(.*?)\.(ttf)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "font-cache",
                expiration: {
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 天
                },
              },
            },
            {
              urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps|ico)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "image-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
                },
              },
            },
          ],
        },
        manifest: {
          name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          short_name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          description: loadEnv(mode, process.cwd()).VITE_SITE_DES,
          display: "standalone",
          start_url: "/",
          theme_color: "#424242",
          background_color: "#424242",
          icons: [
            {
              src: "/images/icon/48.png",
              sizes: "48x48",
              type: "image/png",
            },
            {
              src: "/images/icon/72.png",
              sizes: "72x72",
              type: "image/png",
            },
            {
              src: "/images/icon/96.png",
              sizes: "96x96",
              type: "image/png",
            },
            {
              src: "/images/icon/128.png",
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: "/images/icon/144.png",
              sizes: "144x144",
              type: "image/png",
            },
            {
              src: "/images/icon/192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/images/icon/512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
      viteCompression(),
    ],
    server: {
      port: "3000",
      open: true,
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `@use "./src/style/global.scss" as *;`,
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
        },
      },
    },
  });
