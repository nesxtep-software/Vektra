/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.jsx' {
  const value: any;
  export default value;
}

declare module '*.js' {
  const value: any;
  export default value;
}
