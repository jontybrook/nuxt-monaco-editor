import type * as Monaco from 'monaco-editor';
export declare const _useMonacoState: () => any;
/**
 * Get `monaco` namespace
 * @returns `monaco` namespace: if unavailable (server-side), returns `null`
 */
export declare const useMonaco: () => typeof Monaco | null;
