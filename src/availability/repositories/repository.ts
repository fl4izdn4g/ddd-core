import { Availability } from '../model/availability';
import { Resource } from '../model/resource';

export interface Repository {
    get(resource: Resource): Availability;
    save(availability: Availability): boolean;
}