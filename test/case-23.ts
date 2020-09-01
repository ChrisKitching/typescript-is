import { strict as assert } from 'assert';
import { is, assertType } from '../index';


function mkErr(): Error {
    return new Error('Test');
}

describe('assertType<Typed Array>', () => {
    it('should not throw an error on valid checks', () => {
        assertType<Uint8Array>(new Uint8Array(1));
        assertType<Uint16Array>(new Uint16Array(1));
        assertType<Uint32Array>(new Uint32Array(1));

        assertType<Uint8ClampedArray>(new Uint8ClampedArray(1));

        assertType<Int8Array>(new Int8Array(1));
        assertType<Int16Array>(new Int16Array(1));
        assertType<Int32Array>(new Int32Array(1));

        assertType<Float32Array>(new Float32Array(1));
        assertType<Float64Array>(new Float64Array(1));

        assertType<BigInt64Array>(new BigInt64Array(1));
        assertType<BigUint64Array>(new BigUint64Array(1));
    });

    it('should throw an error on invalid checks', () => {
        assert.throws(() => assertType<Int8Array>(new Int16Array(1), mkErr()), mkErr());
        assert.throws(() => assertType<Int8Array>(new Uint8Array(1), mkErr()), mkErr());
        assert.throws(() => assertType<Int8Array>(Buffer.alloc(1), mkErr()), mkErr());

        assert.throws(() => assertType<Int8Array>({}, mkErr()), mkErr());
        assert.throws(() => assertType<Int8Array>('text', mkErr()), mkErr());
        assert.throws(() => assertType<Int8Array>(42, mkErr()), mkErr());
        assert.throws(() => assertType<Int8Array>(mkErr(), mkErr()), mkErr());
        assert.throws(() => assertType<Int8Array>(mkErr, mkErr()), mkErr());
    });
});


describe('is<Buffer>', () => {
    it('should be truthy on valid checks', () => {
        assert(is<Uint8Array>(new Uint8Array(1)));
        assert(is<Uint16Array>(new Uint16Array(1)));
        assert(is<Uint32Array>(new Uint32Array(1)));

        assert(is<Uint8ClampedArray>(new Uint8ClampedArray(1)));

        assert(is<Int8Array>(new Int8Array(1)));
        assert(is<Int16Array>(new Int16Array(1)));
        assert(is<Int32Array>(new Int32Array(1)));

        assert(is<Float32Array>(new Float32Array(1)));
        assert(is<Float64Array>(new Float64Array(1)));

        assert(is<BigInt64Array>(new BigInt64Array(1)));
        assert(is<BigUint64Array>(new BigUint64Array(1)));
    });

    it('should be falsy on invalid checks', () => {
        assert(!is<Int8Array>(new Int16Array(1)));
        assert(!is<Int8Array>(new Uint8Array(1)));
        assert(!is<Int8Array>(Buffer.alloc(1)));

        assert(!is<Int8Array>({}));
        assert(!is<Int8Array>('text'));
        assert(!is<Int8Array>(42));
        assert(!is<Int8Array>(mkErr()));
        assert(!is<Int8Array>(mkErr));
    });
});
