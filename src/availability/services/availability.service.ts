import { ResourceAvailability } from './../model/resource-availability';
import { Resource } from './../model/resource';
import { RevokeStrategy } from "./revoke-strategy/revoke.strategy";
import { Repository } from "./../repositories/repository";
import { Availability } from "../model/availability";
import { Access } from "../model/access/access";
import { UniqueIdentifier } from "../../utils/unique-identifier";

export class AvailabilityService {
  constructor(
    private accessRepository: Repository,
    private modifyRepository: Repository
  ) {}

  register(resource: Resource): void {
    const accessAvailability = new Availability(
      new UniqueIdentifier(),
      resource,
      1
    );
    const modifyAvailability = new Availability(
      new UniqueIdentifier(),
      resource,
      1
    );

    this.accessRepository.save(accessAvailability);
    this.modifyRepository.save(modifyAvailability);
  }

  grant(resource: Resource, userId: UniqueIdentifier, access: Access[], modify: Access[]): ResourceAvailability {
    const accessAvailability = this.accessRepository.get(resource);
    const modifyAvailability = this.modifyRepository.get(resource);
    if (access.length > 0) {
      for (const a of access) {
        accessAvailability.grant(userId, a);
      }

      this.accessRepository.save(accessAvailability);
    }

    if (modify.length > 0) {
      for (const m of modify) {
        modifyAvailability.grant(userId, m);
      }

      this.modifyRepository.save(modifyAvailability);
    }

    return new ResourceAvailability(accessAvailability, modifyAvailability);
  }

  revoke(resource: Resource, revokeStrategy: RevokeStrategy): void {
    let readAvailability = this.accessRepository.get(resource);
    let modifiAvailability = this.modifyRepository.get(resource);

    // to jest troche szemrane bo zmieniamy przez strategię i teraz czy referencja czy lepiej iść w immutability
    [readAvailability, modifiAvailability] = revokeStrategy.doIt(
      readAvailability,
      modifiAvailability
    );

    this.accessRepository.save(readAvailability);
    this.modifyRepository.save(modifiAvailability);
  }

  get(resource: Resource): ResourceAvailability {
    const accessAvailability: Availability = this.accessRepository.get(resource);
    const modifyAvailability: Availability = this.modifyRepository.get(resource);
    return new ResourceAvailability(accessAvailability, modifyAvailability);
  }
}
