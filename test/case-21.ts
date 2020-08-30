import { strict as assert } from 'assert';
import { is, assertType } from '../index';


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
});


describe('is on complex things with Optional and Nullable fields', () => {
    describe('assertType<Container> on generated objects', () => {
        it('should be truthy on valid objects', () => {
            validContainerValues.forEach((element: any) => {
                assert(is<Container>(element));
            });
        });
    });
});
