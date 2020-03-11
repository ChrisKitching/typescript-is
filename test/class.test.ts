import {assertType} from '../index';
import * as assert from 'assert';


export class UsefulObject {
    name:string = '';
    value:number = 0;
}

export class UsefulObjectWithConProps {
    constructor(
        public name:string,
        public value:number
    ) {
    }

    banana(jesus:'saves') {
        throw Error('Religion is under specified.');
    }
}

export class AStreamObject {
    stream: any;
    boats: string[] = ['string'];
}

const wildObject = {name:'banana', value: 1};

const wilderObject = {name:'Gene Wilder', value: -1, pockets: ['chocolate']};

enum MyEnum {
    Test,
    BadTest
}

export class ClassWithEnum {
    id = MyEnum.Test;
}

export class ClassWithOtherEnum {
    id = MyEnum.BadTest;
}

describe('Checking class type', () => {
    it('should be able to check wild objects against class definition', () => {
        assertType<UsefulObject>(wildObject);
        assertType<UsefulObject>(wilderObject);
    });

    it('understands properties defined in constructor and ignores random methods', () => {
        assertType<UsefulObjectWithConProps>(wildObject);
        assertType<UsefulObjectWithConProps>(wilderObject);
    });

    it('should screech at incompatible types', () => {
        try {
            assertType<AStreamObject>(wilderObject);
            assert.fail('Did not screech');
        } catch (e) {}
    });

    it('should infer simple property types', () => {
        const o = { id: 0 };

        assertType<ClassWithEnum>(o);

        try {
            assertType<ClassWithOtherEnum>(o);
            assert.fail('Did not screech');
        } catch (e) {}
    });
});