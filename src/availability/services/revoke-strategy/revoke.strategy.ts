import { Availability } from '../../model/availability';

export interface RevokeStrategy {
    doIt(read: Availability, modify: Availability): Availability[];
}