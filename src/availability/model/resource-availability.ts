import { Availability } from './availability';
export class ResourceAvailability {
    constructor(public access: Availability, public modify: Availability) {}

}