import * as _nuxt_schema from '@nuxt/schema';

type MonacoEditorLocale = 'cs' | 'de' | 'es' | 'fr' | 'it' | 'ja' | 'ko' | 'pl' | 'pt-br' | 'qps-ploc' | 'ru' | 'tr' | 'zh-hans' | 'zh-hant' | 'en';
interface ModuleOptions {
    locale?: MonacoEditorLocale;
    componentName?: {
        codeEditor?: string;
        diffEditor?: string;
    };
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { type ModuleOptions, type MonacoEditorLocale, _default as default };
