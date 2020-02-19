import * as assert from 'assert';
import { assertType } from '../index';

describe('assertType', () => {
    interface Bar {
        values: string[];
        index: number;
    }

    interface Foo {
        foo: string;
        bar: Bar;
    }

    describe('assertType<Foo>', () => {
        it('should not throw an error for valid objects', () => {
            assertType<Foo>({ foo: 'foo', bar: { values: ['bar'], index: 0 } });
        });

        it('should throw an error with the type of and path to the error', () => {
            try {
                assertType<Foo>(null);
                assert.fail('Failed to throw');
            } catch (error) {}

            try {
                assertType<Foo>({});
                assert.fail('Failed to throw');
            } catch (error) {}

            try {
                assertType<Foo>({ foo: 123 });
                assert.fail('Failed to throw');
            } catch (error) {}

            try {
                assertType<Foo>({ foo: 'foo' });
                assert.fail('Failed to throw');
            } catch (error) {}

            try {
                assertType<Foo>({ foo: 'foo', bar: null });
                assert.fail('Failed to throw');
            } catch (error) {}

            try {
                assertType<Foo>({ foo: 'foo', bar: {} });
                assert.fail('Failed to throw');
            } catch (error) {}

            try {
                assertType<Foo>({ foo: 'foo', bar: { values: ['bar'], index: 'bar' } });
                assert.fail('Failed to throw');
            } catch (error) {}
        });
    });
});
