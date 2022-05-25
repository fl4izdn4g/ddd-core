import { Availability } from './../../model/availability';
import { StoreTransformer } from '../../../utils/infrastructure/store-transformer';

export class AvailabilityTransformer implements StoreTransformer {
    toStore<Availability, AvailabilityStore>(obj: Availability): AvailabilityStore {
        throw new Error('Method not implemented.');
    }
    fromStore<AvailabilityStore, Availability>(obj: AvailabilityStore): Availability {
        throw new Error('Method not implemented.');
    }

}