/**
 * Base for domain exceptions. Domain layer only.
 * No HTTP, no framework. Expresses business rule / invariant violation.
 */
export abstract class DomainException extends Error {
    abstract readonly code: string;
    readonly context?: Record<string, unknown>;

    constructor(message: string, context?: Record<string, unknown>) {
        super(message);
        this.name = this.constructor.name;
        this.context = context;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
