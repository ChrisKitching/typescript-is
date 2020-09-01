import { strict as assert } from 'assert';
import { is, assertType } from '../index';


function mkErr(): Error {
    return new Error('Test');
}


interface TOrNull<T> {
    tOrNull: T | null;
}

interface StrContainer {
    str: string;
}

interface Container {
    numField: TOrNull<number>;
    strField?: TOrNull<StrContainer>;
}

interface WeirdContainer<T> {
    field: T | undefined;
}


const validFieldValues = {
    numField: [
        {tOrNull: -500},
        {tOrNull: 0},
        {tOrNull: 1},
        {tOrNull: 42},
        {tOrNull: null}
    ],
    strFieldOptional: [
        {tOrNull: {str: ''}},
        {tOrNull: {str: 'text'}},
        {tOrNull: null},
        undefined
    ]
}

const validContainerValues: Container[] = [];
validFieldValues.numField.forEach(numField => {
    validFieldValues.strFieldOptional.forEach(strField => {
        validContainerValues.push({
            numField,
            strField
        })
    });
});

validFieldValues.numField.forEach(numField => {
    validContainerValues.push({
        numField
    });
});


describe('assertType on complex things with Optional and Nullable fields', () => {
    describe('assertType<Container> on generated objects', () => {
        it('should not throw an error on valid objects', () => {
            validContainerValues.forEach((element: any) => {
                assertType<Container>(element);
            });
        });
    });

    // That's how typescripts validates these objects.
    describe('assertType<Container with T | undefined>', () => {
        it('should not throw on valid object with defined field', () => {
            assertType<WeirdContainer<number>>({field: 42});
        });

        it('should not throw on valid objects with defined undefined field', () => {
            assertType<WeirdContainer<number>>({field: undefined});
        });

        it('should throw on invalid objects', () => {
            assert.throws(() => assertType<WeirdContainer<number>>({}, mkErr()), mkErr());
        });
    });
});


describe('is on complex things with Optional and Nullable fields', () => {
    describe('assertType<Container> on generated objects', () => {
        it('should be truthy on valid objects', () => {
            validContainerValues.forEach((element: any) => {
                assert(is<Container>(element));
            });
        });
    });

    // That's how typescripts validates these objects.
    describe('is<Container with T | undefined>', () => {
        it('should be truthy on valid object with defined field', () => {
            assert(is<WeirdContainer<number>>({field: 42}));
        });

        it('should be truthy on valid object with defined undefined field', () => {
            assert(is<WeirdContainer<number>>({field: undefined}));
        });

        it('should be falsy on invalid objects', () => {
            assert(!is<WeirdContainer<number>>({}));
        });
    });
});
