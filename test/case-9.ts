import * as assert from 'assert';
import { assertType } from '../index';

describe('assertType', () => {
    describe('assertType<number>', () => {
        it('should not throw when given numbers', () => {
            assert.doesNotThrow(() => assertType<number>(-1));
            assert.doesNotThrow(() => assertType<number>(0));
            assert.doesNotThrow(() => assertType<number>(1));
            assert.doesNotThrow(() => assertType<number>(Number.NaN));
            assert.doesNotThrow(() => assertType<number>(Number.POSITIVE_INFINITY));
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
