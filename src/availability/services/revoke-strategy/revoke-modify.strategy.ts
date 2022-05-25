import { RevokeAll } from './../../model/revoke/revoke-all';
import { Availability } from '../../model/availability';
import { RevokeStrategy } from './revoke.strategy';
export class RevokeModifyStrategy implements RevokeStrategy {
    doIt(read: Availability, modify: Availability): Availability[] {
        modify.revoke(new RevokeAll());
        return [read, modify];
    }
}