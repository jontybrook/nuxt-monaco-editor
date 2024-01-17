import { useState } from "#imports";
export const _useMonacoState = () => useState("MonacoEditorNamespace", () => null);
export const useMonaco = () => _useMonacoState().value;
