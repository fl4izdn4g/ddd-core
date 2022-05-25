import { Availability } from '../../model/availability';
import { Access } from '../../model/access/access';
import { RevokeStrategy } from './revoke.strategy';
export class AccessRevokeStrategy implements RevokeStrategy {
    constructor(private access: Access[], private modify: Access[]) {}
    
    doIt(read: Availability, modify: Availability): Availability[] {
        if(this.access.length > 0) {
            for (const a of this.access) {
                read.revoke(a);
            }
        }

        if(this.modify.length > 0) {
            for (const a of this.modify) {
                modify.revoke(a);
            }
        }

        return [read, modify];
    }
}