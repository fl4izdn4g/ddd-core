import { AvailabilityType } from './../model/availability';

export enum ResourceType {
    DOCUMENT = 'document',
    COMMENT = 'comment',
}

export interface AvailabilityStore {
    id: string;
    type: AvailabilityType;
    resource: {
    id: string;
    type: ResourceType
    }
}