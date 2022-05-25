import { expect } from 'chai';
import { UniqueIdentifier } from '../../src/utils/unique-identifier';
import { Resource } from './../../src/availability/model/resource';
import { InMemoryRepository } from './../../src/availability/repositories/fakes/in-memory.repository';
import { AvailabilityService } from './../../src/availability/services/availability.service';
describe("Testowanie zachowania availability service", () => {
    it("rejestruję zasób --- TODO: inne sprawdzenie zasobu", () => {
        const readRepository = new InMemoryRepository();
        const modifyRepository = new InMemoryRepository();
        const availabityService = new AvailabilityService(readRepository, modifyRepository);
        const resource = new Resource(new UniqueIdentifier(),'document');

        availabityService.register(resource);

        const resourceAvailability = availabityService.get(resource);
        
        expect(resourceAvailability.access).not.be.undefined;
        expect(resourceAvailability.modify).not.be.undefined;
    });
});