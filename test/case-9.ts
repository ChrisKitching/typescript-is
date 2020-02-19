import * as assert from 'assert';
import { assertType } from '../index';

describe('assertType', () => {
    describe('assertType<number>', () => {
        it('should return the numbers passed to it', () => {
            assert.deepStrictEqual(assertType<number>(-1), -1);
            assert.deepStrictEqual(assertType<number>(0), 0);
            assert.deepStrictEqual(assertType<number>(1), 1);
            assert.deepStrictEqual(Number.isNaN(assertType<number>(Number.NaN)), true);
            assert.deepStrictEqual(assertType<number>(Number.POSITIVE_INFINITY), Number.POSITIVE_INFINITY);
        });

        it('should throw an error if non-numbers are passed to it', () => {
            assert.throws(() => assertType<number>(''));
            assert.throws(() => assertType<number>('1'));
            assert.throws(() => assertType<number>([]));
            assert.throws(() => assertType<number>({}));
            assert.throws(() => assertType<number>(true));
            assert.throws(() => assertType<number>(false));
            assert.throws(() => assertType<number>(null));
            assert.throws(() => assertType<number>(undefined));
        });
    });
});
