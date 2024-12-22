// vite.config.ts
import path2 from "node:path";
import process2 from "node:process";
import { loadEnv as loadEnv2 } from "file:///E:/VUE/zeng/hashfinace/node_modules/vite/dist/node/index.js";
import viewport from "file:///E:/VUE/zeng/hashfinace/node_modules/postcss-mobile-forever/index.js";
import autoprefixer from "file:///E:/VUE/zeng/hashfinace/node_modules/autoprefixer/lib/autoprefixer.js";

// build/vite/index.ts
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { unheadVueComposablesImports } from "file:///E:/VUE/zeng/hashfinace/node_modules/@unhead/vue/dist/index.mjs";
import legacy from "file:///E:/VUE/zeng/hashfinace/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import vue from "file:///E:/VUE/zeng/hashfinace/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import UnoCSS from "file:///E:/VUE/zeng/hashfinace/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///E:/VUE/zeng/hashfinace/node_modules/unplugin-auto-import/dist/vite.js";
import { VantResolver } from "file:///E:/VUE/zeng/hashfinace/node_modules/@vant/auto-import-resolver/dist/index.esm.mjs";
import Components from "file:///E:/VUE/zeng/hashfinace/node_modules/unplugin-vue-components/dist/vite.js";
import { VueRouterAutoImports } from "file:///E:/VUE/zeng/hashfinace/node_modules/unplugin-vue-router/dist/index.js";
import VueRouter from "file:///E:/VUE/zeng/hashfinace/node_modules/unplugin-vue-router/dist/vite.js";
import mockDevServerPlugin from "file:///E:/VUE/zeng/hashfinace/node_modules/vite-plugin-mock-dev-server/dist/index.js";
import { VitePWA } from "file:///E:/VUE/zeng/hashfinace/node_modules/vite-plugin-pwa/dist/index.js";
import Sitemap from "file:///E:/VUE/zeng/hashfinace/node_modules/vite-plugin-sitemap/dist/index.js";
import VueI18nPlugin from "file:///E:/VUE/zeng/hashfinace/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";

// build/vite/vconsole.ts
import path from "node:path";
import { viteVConsole } from "file:///E:/VUE/zeng/hashfinace/node_modules/vite-plugin-vconsole/dist/main.mjs";
function createViteVConsole() {
  return viteVConsole({
    entry: [path.resolve("src/main.ts")],
    enabled: false,
    config: {
      maxLogNumber: 1e3,
      theme: "light"
    },
    // https://github.com/vadxq/vite-plugin-vconsole/issues/21
    dynamicConfig: {
      theme: `document.documentElement.classList.contains('dark') ? 'dark' : 'light'`
    },
    eventListener: `
      const targetElement = document.querySelector('html'); // \u62E9\u8981\u76D1\u542C\u7684\u5143\u7D20
      const observerOptions = {
        attributes: true, // \u76D1\u542C\u5C5E\u6027\u53D8\u5316
        attributeFilter: ['class'] // \u53EA\u76D1\u542Cclass\u5C5E\u6027\u53D8\u5316
      };

      // \u5B9A\u4E49\u56DE\u8C03\u51FD\u6570\u6765\u5904\u7406\u89C2\u5BDF\u5230\u7684\u53D8\u5316
      function handleAttributeChange(mutationsList) {
        for(let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (window && window.vConsole) {
              window.vConsole.dynamicChange.value = new Date().getTime();
            }
          }
        }
      }

      // \u521B\u5EFA\u89C2\u5BDF\u8005\u5B9E\u4F8B\u5E76\u4F20\u5165\u56DE\u8C03\u51FD\u6570
      const observer = new MutationObserver(handleAttributeChange);

      // \u5F00\u59CB\u89C2\u5BDF\u76EE\u6807\u5143\u7D20
      observer.observe(targetElement, observerOptions);

      // \u5F53\u4E0D\u518D\u9700\u8981\u89C2\u5BDF\u65F6\uFF0C\u505C\u6B62\u89C2\u5BDF
      // observer.disconnect();
    `
  });
}

// build/vite/index.ts
import { loadEnv } from "file:///E:/VUE/zeng/hashfinace/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///E:/VUE/zeng/hashfinace/build/vite/index.ts";
function createVitePlugins(mode) {
  const env = loadEnv(mode, process.cwd());
  return [
    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: [".vue"],
      routesFolder: "src/pages",
      dts: "src/types/typed-router.d.ts"
    }),
    vue(),
    // https://github.com/jbaubree/vite-plugin-sitemap
    Sitemap({
      outDir: env.VITE_APP_OUT_DIR || "dist"
    }),
    // https://github.com/pengzhanbo/vite-plugin-mock-dev-server
    mockDevServerPlugin(),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ["vue"],
      resolvers: [VantResolver()],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: "src/types/components.d.ts"
    }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        "vue",
        "vitest",
        "@vueuse/core",
        VueRouterAutoImports,
        {
          "vue-router/auto": ["useLink"],
          "@/utils/i18n": ["i18n", "locale"],
          "vue-i18n": ["useI18n"]
        },
        unheadVueComposablesImports
      ],
      dts: "src/types/auto-imports.d.ts",
      dirs: ["src/composables"],
      resolvers: [VantResolver()]
    }),
    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18nPlugin({
      // locale messages resource pre-compile option
      include: resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "../../src/locales/**")
    }),
    legacy({
      targets: ["defaults", "not IE 11"],
      renderLegacyChunks: false
    }),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
    // https://github.com/vadxq/vite-plugin-vconsole
    createViteVConsole(),
    // https://github.com/vuejs/devtools-next
    // VueDevTools(),
    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "safari-pinned-tab.svg"],
      manifest: {
        name: "pinkMine",
        short_name: "pinkMine",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ];
}

// build/vite/optimize.ts
var include = [
  "axios",
  "echarts",
  "lodash-es",
  "resize-detector",
  "vant/es/cell-group/style/index",
  "vant/es/popup/style/index",
  "vant/es/picker/style/index",
  "vant/es/cell/style/index",
  "vant/es/switch/style/index",
  "vant/es/space/style/index",
  "vant/es/button/style/index",
  "vant/es/empty/style/index",
  "vant/es/icon/style/index",
  "vant/es/stepper/style/index",
  "vant/es/image/style/index",
  "vant/es/form/style/index",
  "vant/es/field/style/index",
  "vant/es/notify/style/index"
];
var exclude = [
  "@iconify-json/carbon"
];

// vite.config.ts
var __vite_injected_original_dirname = "E:\\VUE\\zeng\\hashfinace";
var vite_config_default = ({ mode }) => {
  const root = process2.cwd();
  const env = loadEnv2(mode, root);
  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: createVitePlugins(mode),
    server: {
      host: true,
      port: 3e3,
      proxy: {
        "/api": {
          target: "",
          ws: false,
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        "~@": path2.join(__vite_injected_original_dirname, "./src"),
        "@": path2.join(__vite_injected_original_dirname, "./src"),
        "~": path2.join(__vite_injected_original_dirname, "./src/assets"),
        "~root": path2.join(__vite_injected_original_dirname, ".")
        // 'ethers': 'ethers/dist/ethers.cjs.js',
      }
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          // https://github.com/wswmsword/postcss-mobile-forever
          viewport({
            appSelector: "#app",
            viewportWidth: 375,
            maxDisplayWidth: 600,
            rootContainingBlockSelectorList: ["van-tabbar", "van-popup"],
            border: true
          })
        ]
      }
    },
    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
      outDir: env.VITE_APP_OUT_DIR || "dist",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          }
        }
      },
      // target: ['chrome64', 'edge79', 'es2020', 'firefox67', 'safari12', 'esnext'],
      target: ["esnext"]
    },
    optimizeDeps: {
      include,
      exclude,
      esbuildOptions: {
        target: "esnext",
        define: {
          global: "globalThis"
        },
        supported: {
          bigint: true
        }
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvdml0ZS9pbmRleC50cyIsICJidWlsZC92aXRlL3Zjb25zb2xlLnRzIiwgImJ1aWxkL3ZpdGUvb3B0aW1pemUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxWVUVcXFxcemVuZ1xcXFxoYXNoZmluYWNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxWVUVcXFxcemVuZ1xcXFxoYXNoZmluYWNlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9WVUUvemVuZy9oYXNoZmluYWNlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2Vzcyc7XG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdHlwZSB7IENvbmZpZ0VudiwgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJ3Bvc3Rjc3MtbW9iaWxlLWZvcmV2ZXInO1xuaW1wb3J0IGF1dG9wcmVmaXhlciBmcm9tICdhdXRvcHJlZml4ZXInO1xuaW1wb3J0IHsgY3JlYXRlVml0ZVBsdWdpbnMgfSBmcm9tICcuL2J1aWxkL3ZpdGUnO1xuaW1wb3J0IHsgZXhjbHVkZSwgaW5jbHVkZSB9IGZyb20gJy4vYnVpbGQvdml0ZS9vcHRpbWl6ZSc7XG5cbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfTogQ29uZmlnRW52KTogVXNlckNvbmZpZyA9PiB7XG4gIGNvbnN0IHJvb3QgPSBwcm9jZXNzLmN3ZCgpO1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHJvb3QpO1xuXG4gIHJldHVybiB7XG4gICAgYmFzZTogZW52LlZJVEVfQVBQX1BVQkxJQ19QQVRILFxuICAgIHBsdWdpbnM6IGNyZWF0ZVZpdGVQbHVnaW5zKG1vZGUpLFxuXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiB0cnVlLFxuICAgICAgcG9ydDogMzAwMCxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJycsXG4gICAgICAgICAgd3M6IGZhbHNlLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICd+QCc6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgICAnQCc6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgICAnfic6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NyYy9hc3NldHMnKSxcbiAgICAgICAgJ35yb290JzogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4nKSxcbiAgICAgICAgLy8gJ2V0aGVycyc6ICdldGhlcnMvZGlzdC9ldGhlcnMuY2pzLmpzJyxcbiAgICAgIH0sXG4gICAgfSxcblxuICAgIGNzczoge1xuICAgICAgcG9zdGNzczoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgYXV0b3ByZWZpeGVyKCksXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dzd21zd29yZC9wb3N0Y3NzLW1vYmlsZS1mb3JldmVyXG4gICAgICAgICAgdmlld3BvcnQoe1xuICAgICAgICAgICAgYXBwU2VsZWN0b3I6ICcjYXBwJyxcbiAgICAgICAgICAgIHZpZXdwb3J0V2lkdGg6IDM3NSxcbiAgICAgICAgICAgIG1heERpc3BsYXlXaWR0aDogNjAwLFxuICAgICAgICAgICAgcm9vdENvbnRhaW5pbmdCbG9ja1NlbGVjdG9yTGlzdDogWyd2YW4tdGFiYmFyJywgJ3Zhbi1wb3B1cCddLFxuICAgICAgICAgICAgYm9yZGVyOiB0cnVlLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgYnVpbGQ6IHtcbiAgICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwNDgsXG4gICAgICBvdXREaXI6IGVudi5WSVRFX0FQUF9PVVRfRElSIHx8ICdkaXN0JyxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gdGFyZ2V0OiBbJ2Nocm9tZTY0JywgJ2VkZ2U3OScsICdlczIwMjAnLCAnZmlyZWZveDY3JywgJ3NhZmFyaTEyJywgJ2VzbmV4dCddLFxuICAgICAgdGFyZ2V0OiBbJ2VzbmV4dCddLFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlLFxuICAgICAgZXhjbHVkZSxcbiAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgICAgIGRlZmluZToge1xuICAgICAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICAgICAgICB9LFxuICAgICAgICBzdXBwb3J0ZWQ6IHtcbiAgICAgICAgICBiaWdpbnQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxWVUVcXFxcemVuZ1xcXFxoYXNoZmluYWNlXFxcXGJ1aWxkXFxcXHZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFZVRVxcXFx6ZW5nXFxcXGhhc2hmaW5hY2VcXFxcYnVpbGRcXFxcdml0ZVxcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovVlVFL3plbmcvaGFzaGZpbmFjZS9idWlsZC92aXRlL2luZGV4LnRzXCI7aW1wb3J0IHsgZGlybmFtZSwgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHByb2Nlc3MgZnJvbSAnbm9kZTpwcm9jZXNzJztcbmltcG9ydCB7IHVuaGVhZFZ1ZUNvbXBvc2FibGVzSW1wb3J0cyB9IGZyb20gJ0B1bmhlYWQvdnVlJztcbmltcG9ydCBsZWdhY3kgZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5JztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSc7XG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tICdAdmFudC9hdXRvLWltcG9ydC1yZXNvbHZlcic7XG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJztcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcic7XG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZSc7XG5pbXBvcnQgbW9ja0RldlNlcnZlclBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1tb2NrLWRldi1zZXJ2ZXInO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5pbXBvcnQgU2l0ZW1hcCBmcm9tICd2aXRlLXBsdWdpbi1zaXRlbWFwJztcbi8vIGltcG9ydCBWdWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5pbXBvcnQgVnVlSTE4blBsdWdpbiBmcm9tICdAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlJztcbmltcG9ydCB7IGNyZWF0ZVZpdGVWQ29uc29sZSB9IGZyb20gJy4vdmNvbnNvbGUnO1xuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVml0ZVBsdWdpbnMobW9kZTogc3RyaW5nKSB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSk7XG5cbiAgcmV0dXJuIFtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9zdmEvdW5wbHVnaW4tdnVlLXJvdXRlclxuICAgIFZ1ZVJvdXRlcih7XG4gICAgICBleHRlbnNpb25zOiBbJy52dWUnXSxcbiAgICAgIHJvdXRlc0ZvbGRlcjogJ3NyYy9wYWdlcycsXG4gICAgICBkdHM6ICdzcmMvdHlwZXMvdHlwZWQtcm91dGVyLmQudHMnLFxuICAgIH0pLFxuXG4gICAgdnVlKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vamJhdWJyZWUvdml0ZS1wbHVnaW4tc2l0ZW1hcFxuICAgIFNpdGVtYXAoe1xuICAgICAgb3V0RGlyOiBlbnYuVklURV9BUFBfT1VUX0RJUiB8fCAnZGlzdCcsXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcGVuZ3poYW5iby92aXRlLXBsdWdpbi1tb2NrLWRldi1zZXJ2ZXJcbiAgICBtb2NrRGV2U2VydmVyUGx1Z2luKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJ10sXG4gICAgICByZXNvbHZlcnM6IFtWYW50UmVzb2x2ZXIoKV0sXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlL10sXG4gICAgICBkdHM6ICdzcmMvdHlwZXMvY29tcG9uZW50cy5kLnRzJyxcbiAgICB9KSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW5jbHVkZTogWy9cXC5bdGpdc3g/JC8sIC9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS9dLFxuICAgICAgaW1wb3J0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3ZpdGVzdCcsXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxuICAgICAgICBWdWVSb3V0ZXJBdXRvSW1wb3J0cyxcbiAgICAgICAge1xuICAgICAgICAgICd2dWUtcm91dGVyL2F1dG8nOiBbJ3VzZUxpbmsnXSxcbiAgICAgICAgICAnQC91dGlscy9pMThuJzogWydpMThuJywgJ2xvY2FsZSddLFxuICAgICAgICAgICd2dWUtaTE4bic6IFsndXNlSTE4biddLFxuICAgICAgICB9LFxuICAgICAgICB1bmhlYWRWdWVDb21wb3NhYmxlc0ltcG9ydHMsXG4gICAgICBdLFxuICAgICAgZHRzOiAnc3JjL3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJyxcbiAgICAgIGRpcnM6IFsnc3JjL2NvbXBvc2FibGVzJ10sXG4gICAgICByZXNvbHZlcnM6IFtWYW50UmVzb2x2ZXIoKV0sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaW50bGlmeS9idW5kbGUtdG9vbHMvdHJlZS9tYWluL3BhY2thZ2VzL3VucGx1Z2luLXZ1ZS1pMThuXG4gICAgVnVlSTE4blBsdWdpbih7XG4gICAgICAvLyBsb2NhbGUgbWVzc2FnZXMgcmVzb3VyY2UgcHJlLWNvbXBpbGUgb3B0aW9uXG4gICAgICBpbmNsdWRlOiByZXNvbHZlKGRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKSwgJy4uLy4uL3NyYy9sb2NhbGVzLyoqJyksXG4gICAgfSksXG5cbiAgICBsZWdhY3koe1xuICAgICAgdGFyZ2V0czogWydkZWZhdWx0cycsICdub3QgSUUgMTEnXSxcbiAgICAgIHJlbmRlckxlZ2FjeUNodW5rczogZmFsc2UsXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5vY3NzXG4gICAgLy8gc2VlIHVuby5jb25maWcudHMgZm9yIGNvbmZpZ1xuICAgIFVub0NTUygpLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZhZHhxL3ZpdGUtcGx1Z2luLXZjb25zb2xlXG4gICAgY3JlYXRlVml0ZVZDb25zb2xlKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvZGV2dG9vbHMtbmV4dFxuICAgIC8vIFZ1ZURldlRvb2xzKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tcHdhXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnZmF2aWNvbi5zdmcnLCAnc2FmYXJpLXBpbm5lZC10YWIuc3ZnJ10sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiAncGlua01pbmUnLFxuICAgICAgICBzaG9ydF9uYW1lOiAncGlua01pbmUnLFxuICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9wd2EtMTkyeDE5Mi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL3B3YS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvcHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIHB1cnBvc2U6ICdhbnkgbWFza2FibGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pLFxuICBdO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxWVUVcXFxcemVuZ1xcXFxoYXNoZmluYWNlXFxcXGJ1aWxkXFxcXHZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFZVRVxcXFx6ZW5nXFxcXGhhc2hmaW5hY2VcXFxcYnVpbGRcXFxcdml0ZVxcXFx2Y29uc29sZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovVlVFL3plbmcvaGFzaGZpbmFjZS9idWlsZC92aXRlL3Zjb25zb2xlLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xyXG5pbXBvcnQgeyB2aXRlVkNvbnNvbGUgfSBmcm9tICd2aXRlLXBsdWdpbi12Y29uc29sZSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXRlVkNvbnNvbGUoKSB7XHJcbiAgcmV0dXJuIHZpdGVWQ29uc29sZSh7XHJcbiAgICBlbnRyeTogW3BhdGgucmVzb2x2ZSgnc3JjL21haW4udHMnKV0sXHJcbiAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgIGNvbmZpZzoge1xyXG4gICAgICBtYXhMb2dOdW1iZXI6IDEwMDAsXHJcbiAgICAgIHRoZW1lOiAnbGlnaHQnLFxyXG4gICAgfSxcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92YWR4cS92aXRlLXBsdWdpbi12Y29uc29sZS9pc3N1ZXMvMjFcclxuICAgIGR5bmFtaWNDb25maWc6IHtcclxuICAgICAgdGhlbWU6IGBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkYXJrJykgPyAnZGFyaycgOiAnbGlnaHQnYCxcclxuICAgIH0sXHJcbiAgICBldmVudExpc3RlbmVyOiBgXHJcbiAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJyk7IC8vIFx1NjJFOVx1ODk4MVx1NzZEMVx1NTQyQ1x1NzY4NFx1NTE0M1x1N0QyMFxyXG4gICAgICBjb25zdCBvYnNlcnZlck9wdGlvbnMgPSB7XHJcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZSwgLy8gXHU3NkQxXHU1NDJDXHU1QzVFXHU2MDI3XHU1M0Q4XHU1MzE2XHJcbiAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ2NsYXNzJ10gLy8gXHU1M0VBXHU3NkQxXHU1NDJDY2xhc3NcdTVDNUVcdTYwMjdcdTUzRDhcdTUzMTZcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIFx1NUI5QVx1NEU0OVx1NTZERVx1OEMwM1x1NTFGRFx1NjU3MFx1Njc2NVx1NTkwNFx1NzQwNlx1ODlDMlx1NUJERlx1NTIzMFx1NzY4NFx1NTNEOFx1NTMxNlxyXG4gICAgICBmdW5jdGlvbiBoYW5kbGVBdHRyaWJ1dGVDaGFuZ2UobXV0YXRpb25zTGlzdCkge1xyXG4gICAgICAgIGZvcihsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zTGlzdCkge1xyXG4gICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdhdHRyaWJ1dGVzJyAmJiBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSAnY2xhc3MnKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cgJiYgd2luZG93LnZDb25zb2xlKSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LnZDb25zb2xlLmR5bmFtaWNDaGFuZ2UudmFsdWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gXHU1MjFCXHU1RUZBXHU4OUMyXHU1QkRGXHU4MDA1XHU1QjlFXHU0RjhCXHU1RTc2XHU0RjIwXHU1MTY1XHU1NkRFXHU4QzAzXHU1MUZEXHU2NTcwXHJcbiAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoaGFuZGxlQXR0cmlidXRlQ2hhbmdlKTtcclxuXHJcbiAgICAgIC8vIFx1NUYwMFx1NTlDQlx1ODlDMlx1NUJERlx1NzZFRVx1NjgwN1x1NTE0M1x1N0QyMFxyXG4gICAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldEVsZW1lbnQsIG9ic2VydmVyT3B0aW9ucyk7XHJcblxyXG4gICAgICAvLyBcdTVGNTNcdTRFMERcdTUxOERcdTk3MDBcdTg5ODFcdTg5QzJcdTVCREZcdTY1RjZcdUZGMENcdTUwNUNcdTZCNjJcdTg5QzJcdTVCREZcclxuICAgICAgLy8gb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgYCxcclxuICB9KVxyXG59XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcVlVFXFxcXHplbmdcXFxcaGFzaGZpbmFjZVxcXFxidWlsZFxcXFx2aXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxWVUVcXFxcemVuZ1xcXFxoYXNoZmluYWNlXFxcXGJ1aWxkXFxcXHZpdGVcXFxcb3B0aW1pemUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1ZVRS96ZW5nL2hhc2hmaW5hY2UvYnVpbGQvdml0ZS9vcHRpbWl6ZS50c1wiO2NvbnN0IGluY2x1ZGUgPSBbXG4gICdheGlvcycsXG4gICdlY2hhcnRzJyxcbiAgJ2xvZGFzaC1lcycsXG4gICdyZXNpemUtZGV0ZWN0b3InLFxuICAndmFudC9lcy9jZWxsLWdyb3VwL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvcG9wdXAvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9waWNrZXIvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9jZWxsL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvc3dpdGNoL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvc3BhY2Uvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9idXR0b24vc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9lbXB0eS9zdHlsZS9pbmRleCcsXG4gICd2YW50L2VzL2ljb24vc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9zdGVwcGVyL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvaW1hZ2Uvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9mb3JtL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvZmllbGQvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9ub3RpZnkvc3R5bGUvaW5kZXgnLFxuXVxuXG5jb25zdCBleGNsdWRlID0gW1xuICAnQGljb25pZnktanNvbi9jYXJib24nLFxuXVxuXG5leHBvcnQgeyBpbmNsdWRlLCBleGNsdWRlIH1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFAsT0FBT0EsV0FBVTtBQUM3USxPQUFPQyxjQUFhO0FBQ3BCLFNBQVMsV0FBQUMsZ0JBQWU7QUFFeEIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sa0JBQWtCOzs7QUNMNFAsU0FBUyxTQUFTLGVBQWU7QUFDdFQsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsbUNBQW1DO0FBQzVDLE9BQU8sWUFBWTtBQUNuQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsb0JBQW9CO0FB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O0FBQUEsTUFDSCxTQUFTO0FBQUEsUUFDUCxTQUFTO0FBQUEsVUFDUCxhQUFhO0FBQUE7QUFBQSxVQUViLFNBQVM7QUFBQSxZQUNQLGFBQWE7QUFBQSxZQUNiLGVBQWU7QUFBQSxZQUNmLGlCQUFpQjtBQUFBLFlBQ2pCLGlDQUFpQyxDQUFDLGNBQWMsV0FBVztBQUFBLFlBQzNELFFBQVE7QUFBQSxVQUNWLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVBLE9BQU87QUFBQSxNQUNMLGNBQWM7QUFBQSxNQUNkLHVCQUF1QjtBQUFBLE1BQ3ZCLFFBQVEsSUFBSSxvQkFBb0I7QUFBQSxNQUNoQyxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixhQUFhLElBQUk7QUFDZixnQkFBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLHFCQUFPLEdBQUcsU0FBUyxFQUFFLE1BQU0sZUFBZSxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsU0FBUztBQUFBLFlBQ3hFO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLFFBQVEsQ0FBQyxRQUFRO0FBQUEsSUFDbkI7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLE1BQ0EsZ0JBQWdCO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0EsV0FBVztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFsicGF0aCIsICJwcm9jZXNzIiwgImxvYWRFbnYiLCAicHJvY2VzcyIsICJsb2FkRW52IiwgInBhdGgiXQp9Cg==
