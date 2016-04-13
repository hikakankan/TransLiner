"use strict";
var ts = require("typescript");
function visitNode(cbNode, node) {
    if (node) {
        return cbNode(node);
    }
}
function visitNodeArray(cbNodes, nodes) {
    if (nodes) {
        return cbNodes(nodes);
    }
}
function visitEachNode(cbNode, nodes) {
    if (nodes) {
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            var result = cbNode(node);
            if (result) {
                return result;
            }
        }
    }
}
function forEachChild(node, cbNode, cbNodeArray, col, syntaxKindToObject) {
    if (!node) {
        return;
    }
    // The visitXXX functions could be written as local functions that close over the cbNode and cbNodeArray
    // callback parameters, but that causes a closure allocation for each invocation with noticeable effects
    // on performance.
    var visitNodes = cbNodeArray ? visitNodeArray : visitEachNode;
    var cbNodes = cbNodeArray || cbNode;
    switch (node.kind) {
        case ts.SyntaxKind.QualifiedName:
            return col([visitNode(cbNode, node.left),
                visitNode(cbNode, node.right)]);
        case ts.SyntaxKind.TypeParameter:
            return col([visitNode(cbNode, node.name),
                visitNode(cbNode, node.constraint),
                visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.ShorthandPropertyAssignment:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.name),
                visitNode(cbNode, node.questionToken),
                visitNode(cbNode, node.equalsToken),
                visitNode(cbNode, node.objectAssignmentInitializer)]);
        case ts.SyntaxKind.Parameter:
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.PropertySignature:
        case ts.SyntaxKind.PropertyAssignment:
        case ts.SyntaxKind.VariableDeclaration:
        case ts.SyntaxKind.BindingElement:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.propertyName),
                visitNode(cbNode, node.dotDotDotToken),
                visitNode(cbNode, node.name),
                visitNode(cbNode, node.questionToken),
                visitNode(cbNode, node.type),
                visitNode(cbNode, node.initializer)]);
        case ts.SyntaxKind.FunctionType:
        case ts.SyntaxKind.ConstructorType:
        case ts.SyntaxKind.CallSignature:
        case ts.SyntaxKind.ConstructSignature:
        case ts.SyntaxKind.IndexSignature:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNodes(cbNodes, node.typeParameters),
                visitNodes(cbNodes, node.parameters),
                visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.MethodSignature:
        case ts.SyntaxKind.Constructor:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.ArrowFunction:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.asteriskToken),
                visitNode(cbNode, node.name),
                visitNode(cbNode, node.questionToken),
                visitNodes(cbNodes, node.typeParameters),
                visitNodes(cbNodes, node.parameters),
                visitNode(cbNode, node.type),
                visitNode(cbNode, node.equalsGreaterThanToken),
                visitNode(cbNode, node.body)]);
        case ts.SyntaxKind.TypeReference:
            return col([visitNode(cbNode, node.typeName),
                visitNodes(cbNodes, node.typeArguments)]);
        case ts.SyntaxKind.TypePredicate:
            return col([visitNode(cbNode, node.parameterName),
                visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.TypeQuery:
            return col([visitNode(cbNode, node.exprName)]);
        case ts.SyntaxKind.TypeLiteral:
            return col([visitNodes(cbNodes, node.members)]);
        case ts.SyntaxKind.ArrayType:
            return col([visitNode(cbNode, node.elementType)]);
        case ts.SyntaxKind.TupleType:
            return col([visitNodes(cbNodes, node.elementTypes)]);
        case ts.SyntaxKind.UnionType:
        case ts.SyntaxKind.IntersectionType:
            return col([visitNodes(cbNodes, node.types)]);
        case ts.SyntaxKind.ParenthesizedType:
            return col([visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.ObjectBindingPattern:
        case ts.SyntaxKind.ArrayBindingPattern:
            return col([visitNodes(cbNodes, node.elements)]);
        case ts.SyntaxKind.ArrayLiteralExpression:
            return col([visitNodes(cbNodes, node.elements)]);
        case ts.SyntaxKind.ObjectLiteralExpression:
            return col([visitNodes(cbNodes, node.properties)]);
        case ts.SyntaxKind.PropertyAccessExpression:
            return col([visitNode(cbNode, node.expression),
                visitNode(cbNode, node.dotToken),
                visitNode(cbNode, node.name)]);
        case ts.SyntaxKind.ElementAccessExpression:
            return col([visitNode(cbNode, node.expression),
                visitNode(cbNode, node.argumentExpression)]);
        case ts.SyntaxKind.CallExpression:
        case ts.SyntaxKind.NewExpression:
            return col([visitNode(cbNode, node.expression),
                visitNodes(cbNodes, node.typeArguments),
                visitNodes(cbNodes, node.arguments)]);
        case ts.SyntaxKind.TaggedTemplateExpression:
            return col([visitNode(cbNode, node.tag),
                visitNode(cbNode, node.template)]);
        case ts.SyntaxKind.TypeAssertionExpression:
            return col([visitNode(cbNode, node.type),
                visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.ParenthesizedExpression:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.DeleteExpression:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.TypeOfExpression:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.VoidExpression:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.PrefixUnaryExpression:
            return col([syntaxKindToObject(node.operator),
                visitNode(cbNode, node.operand)]);
        case ts.SyntaxKind.YieldExpression:
            return col([visitNode(cbNode, node.asteriskToken),
                visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.AwaitExpression:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.PostfixUnaryExpression:
            return col([visitNode(cbNode, node.operand),
                syntaxKindToObject(node.operator)]);
        case ts.SyntaxKind.BinaryExpression:
            return col([visitNode(cbNode, node.left),
                visitNode(cbNode, node.operatorToken),
                visitNode(cbNode, node.right)]);
        case ts.SyntaxKind.AsExpression:
            return col([visitNode(cbNode, node.expression),
                visitNode(cbNode, node.type)]);
        //case ts.SyntaxKind.NonNullExpression:
        //    return col([visitNode(cbNode, (<ts.NonNullExpression>node).expression)]);
        case ts.SyntaxKind.ConditionalExpression:
            return col([visitNode(cbNode, node.condition),
                visitNode(cbNode, node.questionToken),
                visitNode(cbNode, node.whenTrue),
                visitNode(cbNode, node.colonToken),
                visitNode(cbNode, node.whenFalse)]);
        case ts.SyntaxKind.SpreadElementExpression:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.Block:
        case ts.SyntaxKind.ModuleBlock:
            return col([visitNodes(cbNodes, node.statements)]);
        case ts.SyntaxKind.SourceFile:
            return col([visitNodes(cbNodes, node.statements),
                visitNode(cbNode, node.endOfFileToken)]);
        case ts.SyntaxKind.VariableStatement:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.declarationList)]);
        case ts.SyntaxKind.VariableDeclarationList:
            return col([visitNodes(cbNodes, node.declarations)]);
        case ts.SyntaxKind.ExpressionStatement:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.IfStatement:
            return col([visitNode(cbNode, node.expression),
                visitNode(cbNode, node.thenStatement),
                visitNode(cbNode, node.elseStatement)]);
        case ts.SyntaxKind.DoStatement:
            return col([visitNode(cbNode, node.statement),
                visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.WhileStatement:
            return col([visitNode(cbNode, node.expression),
                visitNode(cbNode, node.statement)]);
        case ts.SyntaxKind.ForStatement:
            return col([visitNode(cbNode, node.initializer),
                visitNode(cbNode, node.condition),
                visitNode(cbNode, node.incrementor),
                visitNode(cbNode, node.statement)]);
        case ts.SyntaxKind.ForInStatement:
            return col([visitNode(cbNode, node.initializer),
                visitNode(cbNode, node.expression),
                visitNode(cbNode, node.statement)]);
        case ts.SyntaxKind.ForOfStatement:
            return col([visitNode(cbNode, node.initializer),
                visitNode(cbNode, node.expression),
                visitNode(cbNode, node.statement)]);
        case ts.SyntaxKind.ContinueStatement:
        case ts.SyntaxKind.BreakStatement:
            return col([visitNode(cbNode, node.label)]);
        case ts.SyntaxKind.ReturnStatement:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.WithStatement:
            return col([visitNode(cbNode, node.expression),
                visitNode(cbNode, node.statement)]);
        case ts.SyntaxKind.SwitchStatement:
            return col([visitNode(cbNode, node.expression),
                visitNode(cbNode, node.caseBlock)]);
        case ts.SyntaxKind.CaseBlock:
            return col([visitNodes(cbNodes, node.clauses)]);
        case ts.SyntaxKind.CaseClause:
            return col([visitNode(cbNode, node.expression),
                visitNodes(cbNodes, node.statements)]);
        case ts.SyntaxKind.DefaultClause:
            return col([visitNodes(cbNodes, node.statements)]);
        case ts.SyntaxKind.LabeledStatement:
            return col([visitNode(cbNode, node.label),
                visitNode(cbNode, node.statement)]);
        case ts.SyntaxKind.ThrowStatement:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.TryStatement:
            return col([visitNode(cbNode, node.tryBlock),
                visitNode(cbNode, node.catchClause),
                visitNode(cbNode, node.finallyBlock)]);
        case ts.SyntaxKind.CatchClause:
            return col([visitNode(cbNode, node.variableDeclaration),
                visitNode(cbNode, node.block)]);
        case ts.SyntaxKind.Decorator:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.ClassDeclaration:
        case ts.SyntaxKind.ClassExpression:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.name),
                visitNodes(cbNodes, node.typeParameters),
                visitNodes(cbNodes, node.heritageClauses),
                visitNodes(cbNodes, node.members)]);
        case ts.SyntaxKind.InterfaceDeclaration:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.name),
                visitNodes(cbNodes, node.typeParameters),
                visitNodes(cbNodes, node.heritageClauses),
                visitNodes(cbNodes, node.members)]);
        case ts.SyntaxKind.TypeAliasDeclaration:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.name),
                visitNodes(cbNodes, node.typeParameters),
                visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.EnumDeclaration:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.name),
                visitNodes(cbNodes, node.members)]);
        case ts.SyntaxKind.EnumMember:
            return col([visitNode(cbNode, node.name),
                visitNode(cbNode, node.initializer)]);
        case ts.SyntaxKind.ModuleDeclaration:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.name),
                visitNode(cbNode, node.body)]);
        case ts.SyntaxKind.ImportEqualsDeclaration:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.name),
                visitNode(cbNode, node.moduleReference)]);
        case ts.SyntaxKind.ImportDeclaration:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.importClause),
                visitNode(cbNode, node.moduleSpecifier)]);
        case ts.SyntaxKind.ImportClause:
            return col([visitNode(cbNode, node.name),
                visitNode(cbNode, node.namedBindings)]);
        //case ts.SyntaxKind.GlobalModuleExportDeclaration:
        //    return col([visitNode(cbNode, (<ts.GlobalModuleExportDeclaration>node).name)]);
        case ts.SyntaxKind.NamespaceImport:
            return col([visitNode(cbNode, node.name)]);
        case ts.SyntaxKind.NamedImports:
        case ts.SyntaxKind.NamedExports:
            return col([visitNodes(cbNodes, node.elements)]);
        case ts.SyntaxKind.ExportDeclaration:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.exportClause),
                visitNode(cbNode, node.moduleSpecifier)]);
        case ts.SyntaxKind.ImportSpecifier:
        case ts.SyntaxKind.ExportSpecifier:
            return col([visitNode(cbNode, node.propertyName),
                visitNode(cbNode, node.name)]);
        case ts.SyntaxKind.ExportAssignment:
            return col([visitNodes(cbNodes, node.decorators),
                visitNodes(cbNodes, node.modifiers),
                visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.TemplateExpression:
            return col([visitNode(cbNode, node.head), visitNodes(cbNodes, node.templateSpans)]);
        case ts.SyntaxKind.TemplateSpan:
            return col([visitNode(cbNode, node.expression), visitNode(cbNode, node.literal)]);
        case ts.SyntaxKind.ComputedPropertyName:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.HeritageClause:
            return col([visitNodes(cbNodes, node.types)]);
        case ts.SyntaxKind.ExpressionWithTypeArguments:
            return col([visitNode(cbNode, node.expression),
                visitNodes(cbNodes, node.typeArguments)]);
        case ts.SyntaxKind.ExternalModuleReference:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.MissingDeclaration:
            return col([visitNodes(cbNodes, node.decorators)]);
        case ts.SyntaxKind.JsxElement:
            return col([visitNode(cbNode, node.openingElement),
                visitNodes(cbNodes, node.children),
                visitNode(cbNode, node.closingElement)]);
        case ts.SyntaxKind.JsxSelfClosingElement:
        case ts.SyntaxKind.JsxOpeningElement:
            return col([visitNode(cbNode, node.tagName),
                visitNodes(cbNodes, node.attributes)]);
        case ts.SyntaxKind.JsxAttribute:
            return col([visitNode(cbNode, node.name),
                visitNode(cbNode, node.initializer)]);
        case ts.SyntaxKind.JsxSpreadAttribute:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.JsxExpression:
            return col([visitNode(cbNode, node.expression)]);
        case ts.SyntaxKind.JsxClosingElement:
            return col([visitNode(cbNode, node.tagName)]);
        case ts.SyntaxKind.JSDocTypeExpression:
            return col([visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.JSDocUnionType:
            return col([visitNodes(cbNodes, node.types)]);
        case ts.SyntaxKind.JSDocTupleType:
            return col([visitNodes(cbNodes, node.types)]);
        case ts.SyntaxKind.JSDocArrayType:
            return col([visitNode(cbNode, node.elementType)]);
        case ts.SyntaxKind.JSDocNonNullableType:
            return col([visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.JSDocNullableType:
            return col([visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.JSDocRecordType:
            return col([visitNodes(cbNodes, node.members)]);
        case ts.SyntaxKind.JSDocTypeReference:
            return col([visitNode(cbNode, node.name),
                visitNodes(cbNodes, node.typeArguments)]);
        case ts.SyntaxKind.JSDocOptionalType:
            return col([visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.JSDocFunctionType:
            return col([visitNodes(cbNodes, node.parameters),
                visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.JSDocVariadicType:
            return col([visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.JSDocConstructorType:
            return col([visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.JSDocThisType:
            return col([visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.JSDocRecordMember:
            return col([visitNode(cbNode, node.name),
                visitNode(cbNode, node.type)]);
        case ts.SyntaxKind.JSDocComment:
            return col([visitNodes(cbNodes, node.tags)]);
        case ts.SyntaxKind.JSDocParameterTag:
            return col([visitNode(cbNode, node.preParameterName),
                visitNode(cbNode, node.typeExpression),
                visitNode(cbNode, node.postParameterName)]);
        case ts.SyntaxKind.JSDocReturnTag:
            return col([visitNode(cbNode, node.typeExpression)]);
        case ts.SyntaxKind.JSDocTypeTag:
            return col([visitNode(cbNode, node.typeExpression)]);
        case ts.SyntaxKind.JSDocTemplateTag:
            return col([visitNodes(cbNodes, node.typeParameters)]);
    }
}
exports.forEachChild = forEachChild;
//# sourceMappingURL=convert.js.map