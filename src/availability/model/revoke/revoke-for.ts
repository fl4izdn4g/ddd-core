import cloneDeep from 'lodash/cloneDeep';
import { UniqueIdentifier } from './../../../utils/unique-identifier';
import { AccessMap } from './../availability';
import { Revoke } from './revoke';

export class RevokeFor implements Revoke {
    constructor(private userId: UniqueIdentifier) {}
    doIt(accesses: AccessMap): AccessMap {
        const acc = cloneDeep(accesses);
        delete acc[this.userId.id];
        return acc;
    }
}