import { AccessMap } from './../availability';
import { Revoke } from './revoke';
export class RevokeAll implements Revoke {
    doIt(accesses: AccessMap): AccessMap {
        return {};
    }
}