import cloneDeep from 'lodash/cloneDeep';
import { UniqueIdentifier } from './../../../utils/unique-identifier';
import { AccessMap } from './../availability';
import { Revoke } from './revoke';

export class RevokeUnless implements Revoke {
    constructor(private userId: UniqueIdentifier) {}
    doIt(accesses: AccessMap): AccessMap {
        const acc = cloneDeep(accesses);
        for(const key of Object.keys(acc)) {
            if(key !== this.userId.id) {
                delete acc[key];
            }
        }
        return acc;
    }
}