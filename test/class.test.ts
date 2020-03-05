import {assertType} from '../index';


export class UsefulObject {
    name:string = '';
    value:number = 0;
}

const wildObject = {name:'banana', value: 1};

const wilderObject = {name:'Gene Wilder', value: -1, pockets: ['chocolate']};

describe('Checking class type', () => {
    it('should be able to check wild objects against class definition', () => {
        assertType<UsefulObject>(wildObject);
        assertType<UsefulObject>(wilderObject);
    });
});