export abstract class BaseDomainEntity {
    public readonly id: string;

    protected constructor(id: string) {
        this.id = id;
    }
}

