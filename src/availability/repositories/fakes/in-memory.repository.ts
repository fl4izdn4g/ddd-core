import { AvailabilityType, Availability } from '../../model/availability';
import { Resource } from '../../model/resource';
import { Repository } from './../repository';

export class InMemoryRepository implements Repository {
    private store: {[key: string]: Availability} = {};
    get(resource: Resource): Availability {
        return this.store[resource.checksum()];
    }
    save(availability: Availability): boolean {
        this.store[availability.getResource().checksum()] = availability;
        return true;
    }
}