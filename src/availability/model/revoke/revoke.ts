import { AccessMap } from './../availability';
export interface Revoke {
    doIt(accesses: AccessMap): AccessMap;
}