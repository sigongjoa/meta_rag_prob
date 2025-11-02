
export {};

declare global {
  interface Window {
    renderMathInElement?: (
      element: HTMLElement,
      options?: {
        delimiters?: { left: string; right: string; display: boolean }[];
        throwOnError?: boolean;
      }
    ) => void;
  }
}
