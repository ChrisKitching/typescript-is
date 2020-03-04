import * as assert from 'assert';
import { createIs, createAssertType } from '../index';

describe('createIs', () => {
    describe('createIs<number>', () => {
        const isNumber = createIs<number>();

        it('should return a function', () => {
            assert.deepStrictEqual(typeof isNumber, 'function');
        });

        it('should return a function that returns true for numbers', () => {
            assert.deepStrictEqual(isNumber(-1), true);
            assert.deepStrictEqual(isNumber(0), true);
            assert.deepStrictEqual(isNumber(1), true);
            assert.deepStrictEqual(isNumber(Number.NaN), true);
            assert.deepStrictEqual(isNumber(Number.POSITIVE_INFINITY), true);
            assert.deepStrictEqual(isNumber(Number.NEGATIVE_INFINITY), true);
            assert.deepStrictEqual(isNumber(42), true);
        });

        it('should return a function that returns false for other objects', () => {
            assert.deepStrictEqual(isNumber(''), false);
            assert.deepStrictEqual(isNumber('1'), false);
            assert.deepStrictEqual(isNumber(true), false);
            assert.deepStrictEqual(isNumber(false), false);
            assert.deepStrictEqual(isNumber(undefined), false);
            assert.deepStrictEqual(isNumber(null), false);
            assert.deepStrictEqual(isNumber({}), false);
            assert.deepStrictEqual(isNumber([]), false);
        });
    });
});

describe('createAssertType', () => {
    describe('createAssertType<number>', () => {
        const assertNumber = createAssertType<number>();

        it('should return a function', () => {
            assert.deepStrictEqual(typeof assertNumber, 'function');
        });

        it('should return a function that does not throw when given numbers', () => {
            assert.doesNotThrow(() => assertNumber(-1));
            assert.doesNotThrow(() => assertNumber(0));
            assert.doesNotThrow(() => assertNumber(1));
            assert.doesNotThrow(() => assertNumber(Number.NaN));
            assert.doesNotThrow(() => assertNumber(Number.POSITIVE_INFINITY));
        });

        it('should return a function that throws if non-numbers are passed to it', () => {
            assert.throws(() => assertNumber(''));
            assert.throws(() => assertNumber('1'));
            assert.throws(() => assertNumber([]));
            assert.throws(() => assertNumber({}));
            assert.throws(() => assertNumber(true));
            assert.throws(() => assertNumber(false));
            assert.throws(() => assertNumber(null));
            assert.throws(() => assertNumber(undefined));
        });
    });
});
