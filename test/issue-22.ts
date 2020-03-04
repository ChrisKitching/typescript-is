import * as assert from 'assert';
import { equals, createEquals, assertEquals, createAssertEquals } from '../index';

/* https://github.com/woutervh-/typescript-is/issues/22 */

describe('equals', () => {
    describe('equals<{ foo: number }>', () => {
        it('should return true for objects with `foo` being a number', () => {
            assert.deepStrictEqual(equals<{ foo: number }>({ foo: 0 }), true);
            assert.deepStrictEqual(equals<{ foo: number }>({ foo: 1 }), true);
            assert.deepStrictEqual(equals<{ foo: number }>({ foo: Number.NaN }), true);
        });

        it('should return false for objects without `foo` being a number', () => {
            assert.deepStrictEqual(equals<{ foo: number }>(null), false);
            assert.deepStrictEqual(equals<{ foo: number }>({}), false);
            assert.deepStrictEqual(equals<{ foo: number }>({ foo: 'value' }), false);
        });

        it('should return false for objects with `foo` being a number and with other properties', () => {
            assert.deepStrictEqual(equals<{ foo: number }>({ foo: 0, bar: 1 }), false);
            assert.deepStrictEqual(equals<{ foo: number }>({ foo: 0, bar: 'value' }), false);
            assert.deepStrictEqual(equals<{ foo: number }>({ foo: 0, baz: 'foo' }), false);
        });
    });
});

describe('createEquals', () => {
    describe('createEquals<{ foo: number }>', () => {
        const equalsObject = createEquals<{ foo: number }>();

        it('should return a function', () => {
            assert.deepStrictEqual(typeof equalsObject, 'function');
        });

        it('should return true for objects with `foo` being a number', () => {
            assert.deepStrictEqual(equalsObject({ foo: 0 }), true);
            assert.deepStrictEqual(equalsObject({ foo: 1 }), true);
            assert.deepStrictEqual(equalsObject({ foo: Number.NaN }), true);
        });

        it('should return false for objects without `foo` being a number', () => {
            assert.deepStrictEqual(equalsObject(null), false);
            assert.deepStrictEqual(equalsObject({}), false);
            assert.deepStrictEqual(equalsObject({ foo: 'value' }), false);
        });

        it('should return false for objects with `foo` being a number and with other properties', () => {
            assert.deepStrictEqual(equalsObject({ foo: 0, bar: 1 }), false);
            assert.deepStrictEqual(equalsObject({ foo: 0, bar: 'value' }), false);
            assert.deepStrictEqual(equalsObject({ foo: 0, baz: 'foo' }), false);
        });
    });
});

describe('assertEquals', () => {
    describe('assertEquals<{ foo: number }>', () => {
        it('should not throw if given valid objects', () => {
            assert.doesNotThrow(() => assertEquals<{ foo: number }>({ foo: 0 }));
            assert.doesNotThrow(() => assertEquals<{ foo: number }>({ foo: 1 }));
        });

        it('should throw an error if objects without `foo` being a number are passed to it', () => {
            assert.throws(() => assertEquals<{ foo: number }>({}));
            assert.throws(() => assertEquals<{ foo: number }>({ bar: 0 }));
        });

        it('should throw an error if objects with `foo` being a number and with other properties are passed to it', () => {
            assert.throws(() => assertEquals<{ foo: number }>({ foo: 0, bar: 1 }));
            assert.throws(() => assertEquals<{ foo: number }>({ foo: 0, bar: 'value' }));
        });
    });
});

describe('createAssertEquals', () => {
    describe('createAssertEquals<{ foo: number }>', () => {
        const assertObject = createAssertEquals<{ foo: number }>();

        it('should return a function', () => {
            assert.deepStrictEqual(typeof assertObject, 'function');
        });

        it('should not throw when given valid objects', () => {
            assert.doesNotThrow(() => assertObject({ foo: 0 }));
            assert.doesNotThrow(() => assertObject({ foo: 1 }));
        });

        it('should throw an error if objects without `foo` being a number are passed to it', () => {
            assert.throws(() => assertObject({}));
            assert.throws(() => assertObject({ bar: 0 }));
        });

        it('should throw an error if objects with `foo` being a number and with other properties are passed to it', () => {
            assert.throws(() => assertObject({ foo: 0, bar: 1 }));
            assert.throws(() => assertObject({ foo: 0, bar: 'value' }));
        });
    });
});
