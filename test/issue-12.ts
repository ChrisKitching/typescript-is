import * as assert from 'assert';
import { is, assertType } from '../index';

/* https://github.com/woutervh-/typescript-is/issues/12 */

describe('is', () => {
    interface ConfigInit {
        folder: string;
        children: ConfigInit[];
    }

    describe('is<ConfigInit>', () => {
        it('should return true for valid recursive ConfigInit objects', () => {
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [] }), true);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ folder: './foo', children: [] }] }), true);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ folder: './foo', children: [{ folder: './foo/bar', children: [] }] }] }), true);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ folder: './foo', children: [] }, { folder: './baz', children: [] }] }), true);
        });

        it('should return false for invalid recursive ConfigInit objects', () => {
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.' }), false);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ folder: './foo' }] }), false);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ folder: './foo', children: [{ folder: './foo/bar' }] }] }), false);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ folder: './foo', children: {} }] }), false);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ folder: './foo', children: '123' }] }), false);
            assert.deepStrictEqual(is<ConfigInit>({}), false);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.' }), false);
            assert.deepStrictEqual(is<ConfigInit>({ foolder: '.' }), false);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ folder: 123, children: [] }] }), false);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ foolder: './foo', children: [] }] }), false);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ foolder: 123, children: [] }] }), false);
            assert.deepStrictEqual(is<ConfigInit>({ folder: '.', children: [{ folder: './foo', children: [] }, { folder: './baz', children: {} }] }), false);
        });
    });

    describe('assertType<ConfigInit>', () => {
        it('should throw an error when invalid objects are passed to it', () => {
            assert.throws(() => assertType<ConfigInit>(null));
            assert.throws(() => assertType<ConfigInit>({}));
            assert.throws(() => assertType<ConfigInit>({ folder: '.', children: 'foo' }));
            assert.throws(() => assertType<ConfigInit>({ folder: '.', children: [null] }));
            assert.throws(() => assertType<ConfigInit>({ folder: '.', children: [{}] }));
            assert.throws(() => assertType<ConfigInit>({ folder: '.', children: [{ folder: './foo', children: null }] }));
        });
    });

    // Note: checking this at runtime would require unbounded recursion.
    interface DirectlyRecursive {
        child: DirectlyRecursive;
    }

    describe('is<DirectlyRecursive>', () => {
        it('should throw for valid objects due maximum call stack size being exceeded', () => {
            const object = {} as DirectlyRecursive;
            object.child = object;
            const expectedMessageRegExp1 = /Maximum call stack size exceeded$/;
            assert.throws(() => is<DirectlyRecursive>(object), expectedMessageRegExp1);
        });

        it('should return false for invalid objects', () => {
            assert.deepStrictEqual(is<DirectlyRecursive>(true), false);
            assert.deepStrictEqual(is<DirectlyRecursive>([]), false);
            assert.deepStrictEqual(is<DirectlyRecursive>({}), false);
            assert.deepStrictEqual(is<DirectlyRecursive>({ child: true }), false);
            assert.deepStrictEqual(is<DirectlyRecursive>({ child: [] }), false);
            assert.deepStrictEqual(is<DirectlyRecursive>({ child: {} }), false);
            assert.deepStrictEqual(is<DirectlyRecursive>({ child: { child: true } }), false);
            assert.deepStrictEqual(is<DirectlyRecursive>({ child: { child: [] } }), false);
            assert.deepStrictEqual(is<DirectlyRecursive>({ child: { child: {} } }), false);
        });
    });

    interface OptionalFieldsRecursive {
        folder?: string;
        children: OptionalFieldsRecursive[];
    }

    describe('is<OptionalFieldsRecursive>', () => {
        it('should return true for valid recursive OptionalFieldsRecursive objects', () => {
            assert.deepStrictEqual(is<OptionalFieldsRecursive>({ children: [] }), true);
        });

        it('should return false for invalid recursive OptionalFieldsRecursive objects', () => {
            assert.deepStrictEqual(is<OptionalFieldsRecursive>({}), false);
        });
    });
});
