import { PeriodInterface } from '../../utils/period';
import { UniqueIdentifier } from '../../utils/unique-identifier';
import { Access } from './access/access';
import { Resource } from './resource';
import { Revoke } from './revoke/revoke';

export type AvailabilityType = 'read' | 'write';
export interface AccessMap {
    [key: string]: Access[];
}

export class Availability {
    private accesses: AccessMap;

    constructor(
        private id: UniqueIdentifier,
        private resource: Resource,
        private version: number
    ) {
        this.accesses = {};
    }

    getResource(): Resource {
        return this.resource;
    }

    grant(userId: UniqueIdentifier, accessRule: Access): UniqueIdentifier {
        if (!Object.keys(this.accesses).includes(userId.id)) {
            this.accesses[userId.id] = [accessRule];
            return userId;
        }

        this.accesses[userId.id].push(accessRule);

        return userId;
    }

    revoke(revokeRule: Revoke): boolean {
        this.accesses = revokeRule.doIt(this.accesses);
        return true;
    }

    check(userId: UniqueIdentifier, period: PeriodInterface): boolean {
        if (!Object.keys(this.accesses).includes(userId.id)) {
            return false;
        }

        const accesses = this.accesses[userId.id];
        let canDoIt = true;
        for (const a of accesses) {
            canDoIt = canDoIt && a.can(period);
        }

        return canDoIt;
    }
}
