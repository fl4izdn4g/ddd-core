import { expect } from 'chai';
import { InfinitePeriod, Period } from '../../src/utils/period';

describe('InfinitePeriod testing', () => {
    it('should return true when period is inside infinite period', () => {
        const infinite = new InfinitePeriod(new Date(2022,5,19));
        const standard = new Period(new Date(2022, 5, 29), new Date(2025, 11, 20));
        
        const result = infinite.overlaps(standard);

        expect(result).to.be.true;
    });

    it('should return false when period is before infinite period', () => {
        const infinite = new InfinitePeriod(new Date(2022,5,19));
        const standard = new Period(new Date(2002, 5, 29), new Date(2010, 11, 20));
        
        const result = infinite.overlaps(standard);

        expect(result).to.be.false;
    });

    it('should return true when date is in infinite period', () => {
        const infinite = new InfinitePeriod(new Date(2022,5,19));
        
        const result = infinite.isDateWithin(new Date(3000, 2, 18));

        expect(result).to.be.true;
    });

    it('should return false when date is in infinite period', () => {
        const infinite = new InfinitePeriod(new Date(2022,5,19));
        
        const result = infinite.isDateWithin(new Date(1900, 2, 18));

        expect(result).to.be.false;
    });
});
