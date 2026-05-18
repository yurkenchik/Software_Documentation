declare module 'hbs' {
    interface HbsEngine {
        registerPartials(directory: string, options?: unknown, done?: (err?: Error) => void): void;
        registerHelper(name: string, fn: (...args: unknown[]) => unknown): void;
    }

    const hbs: HbsEngine;
    export default hbs;
}
