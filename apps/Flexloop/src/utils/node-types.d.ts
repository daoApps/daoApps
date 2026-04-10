declare module 'node:fs' {
  export function existsSync(path: string): boolean;
  export function mkdirSync(path: string, options: { recursive: boolean }): void;
  export function statSync(path: string): { size: number };
  export function appendFileSync(path: string, data: string, encoding: string): void;
  export function readdirSync(path: string): string[];
  export function renameSync(src: string, dest: string): void;
  export function unlinkSync(path: string): void;
}

declare module 'node:path' {
  export function resolve(...segments: string[]): string;
  export function join(...segments: string[]): string;
}
