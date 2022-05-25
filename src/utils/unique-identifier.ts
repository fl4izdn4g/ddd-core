import { v4 as uuidv4 } from 'uuid';

export class UniqueIdentifier {
    public readonly id: string;
    constructor() {
        this.id = uuidv4();
    }

    toString(): string {
        return this.id;
    }
}