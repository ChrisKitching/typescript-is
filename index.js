const util = require("util");

let defaultGetErrorObject = undefined;

function checkGetErrorObject(getErrorObject) {
    if (typeof getErrorObject !== 'function') {
        throw new Error('This module should not be used in runtime. Instead, use a transformer during compilation.');
    }
}

const assertionsMetadataKey = Symbol('assertions');

class TypeGuardError extends Error {
    constructor(errorObject) {
        super(errorObject.message);
        this.name = 'TypeGuardError';
        this.path = errorObject.path;
        this.reason = errorObject.reason;
    }
}

function AssertType(assertion, options = {}) {
    require('reflect-metadata');
    return function (target, propertyKey, parameterIndex) {
        const assertions = Reflect.getOwnMetadata(assertionsMetadataKey, target, propertyKey) || [];
        assertions[parameterIndex] = { assertion, options };
        Reflect.defineMetadata(assertionsMetadataKey, assertions, target, propertyKey);
    };
}

function ValidateClass(errorConstructor = TypeGuardError) {
    require('reflect-metadata');
    return function (target) {
        for (const propertyKey of Object.getOwnPropertyNames(target.prototype)) {
            const assertions = Reflect.getOwnMetadata(assertionsMetadataKey, target.prototype, propertyKey);
            if (assertions) {
                const originalMethod = target.prototype[propertyKey];
                target.prototype[propertyKey] = function (...args) {
                    for (let i = 0; i < assertions.length; i++) {
                        const errorObject = assertions[i].assertion(args[i]);
                        if (!errorObject) {
                            throw new errorConstructor(errorObject);
                        }
                    }
                    return originalMethod.apply(this, args);
                };
            }
        }
    };
}

function is(obj, getErrorObject = defaultGetErrorObject) {
    checkGetErrorObject(getErrorObject);
    return getErrorObject(obj);
}

function assertType(obj, err = new TypeGuardError(
  {message:`Type guard failure: tried to assertType of ${
      util.inspect(obj, {depth: 100, colors: true})}`}),
      getErrorObject = defaultGetErrorObject) {
    checkGetErrorObject(getErrorObject);
    if (!getErrorObject(obj)) {
        throw err;
    }
}

function debugAssertType(obj, err = new TypeGuardError(
  {message:`Type guard failure: tried to assertType of ${
    util.inspect(obj, {depth: 100, colors: true})}}`}),
                    getErrorObject = defaultGetErrorObject) {
    checkGetErrorObject(getErrorObject);
    if (!getErrorObject(obj)) {
        throw err;
    }
}

function createIs(getErrorObject = defaultGetErrorObject) {
    checkGetErrorObject(getErrorObject);
    return (obj) => is(obj, getErrorObject);
}

function createAssertType(getErrorObject = defaultGetErrorObject) {
    checkGetErrorObject(getErrorObject);
    return (obj) => assertType(obj, undefined, getErrorObject);
}

function setDefaultGetErrorObject(getErrorObject) {
    defaultGetErrorObject = getErrorObject;
}

module.exports = {
    is,
    assertType,
    debugAssertType,
    createIs,
    createAssertType,
    equals: is,
    createEquals: createIs,
    assertEquals: assertType,
    createAssertEquals: createAssertType,
    AssertType,
    ValidateClass,
    TypeGuardError,
    setDefaultGetErrorObject
};
