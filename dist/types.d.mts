
import type { ModuleOptions } from './module.js'


declare module '@nuxt/schema' {
  interface NuxtConfig { ['monacoEditor']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['monacoEditor']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['monacoEditor']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['monacoEditor']?: ModuleOptions }
}


export type { ModuleOptions, MonacoEditorLocale, default } from './module.js'
