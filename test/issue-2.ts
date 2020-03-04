import * as assert from 'assert';
import { assertType } from '../index';

/* https://github.com/woutervh-/typescript-is/issues/2 */

describe('assertType', () => {
    describe('assertType<{ foo: string }>', () => {
        it('should not throw when given valid objects', () => {
            assert.doesNotThrow(() => assertType<{ foo: string }>({ foo: '' }));
            assert.doesNotThrow(() => assertType<{ foo: string }>({ foo: '0' }));
            assert.doesNotThrow(() => assertType<{ foo: string }>({ foo: 'a' }));
            assert.doesNotThrow(() => assertType<{ foo: string }>({ foo: 'true' }));
        });

        it('should throw an error if invalid objects are passed to it', () => {
            assert.throws(() => assertType<{ foo: string }>(0));
            assert.throws(() => assertType<{ foo: string }>([]));
            assert.throws(() => assertType<{ foo: string }>(null));
            assert.throws(() => assertType<{ foo: string }>(true));
        });

        it('should throw an error if objects without foo are passed to it', () => {
            assert.throws(() => assertType<{ foo: string }>({}));
            assert.throws(() => assertType<{ foo: string }>({ bar: 'baz' }));
        });

        it('should throw an error if objects with foo not a string are passed to it', () => {
            assert.throws(() => assertType<{ foo: string }>({ foo: 0 }));
            assert.throws(() => assertType<{ foo: string }>({ foo: false }));
        });
    });

    describe('assertType<{ foo: number[] }>', () => {
        it('should not throw when given valid objects', () => {
            assert.doesNotThrow(() => assertType<{ foo: number[] }>({ foo: [] }));
            assert.doesNotThrow(() => assertType<{ foo: number[] }>({ foo: [0] }));
            assert.doesNotThrow(() => assertType<{ foo: number[] }>({ foo: [0, 1] }));
            assert.doesNotThrow(() => assertType<{ foo: number[] }>({ foo: [Number.NEGATIVE_INFINITY] }));
            // assert.deepStrictEqual(assertType<{ foo: number[] }>({ foo: [Number.NaN] }), { foo: [Number.NaN] }); // NodeJS 6, 7 and 8 fail on NaN comparison
        });

        it('should throw an error if objects without foo are passed to it', () => {
            assert.throws(() => assertType<{ foo: string }>({}));
            assert.throws(() => assertType<{ foo: string }>({ bar: 'baz' }));
        });

        it('should throw an error if invalid objects are passed to it', () => {
            assert.throws(() => assertType<{ foo: number[] }>(0));
            assert.throws(() => assertType<{ foo: number[] }>(null));
            assert.throws(() => assertType<{ foo: number[] }>(true));
        });

        it('should throw an error if objects where foo is not an array of numbers are passed to it', () => {
            assert.throws(() => assertType<{ foo: number[] }>({ foo: [0, '0'] }));
            assert.throws(() => assertType<{ foo: number[] }>({ foo: ['1'] }));
            assert.throws(() => assertType<{ foo: number[] }>({ foo: [{}] }));
            assert.throws(() => assertType<{ foo: number[] }>({ foo: [[]] }));
            assert.throws(() => assertType<{ foo: number[] }>({ foo: [null] }));
        });
    });

    describe('assertType<{ nested: Nested }>', () => {
        interface Nested {
            foo: 'bar' | 'baz';
        }

        it('should not throw when given valid objects', () => {
            assert.doesNotThrow(() => assertType<{ nested: Nested }>({ nested: { foo: 'bar' } }));
            assert.doesNotThrow(() => assertType<{ nested: Nested }>({ nested: { foo: 'baz' } }));
        });

        it('should throw an error if nested objects with foo not \'bar\' or \'baz\' are passed to it', () => {
            assert.throws(() => assertType<{ nested: Nested }>({ nested: { foo: 'qux' } }));
            assert.throws(() => assertType<{ nested: Nested }>({ nested: { foo: 0 } }));
            assert.throws(() => assertType<{ nested: Nested }>({ nested: { foo: [] } }));
            assert.throws(() => assertType<{ nested: Nested }>({ nested: { foo: {} } }));
        });

        it('should throw an error if nested objects without foo are passed to it', () => {
            assert.throws(() => assertType<{ nested: Nested }>({ nested: {} }));
            assert.throws(() => assertType<{ nested: Nested }>({ nested: { foh: 'bar' } }));
        });

        it('should throw an error if nested properties that are not objects are passed to it', () => {
            assert.throws(() => assertType<{ nested: Nested }>({ nested: 0 }));
            assert.throws(() => assertType<{ nested: Nested }>({ nested: true }));
            assert.throws(() => assertType<{ nested: Nested }>({ nested: null }));
            assert.throws(() => assertType<{ nested: Nested }>({ nested: [] }));
        });

        it('should throw an error if objects without nested are passed to it', () => {
            assert.throws(() => assertType<{ nested: Nested }>({ nisted: { foo: 'bar' } }));
            assert.throws(() => assertType<{ nested: Nested }>({ nisted: { foh: 'baz' } }));
        });

        it('should throw an error if other objects are passed to it', () => {
            assert.throws(() => assertType<{ nested: Nested }>('0'));
            assert.throws(() => assertType<{ nested: Nested }>(1));
            assert.throws(() => assertType<{ nested: Nested }>([]));
            assert.throws(() => assertType<{ nested: Nested }>(null));
            assert.throws(() => assertType<{ nested: Nested }>(false));
        });
    });

    describe('assertType<{ [Key: string]: boolean }>', () => {
        it('should not throw when given valid objects', () => {
            assert.doesNotThrow(() => assertType<{ [Key: string]: boolean }>({}));
            assert.doesNotThrow(() => assertType<{ [Key: string]: boolean }>({ foo: true }));
            assert.doesNotThrow(() => assertType<{ [Key: string]: boolean }>({ bar: false }));
        });

        it('should throw an error if objects with non-boolen values are passed to it', () => {
            assert.throws(() => assertType<{ [Key: string]: boolean }>({ foo: 0 }));
            assert.throws(() => assertType<{ [Key: string]: boolean }>({ bar: 'foo' }));
            assert.throws(() => assertType<{ [Key: string]: boolean }>({ bar: [] }));
            assert.throws(() => assertType<{ [Key: string]: boolean }>({ bar: null }));
        });
    });
});
