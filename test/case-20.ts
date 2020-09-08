import { strict as assert } from 'assert';
import { is, assertType } from '../index';


function mkErr(): Error {
    return new Error('Test');
}


interface ContainerWithOptional<T> {
    field?: T;
}

interface ContainerWithNullable<T> {
    field: T | null;
}

type ContainerWithOptionalString = ContainerWithOptional<string>;

type ContainerWithNullableString = ContainerWithNullable<string>;


describe('assertType with Optional and Nullable fields', () => {
    describe('assertType<ContainerWithOptional<number>>', () => {
        it('should not throw an error on a valid undefined field', () => {
            assertType<ContainerWithOptional<number>>({});
        });

        it('should not throw an error on a valid defined field', () => {
            assertType<ContainerWithOptional<number>>({field: 42});
        });

        it('should throw an error on an invalid input', () => {
            assert.throws(() => assertType<ContainerWithOptional<number>>({field: null}, mkErr), mkErr());
            assert.throws(() => assertType<ContainerWithOptional<number>>({field: 'text'}, mkErr), mkErr());
        });
    });

    describe('assertType<ContainerWithNullable<number>>', () => {
        it('should not throw an error on a valid null field', () => {
            assertType<ContainerWithNullable<number>>({field: null});
        });

        it('should not throw an error on a valid defined field', () => {
            assertType<ContainerWithNullable<number>>({field: 42});
        });

        it('should throw an error on an invalid input', () => {
            assert.throws(() => assertType<ContainerWithNullable<number>>({}, mkErr), mkErr());
            assert.throws(() => assertType<ContainerWithNullable<number>>({field: 'text'}, mkErr), mkErr());
        });
    });

    describe('assertType<ContainerWithOptionalString>', () => {
        it('should not throw an error on a valid undefined field', () => {
            assertType<ContainerWithOptionalString>({});
        });

        it('should not throw an error on a valid defined field', () => {
            assertType<ContainerWithOptionalString>({field: ''});
        });

        it('should throw an error on an invalid input', () => {
            assert.throws(() => assertType<ContainerWithOptionalString>({field: null}, mkErr), mkErr());
            assert.throws(() => assertType<ContainerWithOptionalString>({field: 42}, mkErr), mkErr());
        });
    });

    describe('assertType<ContainerWithNullableString>', () => {
        it('should not throw an error on a valid null field', () => {
            assertType<ContainerWithNullableString>({field: null});
        });

        it('should not throw an error on a valid defined field', () => {
            assertType<ContainerWithNullableString>({field: ''});
        });

        it('should throw an error on an invalid input', () => {
            assert.throws(() => assertType<ContainerWithNullableString>({}, mkErr), mkErr());
            assert.throws(() => assertType<ContainerWithNullableString>({field: 42}, mkErr), mkErr());
        });
    });

    describe('assertType<string|undefined>', () => {
        type t = string | undefined;

        it('should not throw an error on valid input', () => {
            assertType<string | undefined>(undefined);
            assertType<string | undefined>('');
            assertType<t>(undefined);
            assertType<t>('');
        });

        it('should throw an error on invalid input', () => {
            assert.throws(() => assertType<string | undefined>(42, mkErr), mkErr());
            assert.throws(() => assertType<string | undefined>({}, mkErr), mkErr());
            assert.throws(() => assertType<string | undefined>(null, mkErr), mkErr());
            assert.throws(() => assertType<t>(42, mkErr), mkErr());
            assert.throws(() => assertType<t>({}, mkErr), mkErr());
            assert.throws(() => assertType<t>(null, mkErr), mkErr());
        });
    });

    describe('assertType<string|null>', () => {
        type t = string | null;

        it('should not throw an error on valid input', () => {
            assertType<string | null>(null);
            assertType<string | null>('');
            assertType<t>(null);
            assertType<t>('');
        });

        it('should throw an error on invalid input', () => {
            assert.throws(() => assertType<string | null>(42, mkErr), mkErr());
            assert.throws(() => assertType<string | null>({}, mkErr), mkErr());
            assert.throws(() => assertType<string | null>(undefined, mkErr), mkErr());
            assert.throws(() => assertType<t>(42, mkErr), mkErr());
            assert.throws(() => assertType<t>({}, mkErr), mkErr());
            assert.throws(() => assertType<t>(undefined, mkErr), mkErr());
        });
    });
});

describe('is with Optional and Nullable fields', () => {
    describe('is<ContainerWithOptional<number>>', () => {
        it('should be truthy on a valid undefined field', () => {
            assert(is<ContainerWithOptional<number>>({}));
        });

        it('should be truthy on a valid defined field', () => {
            assert(is<ContainerWithOptional<number>>({field: 42}));
        });

        it('should be falsy on an invalid input', () => {
            assert(!is<ContainerWithOptional<number>>({field: null}));
            assert(!is<ContainerWithOptional<number>>({field: 'text'}));
        });
    });

    describe('is<ContainerWithNullable<number>>', () => {
        it('should be truthy on a valid null field', () => {
            assert(is<ContainerWithNullable<number>>({field: null}));
        });

        it('should be truthy on a valid defined field', () => {
            assert(is<ContainerWithNullable<number>>({field: 42}));
        });

        it('should be falsy on an invalid input', () => {
            assert(!is<ContainerWithNullable<number>>({}));
            assert(!is<ContainerWithNullable<number>>({field: 'text'}));
        });
    });

    describe('is<ContainerWithOptionalString>', () => {
        it('should be truthy on a valid undefined field', () => {
            assert(is<ContainerWithOptionalString>({}));
        });

        it('should be truthy on a valid defined field', () => {
            assert(is<ContainerWithOptionalString>({field: ''}));
        });

        it('should be falsy on an invalid input', () => {
            assert(!is<ContainerWithOptionalString>({field: null}));
            assert(!is<ContainerWithOptionalString>({field: 42}));
        });
    });

    describe('is<ContainerWithNullableString>', () => {
        it('should fe truthy on a valid null field', () => {
            assert(is<ContainerWithNullableString>({field: null}));
        });

        it('should be truthy on a valid defined field', () => {
            assert(is<ContainerWithNullableString>({field: ''}));
        });

        it('should be falsy on an invalid input', () => {
            assert(!is<ContainerWithNullableString>({}));
            assert(!is<ContainerWithNullableString>({field: 42}));
        });
    });

    describe('is<string|undefined>', () => {
        type t = string | undefined;

        it('should be truthy on valid input', () => {
            assert(is<string | undefined>(undefined));
            assert(is<string | undefined>(''));
            assert(is<t>(undefined));
            assert(is<t>(''));
        });

        it('should be falsy on invalid input', () => {
            assert(!is<string | undefined>(42));
            assert(!is<string | undefined>({}));
            assert(!is<string | undefined>(null));
            assert(!is<t>(42));
            assert(!is<t>({}));
            assert(!is<t>(null));
        });
    });

    describe('is<string|null>', () => {
        type t = string | null;

        it('should be truthy on valid input', () => {
            assert(is<string | null>(null));
            assert(is<string | null>(''));
            assert(is<t>(null));
            assert(is<t>(''));
        });

        it('should be falsy on invalid input', () => {
            assert(!is<string | null>(42));
            assert(!is<string | null>({}));
            assert(!is<string | null>(undefined));
            assert(!is<t>(42));
            assert(!is<t>({}));
            assert(!is<t>(undefined));
        });
    });
});
