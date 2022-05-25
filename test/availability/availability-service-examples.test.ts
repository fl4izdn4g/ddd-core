import { RevokeForStrategy } from './../../src/availability/services/revoke-strategy/revoke-for.strategy';
import { RevokeModifyStrategy } from './../../src/availability/services/revoke-strategy/revoke-modify.strategy';
import { expect } from 'chai';
import { TimeAccess } from './../../src/availability/model/access/access';
import { Resource } from './../../src/availability/model/resource';
import { InMemoryRepository } from './../../src/availability/repositories/fakes/in-memory.repository';
import { AvailabilityService } from './../../src/availability/services/availability.service';
import { RevokeAllStrategy } from './../../src/availability/services/revoke-strategy/revoke-all.strategy';
import { InfinitePeriod, OneDayPeriod, Period } from './../../src/utils/period';
import { UniqueIdentifier } from './../../src/utils/unique-identifier';

describe("Testowanie zachowania availability service", () => {
    let availabilityService: AvailabilityService;
    let document: Resource;
    beforeEach(() => {
        const readRepository = new InMemoryRepository();
        const modifyRepository = new InMemoryRepository();
        availabilityService = new AvailabilityService(readRepository, modifyRepository);

        document = new Resource(new UniqueIdentifier(), "document");
        availabilityService.register(document);
    });

    it("tworzę dokument + właściciel", () => {
        const owner = new UniqueIdentifier();
        const from = new Date(2022,5,24);
        const infinityAccess = new TimeAccess(new InfinitePeriod(from));
        const availability = availabilityService.grant(document, owner, [infinityAccess], [infinityAccess]);

        const checkPeriod = new Period(new Date(2022, 5, 30), new Date(2040, 3, 23));
        const aResult = availability.access.check(owner, checkPeriod);
        const mResult = availability.modify.check(owner, checkPeriod);

        expect(aResult && mResult).to.be.true;
    });

    xit("usuwam dokument", () => {
        // tylko informacyjnie jak to zrobić
        availabilityService.revoke(document, new RevokeAllStrategy());
    });

    it("wysyłam zaproszenie do dokumentu opcja read", () => {
        const user = new UniqueIdentifier();
        const period = new Period(new Date(2022,5,20), new Date(2022,5,30));
        const availability = availabilityService.grant(document, user, [new TimeAccess(period)], []);

        const checkPeriod = new OneDayPeriod(new Date(2022,5,25));
        const aResult = availability.access.check(user, checkPeriod);
        const mResult = availability.modify.check(user, checkPeriod);

        expect(aResult).to.be.true;
        expect(mResult).to.be.false;
    });

    it("wysyłam zaproszenie do dokumentu opcja read-write", () => {
        const user = new UniqueIdentifier();
        const period = new Period(new Date(2022,5,20), new Date(2022,5,30));
        const availability = availabilityService.grant(document, user, [new TimeAccess(period)], [new TimeAccess(period)]);

        const checkPeriod = new OneDayPeriod(new Date(2022,5,25));
        const aResult = availability.access.check(user, checkPeriod);
        const mResult = availability.modify.check(user, checkPeriod);

        expect(aResult).to.be.true;
        expect(mResult).to.be.true;
    });

    it("zmieniam właściciela dokumentu", () => {
        const oldOwner = new UniqueIdentifier();
        const newOwner = new UniqueIdentifier();
        const infinityPeriod = new InfinitePeriod(new Date(2022, 5, 23));
        // nic się nie stanie jak najpierw nadamy nowemu użytkownikowi uprawnienia, a potem usuwamy staremu
        availabilityService.grant(document, newOwner, [new TimeAccess(infinityPeriod)], [new TimeAccess(infinityPeriod)]);
        availabilityService.revoke(document, new RevokeForStrategy(oldOwner));
    });

    it("udostępniam CŁ dokument", () => {
        const clUser = new UniqueIdentifier();
        const infinityPeriod = new InfinitePeriod(new Date(2022, 5, 23));
        const availability = availabilityService.grant(document, clUser, [new TimeAccess(infinityPeriod)], []);

        const checkPeriod = new OneDayPeriod(new Date(2022,5,25));
        const aResult = availability.access.check(clUser, checkPeriod);
        const mResult = availability.modify.check(clUser, checkPeriod);

        expect(aResult).to.be.true;
        expect(mResult).to.be.false;
    });

    it("wysyłam CŁ dokument", () => {
        const clUser = new UniqueIdentifier();
        const infinityPeriod = new InfinitePeriod(new Date(2022, 5, 23));
        availabilityService.grant(document, clUser, [new TimeAccess(infinityPeriod)], []);
        availabilityService.revoke(document, new RevokeModifyStrategy());

        const availability = availabilityService.get(document);
        
        const checkPeriod = new OneDayPeriod(new Date(2022,5, 25));
        const aResult = availability.access.check(clUser, checkPeriod);
        const mResult = availability.modify.check(clUser, checkPeriod);
     

        expect(aResult).to.be.true;
        expect(mResult).to.be.false;
    });

    xit("rozpoczynam opiniowanie", () => {
        // tylko informacyjnie jak to zrobić
        availabilityService.revoke(document, new RevokeModifyStrategy());
    });

    it("tworzę komentarz", () => {
        const clUser = new UniqueIdentifier();
        const comment = new Resource(new UniqueIdentifier(), 'comment');
        const infinityPeriod = new InfinitePeriod(new Date(2022, 3, 20));
        availabilityService.register(comment);
        const availability = availabilityService.grant(comment, clUser, [new TimeAccess(infinityPeriod)], [new TimeAccess(infinityPeriod)]);

        const checkPeriod = new OneDayPeriod(new Date(2022, 5,22));
        const aResult = availability.access.check(clUser, checkPeriod);
        const mResult = availability.modify.check(clUser, checkPeriod);

        expect(aResult).to.be.true;
        expect(mResult).to.be.true;
    });

    it("udostępniam komentarz", () => {
        const comment = new Resource(new UniqueIdentifier(), 'comment');
        const user = new UniqueIdentifier();
        const infinityPeriod = new InfinitePeriod(new Date(2022, 3, 20));
        availabilityService.register(comment);
        const availability = availabilityService.grant(comment, user, [new TimeAccess(infinityPeriod)], []);

        const checkPeriod = new OneDayPeriod(new Date(2022, 5,22));
        const aResult = availability.access.check(user, checkPeriod);
        const mResult = availability.modify.check(user, checkPeriod);

        expect(aResult).to.be.true;
        expect(mResult).to.be.false;
    });
});