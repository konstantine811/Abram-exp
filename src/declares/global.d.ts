// global.d.ts
export {};

declare global {
  interface Window {
    tb: Threebox; // Replace `any` with the specific type of `tb` if you know it
  }
}
