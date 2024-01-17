import { _useMonacoState } from "./composables.mjs";
import { defineNuxtPlugin } from "#imports";
export default defineNuxtPlugin(async (nuxtApp) => {
  const getWorkerModule = (moduleUrl, label) => {
    return new Worker(new URL(`${nuxtApp.$config.app.baseURL}/_nuxt/nuxt-monaco-editor/vs/${moduleUrl}.js`.replace(/\/\//g, "/"), import.meta.url), {
      name: label,
      type: "module"
    });
  };
  self.MonacoEnvironment = {
    getWorker(workerId, label) {
      switch (label) {
        case "json":
          return getWorkerModule("language/json/json.worker", label);
        case "css":
        case "scss":
        case "less":
          return getWorkerModule("language/css/css.worker", label);
        case "html":
        case "handlebars":
        case "razor":
          return getWorkerModule("language/html/html.worker", label);
        case "typescript":
        case "javascript":
          return getWorkerModule("language/typescript/ts.worker", label);
        default:
          return getWorkerModule("editor/editor.worker", label);
      }
    }
  };
  const monacoState = _useMonacoState();
  monacoState.value = await import("monaco-editor");
});
