import * as path from 'path';
import * as ts from 'typescript';
import { VisitorContext, PartialVisitorContext } from './visitor-context';
import { visitType, visitUndefinedOrType, visitShortCircuit } from './visitor-type-check';
import * as VisitorUtils from './visitor-utils';
import { sliceMapValues } from './utils';

function createArrowFunction(type: ts.Type, optional: boolean, partialVisitorContext: PartialVisitorContext) {
    const functionMap: VisitorContext['functionMap'] = new Map();
    const functionNames: VisitorContext['functionNames'] = new Set();
    const visitorContext = { ...partialVisitorContext, functionNames, functionMap };
    const functionName = partialVisitorContext.options.shortCircuit
        ? visitShortCircuit(visitorContext)
        : (optional
            ? visitUndefinedOrType(type, visitorContext)
            : visitType(type, visitorContext)
        );

    const declarations = sliceMapValues(functionMap);

    return ts.createArrowFunction(
        undefined,
        undefined,
        [
            ts.createParameter(
                undefined,
                undefined,
                undefined,
                VisitorUtils.objectIdentifier,
                undefined,
                ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
            )
        ],
        undefined,
        undefined,
        ts.createBlock([
            ...declarations,
            ts.createReturn(ts.createCall(ts.createIdentifier(functionName), undefined, [VisitorUtils.objectIdentifier]))
        ])
    );
}

function transformDecorator(node: ts.Decorator, parameterType: ts.Type, optional: boolean, visitorContext: PartialVisitorContext): ts.Decorator {
    if (ts.isCallExpression(node.expression)) {
        const signature = visitorContext.checker.getResolvedSignature(node.expression);
        if (
            signature !== undefined
            && signature.declaration !== undefined
            && path.resolve(signature.declaration.getSourceFile().fileName) === path.resolve(path.join(__dirname, '..', '..', 'index.d.ts'))
            && node.expression.arguments.length <= 1
        ) {
            const arrowFunction: ts.Expression = createArrowFunction(parameterType, optional, visitorContext);
            const expression = ts.updateCall(
                node.expression,
                node.expression.expression,
                undefined,
                [arrowFunction].concat(node.expression.arguments)
            );
            return ts.updateDecorator(
                node,
                expression
            );
        }
    }
    return node;
}

export function transformNode(node: ts.Node, visitorContext: PartialVisitorContext): ts.Node {
    if (ts.isParameter(node) && node.type !== undefined && node.decorators !== undefined) {
        const type = visitorContext.checker.getTypeFromTypeNode(node.type);
        const required = !node.initializer && !node.questionToken;
        const mappedDecorators = node.decorators.map((decorator) => transformDecorator(decorator, type, !required, visitorContext));
        return ts.updateParameter(
            node,
            mappedDecorators,
            node.modifiers,
            node.dotDotDotToken,
            node.name,
            node.questionToken,
            node.type,
            node.initializer
        );
    } else if (ts.isCallExpression(node)) {
        const signature = visitorContext.checker.getResolvedSignature(node);
        if (
            signature !== undefined
            && signature.declaration !== undefined
            && path.resolve(signature.declaration.getSourceFile().fileName) === path.resolve(path.join(__dirname, '..', '..', 'index.d.ts'))
            && node.typeArguments !== undefined
            && node.typeArguments.length === 1
        ) {
            const name = visitorContext.checker.getTypeAtLocation(signature.declaration).symbol.name;
            const isEquals = name === 'equals' || name === 'createEquals' || name === 'assertEquals' || name === 'createAssertEquals';

            const typeArgument = node.typeArguments[0];
            const type = visitorContext.checker.getTypeFromTypeNode(typeArgument);
            const arrowFunction = createArrowFunction(
                type,
                false,
                {
                    ...visitorContext,
                    options: {
                        ...visitorContext.options,
                        disallowSuperfluousObjectProperties: isEquals || visitorContext.options.disallowSuperfluousObjectProperties
                    }
                }
            );

            return ts.updateCall(
                node,
                node.expression,
                node.typeArguments,
                [
                    ...node.arguments,
                    arrowFunction
                ]
            );
        }
    }
    return node;
}
