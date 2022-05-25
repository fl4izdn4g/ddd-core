import { UniqueIdentifier } from '../../utils/unique-identifier';
import { Checksum } from './../../utils/checksum';
import { ObjectChecksum } from './../../utils/object-checksum';

export type ResourceType = "document" | "field" | "action" | "comment" | "correction"; // TODO: wymaga przemyślenia

export class Resource implements Checksum {
    private objectChecksum: ObjectChecksum;
    constructor(public id: UniqueIdentifier, public type: ResourceType) {
        this.objectChecksum = new ObjectChecksum(this);
    }

    checksum(): string {
        return this.objectChecksum.get();
    }
}