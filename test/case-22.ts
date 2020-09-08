import { strict as assert } from 'assert';
import { is, assertType } from '../index';


function mkErr(): Error {
    return new Error('Test');
}

describe('assertType<Buffer>', () => {
    it('should not throw an error on valid Buffers', () => {
        assertType<Buffer>(Buffer.alloc(1));
        assertType<Buffer>(Buffer.from('text'));
        assertType<Buffer>(Buffer.from([1, 2]));
    });

    it('should throw an error on invalid Buffers', () => {
        assert.throws(() => assertType<Buffer>({}, mkErr), mkErr());
        assert.throws(() => assertType<Buffer>(null, mkErr), mkErr());
        assert.throws(() => assertType<Buffer>(undefined, mkErr), mkErr());
        assert.throws(() => assertType<Buffer>(Array(10), mkErr), mkErr());
        assert.throws(() => assertType<Buffer>(new Int8Array(10), mkErr), mkErr());
        assert.throws(() => assertType<Buffer>(Int8Array.from([1, 2]), mkErr), mkErr());
    });
});


describe('is<Buffer>', () => {
    it('should be truthy on valid Buffers', () => {
        assert(is<Buffer>(Buffer.alloc(1)));
        assert(is<Buffer>(Buffer.from('text')));
        assert(is<Buffer>(Buffer.from([1, 2])));
    });

    it('should be falsy on invalid Buffers', () => {
        assert(!is<Buffer>({}));
        assert(!is<Buffer>(null));
        assert(!is<Buffer>(undefined));
        assert(!is<Buffer>(Array(10)));
        assert(!is<Buffer>(new Int8Array(10)));
        assert(!is<Buffer>(Int8Array.from([1, 2])));
    });
});
