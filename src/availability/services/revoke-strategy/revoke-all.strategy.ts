import { RevokeAll } from './../../model/revoke/revoke-all';
import { Availability } from '../../model/availability';
import { RevokeStrategy } from './revoke.strategy';
export class RevokeAllStrategy implements RevokeStrategy {
    doIt(read: Availability, modify: Availability): Availability[] {
        read.revoke(new RevokeAll());
        modify.revoke(new RevokeAll());

        return [read, modify];
    }
}