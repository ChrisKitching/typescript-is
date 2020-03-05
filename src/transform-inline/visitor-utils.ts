import * as ts from 'typescript';
import {ReturnStatement, SyntaxKind} from 'typescript';
import * as tsutils from 'tsutils/typeguard/3.0';
import {VisitorContext} from './visitor-context';
import {Reason} from '../../index';

export const objectIdentifier = ts.createIdentifier('object');
const keyIdentifier = ts.createIdentifier('key');

export function checkIsClass(type: ts.ObjectType, visitorContext: VisitorContext) {
    // Hacky: using internal TypeScript API.
    if ('isArrayType' in visitorContext.checker && (visitorContext.checker as any).isArrayType(type)) {
        return false;
    }
    if ('isArrayLikeType' in visitorContext.checker && (visitorContext.checker as any).isArrayLikeType(type)) {
        return false;
    }

    let hasConstructSignatures = false;
    if (type.symbol !== undefined && type.symbol.valueDeclaration !== undefined && ts.isVariableDeclaration(type.symbol.valueDeclaration) && type.symbol.valueDeclaration.type) {
        const variableDeclarationType = visitorContext.checker.getTypeAtLocation(type.symbol.valueDeclaration.type);
        const constructSignatures = variableDeclarationType.getConstructSignatures();
        hasConstructSignatures = constructSignatures.length >= 1;
    }

    return type.isClass() || hasConstructSignatures;
}

export function setFunctionIfNotExists(name: string, visitorContext: VisitorContext, factory: () => ts.FunctionDeclaration) {
    if (!visitorContext.functionNames.has(name)) {
        visitorContext.functionNames.add(name);
        visitorContext.functionMap.set(name, factory());
    }
    return name;
}

export function getPropertyInfo(symbol: ts.Symbol, visitorContext: VisitorContext) {
    const name: string | undefined = symbol.name;
    if (name === undefined) {
        throw new Error('Missing name in property symbol.');
    }
    if ('valueDeclaration' in symbol) {
        const valueDeclaration = symbol.valueDeclaration;
        if (!ts.isPropertyDeclaration(valueDeclaration) &&
            !ts.isParameter(valueDeclaration) && // a public parameter in constructor
            !ts.isPropertySignature(valueDeclaration) &&
            !ts.isMethodDeclaration(valueDeclaration) && !ts.isMethodSignature(valueDeclaration)) {
            throw new Error('Unsupported declaration kind: ' + valueDeclaration.kind);
        }
        const isMethod = ts.isMethodDeclaration(valueDeclaration) || ts.isMethodSignature(valueDeclaration)
            || valueDeclaration.type !== undefined && ts.isFunctionTypeNode(valueDeclaration.type);
        if (isMethod && !visitorContext.options.ignoreMethods) {
            throw new Error('Encountered a method declaration, but methods are not supported. Issue: https://github.com/woutervh-/typescript-is/issues/5');
        }
        let propertyType: ts.Type | undefined = undefined;
        if (valueDeclaration.type === undefined) {
            if (!isMethod) {
                throw new Error('Seems the property has an undefined type.'+
                ' This usually means you meant for typescript to infer it,'+
                ' however typescript-is cannot do this. Please add a type.');
            }
        } else {
            propertyType = visitorContext.checker.getTypeFromTypeNode(valueDeclaration.type);
        }
        return {
            name,
            type: propertyType,
            isMethod,
            isSymbol: name.startsWith('__@'),
            optional: !!valueDeclaration.questionToken
        };
    } else {
        const propertyType = (symbol as { type?: ts.Type }).type;
        const optional = ((symbol as ts.Symbol).flags & ts.SymbolFlags.Optional) !== 0;
        if (propertyType !== undefined) {
            return {
                name,
                type: propertyType,
                isMethod: false,
                isSymbol: name.startsWith('__@'),
                optional
            };
        } else {
            throw new Error('Expected a valueDeclaration or a property type.');
        }
    }
}

export function getTypeReferenceMapping(type: ts.TypeReference, visitorContext: VisitorContext) {
    const mapping: Map<ts.Type, ts.Type> = new Map();
    (function checkBaseTypes(type: ts.TypeReference) {
        if (tsutils.isInterfaceType(type.target)) {
            const baseTypes = visitorContext.checker.getBaseTypes(type.target);
            for (const baseType of baseTypes) {
                if (tsutils.isTypeReference(baseType) && baseType.target.typeParameters !== undefined && baseType.typeArguments !== undefined) {
                    const typeParameters = baseType.target.typeParameters;
                    const typeArguments = baseType.typeArguments;
                    for (let i = 0; i < typeParameters.length; i++) {
                        if (typeParameters[i] !== typeArguments[i]) {
                            mapping.set(typeParameters[i], typeArguments[i]);
                        }
                    }
                    checkBaseTypes(baseType);
                }
            }
        }
    })(type);
    if (type.target.typeParameters !== undefined && type.typeArguments !== undefined) {
        const typeParameters = type.target.typeParameters;
        const typeArguments = type.typeArguments;
        for (let i = 0; i < typeParameters.length; i++) {
            if (typeParameters[i] !== typeArguments[i]) {
                mapping.set(typeParameters[i], typeArguments[i]);
            }
        }
    }
    return mapping;
}

export function getResolvedTypeParameter(type: ts.Type, visitorContext: VisitorContext) {
    let mappedType: ts.Type | undefined;
    for (let i = visitorContext.typeMapperStack.length - 1; i >= 0; i--) {
        mappedType = visitorContext.typeMapperStack[i].get(type);
        if (mappedType !== undefined) {
            break;
        }
    }
    return mappedType || type.getDefault();
}

export function getStringFunction(visitorContext: VisitorContext) {
    const name = '_string';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return createAssertionFunction(
            ts.createStrictEquality(
                ts.createTypeOf(objectIdentifier),
                ts.createStringLiteral('string')
            ),
            { type: 'string' },
            name
        );
    });
}

export function getBooleanFunction(visitorContext: VisitorContext) {
    const name = '_boolean';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return createAssertionFunction(
            ts.createStrictEquality(
                ts.createTypeOf(objectIdentifier),
                ts.createStringLiteral('boolean')
            ),
            { type: 'boolean' },
            name
        );
    });
}

export function getBigIntFunction(visitorContext: VisitorContext) {
    const name = '_bigint';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return createAssertionFunction(
            ts.createStrictEquality(
                ts.createTypeOf(objectIdentifier),
                ts.createStringLiteral('bigint')
            ),
            { type: 'big-int' },
            name
        );
    });
}

export function getNumberFunction(visitorContext: VisitorContext) {
    const name = '_number';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return createAssertionFunction(
            ts.createStrictEquality(
                ts.createTypeOf(objectIdentifier),
                ts.createStringLiteral('number')
            ),
            { type: 'number' },
            name
        );
    });
}

export function getUndefinedFunction(visitorContext: VisitorContext) {
    const name = '_undefined';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return createAssertionFunction(
            ts.createStrictEquality(
                objectIdentifier,
                ts.createIdentifier('undefined')
            ),
            { type: 'undefined' },
            name
        );
    });
}

export function getNullFunction(visitorContext: VisitorContext) {
    const name = '_null';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return createAssertionFunction(
            ts.createStrictEquality(
                objectIdentifier,
                ts.createNull()
            ),
            { type: 'null' },
            name
        );
    });
}

export function getNeverFunction(visitorContext: VisitorContext) {
    const name = '_never';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return ts.createFunctionDeclaration(
            undefined,
            undefined,
            undefined,
            name,
            undefined,
            [
                ts.createParameter(undefined, undefined, undefined, objectIdentifier, undefined, undefined, undefined)
            ],
            undefined,
            ts.createBlock([
                ts.createReturn(ts.createFalse())
            ])
        );
    });
}

export function getUnknownFunction(visitorContext: VisitorContext) {
    const name = '_unknown';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return createAcceptingFunction(name);
    });
}

export function getAnyFunction(visitorContext: VisitorContext) {
    const name = '_any';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return createAcceptingFunction(name);
    });
}

export function getIgnoredTypeFunction(visitorContext: VisitorContext) {
    const name = '_ignore';
    return setFunctionIfNotExists(name, visitorContext, () => {
        return createAcceptingFunction(name);
    });
}

export function createBinaries(expressions: ts.Expression[], operator: ts.BinaryOperator, baseExpression?: ts.Expression) {
    if (expressions.length >= 1 || baseExpression === undefined) {
        return expressions.reduce((previous, expression) => ts.createBinary(previous, operator, expression));
    } else {
        return baseExpression;
    }
}

export function createAcceptingFunction(functionName: string) {
    return ts.createFunctionDeclaration(
        undefined,
        undefined,
        undefined,
        functionName,
        undefined,
        [],
        undefined,
        ts.createBlock([ts.createReturn(ts.createTrue())])
    );
}

export function createConjunctionFunction(functionNames: string[], functionName: string, functions: Map<string, ts.FunctionDeclaration>, extraStatements?: ts.Statement[]) {
    return ts.createFunctionDeclaration(
        undefined,
        undefined,
        undefined,
        functionName,
        undefined,
        [
            ts.createParameter(undefined, undefined, undefined, objectIdentifier, undefined, undefined, undefined)
        ],
        undefined,
        ts.createBlock([
            ...(extraStatements || []),
            ts.createReturn(
                createBinaries(
                    functionNames.map((n) => maybeInlinedCall(n, functions)),
                    ts.SyntaxKind.AmpersandAmpersandToken,
                    ts.createTrue()
                )
            )
        ])
    );
}

function tryGetTrivialBody(fn: ts.FunctionDeclaration): ts.Expression | undefined {
    const statements = fn.body?.statements;
    if (statements === undefined) {
        return undefined;
    }

    // We only know how to inline single-statement functions.
    if (statements.length > 1) {
        return undefined;
    }

    const statement = statements[0];
    if (statement.kind === SyntaxKind.ReturnStatement) {
        const returnStatement = statement as ReturnStatement;

        return returnStatement.expression;
    }

    return undefined;
}

export function maybeInlinedCall(n: string, functions: Map<string, ts.FunctionDeclaration>) {
    // If we have a function definition, have a go at inlining. Because this is completely
    // reasonable :D
    if (functions.has(n)) {
        const defn = functions.get(n)!;
        const body = tryGetTrivialBody(defn);
        if (body !== undefined) {
            return body;
        }
    }

    // Fall back to a call expression.
    return ts.createCall(
        ts.createIdentifier(n),
        undefined,
        [objectIdentifier]
    );
}

export function createDisjunctionFunction(functionNames: string[], functionName: string, functions: Map<string, ts.FunctionDeclaration>) {
    // This is actually a conjunction, but whatever.
    return ts.createFunctionDeclaration(
        undefined,
        undefined,
        undefined,
        functionName,
        undefined,
        [
            ts.createParameter(undefined, undefined, undefined, objectIdentifier, undefined, undefined, undefined)
        ],
        undefined,
        ts.createBlock([
            ts.createReturn(
                createBinaries(
                    functionNames.map((n) => maybeInlinedCall(n, functions)),
                    ts.SyntaxKind.BarBarToken,
                    ts.createTrue()
                )
            )
        ])
    );
}

export function createAssertionFunction(successCondition: ts.Expression, expected: Reason, functionName: string) {
    return ts.createFunctionDeclaration(
        undefined,
        undefined,
        undefined,
        functionName,
        undefined,
        [
            ts.createParameter(undefined, undefined, undefined, objectIdentifier, undefined, undefined, undefined)
        ],
        undefined,
        ts.createBlock([
            ts.createReturn(successCondition)
        ])
    );
}

export function createSuperfluousPropertiesLoop(propertyNames: string[]) {
    return ts.createForOf(
        undefined,
        ts.createVariableDeclarationList(
            [ts.createVariableDeclaration(keyIdentifier, undefined, undefined)],
            ts.NodeFlags.Const
        ),
        ts.createCall(ts.createPropertyAccess(ts.createIdentifier('Object'), 'keys'), undefined, [objectIdentifier]),
        ts.createBlock([
            ts.createIf(
                createBinaries(
                    propertyNames.map((propertyName) => ts.createStrictInequality(keyIdentifier, ts.createStringLiteral(propertyName))),
                    ts.SyntaxKind.AmpersandAmpersandToken,
                    ts.createTrue()
                ),
                ts.createReturn(ts.createFalse())
            )
        ])
    );
}

export function isBigIntType(type: ts.Type) {
    if ('BigInt' in ts.TypeFlags) {
        return (ts.TypeFlags as any).BigInt & type.flags;
    } else {
        return false;
    }
}
