import * as assert from 'assert';
import { assertType, TypeGuardError, createAssertType } from '../index';

/* https://github.com/woutervh-/typescript-is/issues/19 */

describe('is', () => {
    describe('assertType<{}>', () => {
        it('should not throw when given empty-object', () => {
            assert.doesNotThrow(() => assertType<{}>({}));
        });

        it('should throw a TypeGuardValidation error if failing objects are passed to it', () => {
            try {
                assertType<{}>('');
            } catch (error) {
                if (!(error instanceof TypeGuardError)) {
                    throw new Error('Expected error of class TypeGuardError.');
                }
                if (error.name !== 'TypeGuardError') {
                    throw new Error('Expected error to have name TypeGuardError.');
                }
            }
        });
    });

    describe('createAssertType<{}>', () => {
        it('should return a function', () => {
            assert.deepStrictEqual(typeof createAssertType<{}>(), 'function');
        });

        it('should return a function that does not throw when given empty-object', () => {
            assert.doesNotThrow(() => createAssertType<{}>()({}));
        });

        it('should throw a TypeGuardValidation error if failing objects are passed to it', () => {
            try {
                createAssertType<{}>()('');
            } catch (error) {
                if (!(error instanceof TypeGuardError)) {
                    throw new Error('Expected error of class TypeGuardError.');
                }
            }
        });
    });
});
