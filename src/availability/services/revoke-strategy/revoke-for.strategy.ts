import { RevokeFor } from './../../model/revoke/revoke-for';
import { Availability } from '../../model/availability';
import { UniqueIdentifier } from './../../../utils/unique-identifier';
import { RevokeStrategy } from './revoke.strategy';
export class RevokeForStrategy implements RevokeStrategy {
    constructor(private userId: UniqueIdentifier) {}
    doIt(read: Availability, modify: Availability): Availability[] {
        read.revoke(new RevokeFor(this.userId));
        modify.revoke(new RevokeFor(this.userId));
        return [read, modify];
    }
}