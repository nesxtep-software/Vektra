// Global JSX type declarations for TypeScript language server
// This fixes IDE JSX errors in .tsx files within Astro projects

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
