declare module 'lodash' {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: any
  ): T & { cancel(): void; flush(): void };
}
