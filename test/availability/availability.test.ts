import { Break } from './../../src/availability/model/access/access';
import { InfinitePeriod } from './../../src/utils/period';
import { RevokeFor } from './../../src/availability/model/revoke/revoke-for';
import { RevokeAll } from './../../src/availability/model/revoke/revoke-all';
import { RevokeUnless } from './../../src/availability/model/revoke/revoke-unless';
import { expect, use } from 'chai';
import { OneDayPeriod, Period } from '../../src/utils/period';
import { Availability } from './../../src/availability/model/availability';
import {
    Resource,
    ResourceType,
} from './../../src/availability/model/resource';
import { UniqueIdentifier } from './../../src/utils/unique-identifier';
import { TimeAccess } from '../../src/availability/model/access/access';

const createFreshReadAvailability = (type: ResourceType) => {
    const id = new UniqueIdentifier();
    const resource = new Resource(new UniqueIdentifier(), type);
    return new Availability(id, resource, 1);
};

describe('Testy sprawdzające availability', () => {
    it('zasób niedostępny jeżeli nowy', () => {
        const availability = createFreshReadAvailability('document');

        const result = availability.check(
            new UniqueIdentifier(),
            new OneDayPeriod(new Date())
        );
        
        expect(result).to.be.false;
    });

    it('dostępny gdy nadano access nieograniczony i sprawdzono tego samego dnia', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(new InfinitePeriod(new Date(2022, 5, 24)))
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 5, 24))
        );

        expect(result).to.be.true;
    });

    it('dostępny gdy nadano access nieograniczony i sprawdzono kilka dni później', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(new InfinitePeriod(new Date(2022, 5, 24)))
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 5, 27))
        );

        expect(result).to.be.true;
    });

    it('niedostępny gdy nadano adres nieograniczony od konkretnej daty, a prawdzamy przed tą datą', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(new InfinitePeriod(new Date(2022, 5, 24)))
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 5, 20))
        );

        expect(result).to.be.false;
    });

    it('dostępny gdy nadano access czasowy', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(
                new Period(new Date(2022, 5, 24), new Date(2022, 5, 27))
            )
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 5, 26))
        );

        expect(result).to.be.true;
    });

    it('dostępny gdy nadano access nieograniczony z 1 przerwą i sprawdzamy przed przerwą', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(new InfinitePeriod(new Date(2022, 1, 1)))
        );
        availability.grant(
            userId,
            new Break(new Period(new Date(2022, 5, 23), new Date(2022, 6, 1)))
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 3, 1))
        );

        expect(result).to.be.true;
    });

    it('dostępny gdy nadano access nieograniczony z 1 przerwą i sprawdzamy po przerwie', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(new InfinitePeriod(new Date(2022, 1, 1)))
        );
        availability.grant(
            userId,
            new Break(new Period(new Date(2022, 5, 23), new Date(2022, 6, 1)))
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 6, 2))
        );

        expect(result).to.be.true;
    });

    it('niedostępny gdy nadano access nieograniczony z 1 przerwą i sprawdzamy w trakcie przerwy', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(new InfinitePeriod(new Date(2022, 1, 1)))
        );

        availability.grant(
            userId,
            new Break(new Period(new Date(2022, 5, 23), new Date(2022, 6, 1)))
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 5, 27))
        );

        expect(result).to.be.false;
    });

    it('dostępny gdy nadano nieograniczony access z 3 przerwami i sprawdzamy pomiędzy przerwami', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(new InfinitePeriod(new Date(2022, 1, 1)))
        );
        availability.grant(
            userId,
            new Break(new Period(new Date(2022, 5, 23), new Date(2022, 6, 1)))
        );
        availability.grant(
            userId,
            new Break(new Period(new Date(2022, 7, 23), new Date(2022, 8, 1)))
        );
        availability.grant(
            userId,
            new Break(
                new Period(new Date(2022, 11, 23), new Date(2022, 12, 12))
            )
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 5, 27))
        );

        expect(result).to.be.false;
    });

    it('dostępny dla czasowego access z 1 przerwą i sprawdzany przed przerwą', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(
                new Period(new Date(2022, 3, 2), new Date(2022, 9, 12))
            )
        );

        availability.grant(
            userId,
            new Break(new Period(new Date(2022, 5, 23), new Date(2022, 6, 1)))
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 4, 1))
        );

        expect(result).to.be.true;
    });

    it('niedostępny dla czasowego access i sprawdzany w trakcie przerwy', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(
                new Period(new Date(2022, 3, 2), new Date(2022, 9, 12))
            )
        );

        availability.grant(
            userId,
            new Break(new Period(new Date(2022, 5, 23), new Date(2022, 6, 1)))
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 5, 27))
        );

        expect(result).to.be.false;
    });

    it('niedostępny gdy jest spoza czasowego przedziału', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(
                new Period(new Date(2022, 3, 2), new Date(2022, 9, 12))
            )
        );

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 1, 1))
        );

        expect(result).to.be.false;
    });

    it('niedostępny gdy nie ma access dla użytkownika', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(
                new Period(new Date(2022, 3, 2), new Date(2022, 9, 12))
            )
        );

        const result = availability.check(
            new UniqueIdentifier(),
            new OneDayPeriod(new Date(2022, 6, 1))
        );

        expect(result).to.be.false;
    });

    it('dostępny tylko dla jednego użytkownika gdy tylko on spełnia kryteria dostępności', () => {
        const availability = createFreshReadAvailability('document');
        const userId1 = new UniqueIdentifier();
        const userId2 = new UniqueIdentifier();
        availability.grant(
            userId1,
            new TimeAccess(
                new Period(new Date(2022, 3, 2), new Date(2022, 9, 12))
            )
        );

        const result1 = availability.check(
            userId1,
            new OneDayPeriod(new Date(2022, 4, 1))
        );

        const result2 = availability.check(
            userId2,
            new OneDayPeriod(new Date(2022, 1, 1))
        );

        expect(result1).to.be.true;
        expect(result2).to.be.false;
    });

    it('niedostępny gdy usunięto dostęp dla użytkownika', () => {
        const availability = createFreshReadAvailability('document');
        const userId = new UniqueIdentifier();
        availability.grant(
            userId,
            new TimeAccess(new InfinitePeriod(new Date(2022, 5, 24)))
        );

        availability.revoke(new RevokeFor(userId));

        const result = availability.check(
            userId,
            new OneDayPeriod(new Date(2022, 5, 24))
        );

        expect(result).to.be.false;
    });

    it('niedostępny gdy usunięto dostęp dla wszystkich użytkowników', () => {
        const availability = createFreshReadAvailability('document');
        const userId1 = new UniqueIdentifier();
        availability.grant(
            userId1,
            new TimeAccess(new InfinitePeriod(new Date(2022, 5, 24)))
        );
        const userId2 = new UniqueIdentifier();
        availability.grant(
            userId2,
            new TimeAccess(new InfinitePeriod(new Date(2022, 5, 24)))
        );

        availability.revoke(new RevokeAll());

        const result1 = availability.check(
            userId1,
            new OneDayPeriod(new Date(2022, 5, 24))
        );

        const result2 = availability.check(
            userId2,
            new OneDayPeriod(new Date(2022, 5, 24))
        );

        expect(result1).to.be.false;
        expect(result2).to.be.false;
    });

    it('niedostępny gdy usunięto dostęp dla wszystkich oprócz wybranego użytkownika', () => {
        const availability = createFreshReadAvailability('document');
        const userId1 = new UniqueIdentifier();
        availability.grant(
            userId1,
            new TimeAccess(new InfinitePeriod(new Date(2022, 5, 24)))
        );
        const userId2 = new UniqueIdentifier();
        availability.grant(
            userId2,
            new TimeAccess(new InfinitePeriod(new Date(2022, 5, 24)))
        );

        availability.revoke(new RevokeUnless(userId2));

        const result1 = availability.check(
            userId1,
            new OneDayPeriod(new Date(2022, 5, 24))
        );

        const result2 = availability.check(
            userId2,
            new OneDayPeriod(new Date(2022, 5, 24))
        );

        expect(result1).to.be.false;
        expect(result2).to.be.true;
    });
});
