import { createHash, createHmac } from 'crypto';

export class ObjectChecksum {
  private checksum: string;
  constructor(obj: any) {
    this.checksum = createHash('sha256').update(JSON.stringify(obj), 'utf8').digest('hex');
  }

  get(): string {
    return this.checksum;
  }
}
