import { fileURLToPath } from 'node:url';
import { createResolver, defineNuxtModule, addVitePlugin, addPlugin, addComponent, addImports } from '@nuxt/kit';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fs from 'fs/promises';
import { createRequire } from 'node:module';



// -- Unbuild CommonJS Shims --
import __cjs_url__ from 'url';
import __cjs_path__ from 'path';
import __cjs_mod__ from 'module';
const __filename = __cjs_url__.fileURLToPath(import.meta.url);
const __dirname = __cjs_path__.dirname(__filename);
const require = __cjs_mod__.createRequire(import.meta.url);
const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
const { resolve } = createResolver(runtimeDir);
const rewrittenMonacoFiles = /* @__PURE__ */ new Map();
const nlsPath = resolve("nls.mjs");
const { resolve: resolveModule } = createRequire(import.meta.url);
const plugin = (options, nuxtOptions) => ({
  name: "vite-plugin-nuxt-monaco-editor",
  enforce: "pre",
  resolveId(src) {
    if (src.includes("monaco-editor/esm/vs/") && src.endsWith(".js?worker")) {
      return resolveModule(
        src.replace("?worker", "").replace("__skip_vite", "").replace("node_modules", "").replace(nuxtOptions.app.baseURL, "/").replace(/\/\/+/g, "/").replace(/^\//, "")
      );
    }
  },
  async load(id) {
    if (options.locale !== "en") {
      id = id.split("?")[0];
      if (rewrittenMonacoFiles.has(id)) {
        return { code: rewrittenMonacoFiles.get(id) };
      }
      if (/\/(vscode-)?nls\.m?js/.test(id)) {
        const code = (await fs.readFile(resolve("nls.mjs"), "utf-8")).replace("__LOCALE_DATA_PATH__", `monaco-editor-nls/locale/${options.locale}.json`);
        rewrittenMonacoFiles.set(id, code);
        return { code };
      }
      if (/monaco-editor\/esm\/vs.+\.js/.test(id)) {
        const vsPath = id.split(/monaco-editor\/esm\//).pop();
        if (vsPath) {
          const path = vsPath.replace(".js", "");
          const code = (await fs.readFile(id, "utf-8")).replace(/import \* as nls from '.+nls\.js(\?v=.+)?';/g, `import * as nls from '${nlsPath}';`).replace(/(?<!function )localize\(/g, `localize('${path}', `);
          rewrittenMonacoFiles.set(id, code);
          return { code };
        }
      }
    }
  }
});

const DEFAULTS = {
  locale: "en",
  componentName: {
    codeEditor: "MonacoEditor",
    diffEditor: "MonacoDiffEditor"
  }
};
const module = defineNuxtModule({
  meta: {
    name: "nuxt-monaco-editor",
    configKey: "monacoEditor",
    compatibility: { nuxt: "^3.1.0" }
  },
  defaults: DEFAULTS,
  setup(options, nuxt) {
    const isDev = nuxt.options.dev;
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
    const { resolve } = createResolver(runtimeDir);
    nuxt.options.build.transpile.push(runtimeDir);
    nuxt.options.build.transpile.push(({ isClient }) => isClient ? "monaco-editor" : false);
    addVitePlugin(plugin(options, nuxt.options));
    addVitePlugin(viteStaticCopy({
      targets: [{
        src: require.resolve("monaco-editor/esm/metadata.js").replace(/\\/g, "/").replace(/\/metadata.js$/, "/*"),
        dest: "_nuxt/nuxt-monaco-editor"
      }]
    }));
    nuxt.hook("build:manifest", (manifest) => {
      Object.entries(manifest).forEach(([key, entry]) => {
        if (key.includes("node_modules/monaco-editor/esm/vs")) {
          entry.isEntry = false;
        }
      });
    });
    addPlugin(isDev ? resolve("plugin-dev.client") : resolve("plugin-prod.client"));
    addComponent({ name: options.componentName.codeEditor, filePath: resolve("MonacoEditor.client.vue") });
    addComponent({ name: options.componentName.diffEditor, filePath: resolve("MonacoDiffEditor.client.vue") });
    addImports({ name: "useMonaco", as: "useMonaco", from: resolve("composables") });
  }
});

export { module as default };
