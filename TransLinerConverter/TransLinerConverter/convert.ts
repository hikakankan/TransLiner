import * as ts from "typescript";

    function visitNode<T>(cbNode: (node: ts.Node) => T, node: ts.Node): T {
        if (node) {
            return cbNode(node);
        }
    }

    function visitNodeArray<T>(cbNodes: (nodes: ts.Node[]) => T, nodes: ts.Node[]) {
        if (nodes) {
            return cbNodes(nodes);
        }
    }

    function visitEachNode<T>(cbNode: (node: ts.Node) => T, nodes: ts.Node[]) {
        if (nodes) {
            for (const node of nodes) {
                const result = cbNode(node);
                if (result) {
                    return result;
                }
            }
        }
    }

    export function forEachChild<T>(node: ts.Node, cbNode: (node: ts.Node) => T, cbNodeArray?: (nodes: ts.Node[]) => T, col?: (objs: T[]) => T, syntaxKindToObject?: (syntaxKind: ts.SyntaxKind) => T): T {
        if (!node) {
            return;
        }
        // The visitXXX functions could be written as local functions that close over the cbNode and cbNodeArray
        // callback parameters, but that causes a closure allocation for each invocation with noticeable effects
        // on performance.
        const visitNodes: (cb: (node: ts.Node | ts.Node[]) => T, nodes: ts.Node[]) => T = cbNodeArray ? visitNodeArray : visitEachNode;
        const cbNodes = cbNodeArray || cbNode;
        switch (node.kind) {
            case ts.SyntaxKind.QualifiedName:
                return col([visitNode(cbNode, (<ts.QualifiedName>node).left),
                    visitNode(cbNode, (<ts.QualifiedName>node).right)]);
            case ts.SyntaxKind.TypeParameter:
                return col([visitNode(cbNode, (<ts.TypeParameterDeclaration>node).name),
                    visitNode(cbNode, (<ts.TypeParameterDeclaration>node).constraint),
                    visitNode(cbNode, (<ts.TypeParameterDeclaration>node).expression)]);
            case ts.SyntaxKind.ShorthandPropertyAssignment:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.ShorthandPropertyAssignment>node).name),
                    visitNode(cbNode, (<ts.ShorthandPropertyAssignment>node).questionToken),
                    visitNode(cbNode, (<ts.ShorthandPropertyAssignment>node).equalsToken),
                    visitNode(cbNode, (<ts.ShorthandPropertyAssignment>node).objectAssignmentInitializer)]);
            case ts.SyntaxKind.Parameter:
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.PropertySignature:
            case ts.SyntaxKind.PropertyAssignment:
            case ts.SyntaxKind.VariableDeclaration:
            case ts.SyntaxKind.BindingElement:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).propertyName),
                    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).dotDotDotToken),
                    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).name),
                    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).questionToken),
                    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).type),
                    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).initializer)]);
            case ts.SyntaxKind.FunctionType:
            case ts.SyntaxKind.ConstructorType:
            case ts.SyntaxKind.CallSignature:
            case ts.SyntaxKind.ConstructSignature:
            case ts.SyntaxKind.IndexSignature:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNodes(cbNodes, (<ts.SignatureDeclaration>node).typeParameters),
                    visitNodes(cbNodes, (<ts.SignatureDeclaration>node).parameters),
                    visitNode(cbNode, (<ts.SignatureDeclaration>node).type)]);
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
                    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).asteriskToken),
                    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).name),
                    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).questionToken),
                    visitNodes(cbNodes, (<ts.FunctionLikeDeclaration>node).typeParameters),
                    visitNodes(cbNodes, (<ts.FunctionLikeDeclaration>node).parameters),
                    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).type),
                    visitNode(cbNode, (<ts.ArrowFunction>node).equalsGreaterThanToken),
                    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).body)]);
            case ts.SyntaxKind.TypeReference:
                return col([visitNode(cbNode, (<ts.TypeReferenceNode>node).typeName),
                    visitNodes(cbNodes, (<ts.TypeReferenceNode>node).typeArguments)]);
            case ts.SyntaxKind.TypePredicate:
                return col([visitNode(cbNode, (<ts.TypePredicateNode>node).parameterName),
                    visitNode(cbNode, (<ts.TypePredicateNode>node).type)]);
            case ts.SyntaxKind.TypeQuery:
                return col([visitNode(cbNode, (<ts.TypeQueryNode>node).exprName)]);
            case ts.SyntaxKind.TypeLiteral:
                return col([visitNodes(cbNodes, (<ts.TypeLiteralNode>node).members)]);
            case ts.SyntaxKind.ArrayType:
                return col([visitNode(cbNode, (<ts.ArrayTypeNode>node).elementType)]);
            case ts.SyntaxKind.TupleType:
                return col([visitNodes(cbNodes, (<ts.TupleTypeNode>node).elementTypes)]);
            case ts.SyntaxKind.UnionType:
            case ts.SyntaxKind.IntersectionType:
                return col([visitNodes(cbNodes, (<ts.UnionOrIntersectionTypeNode>node).types)]);
            case ts.SyntaxKind.ParenthesizedType:
                return col([visitNode(cbNode, (<ts.ParenthesizedTypeNode>node).type)]);
            case ts.SyntaxKind.ObjectBindingPattern:
            case ts.SyntaxKind.ArrayBindingPattern:
                return col([visitNodes(cbNodes, (<ts.BindingPattern>node).elements)]);
            case ts.SyntaxKind.ArrayLiteralExpression:
                return col([visitNodes(cbNodes, (<ts.ArrayLiteralExpression>node).elements)]);
            case ts.SyntaxKind.ObjectLiteralExpression:
                return col([visitNodes(cbNodes, (<ts.ObjectLiteralExpression>node).properties)]);
            case ts.SyntaxKind.PropertyAccessExpression:
                return col([visitNode(cbNode, (<ts.PropertyAccessExpression>node).expression),
                    visitNode(cbNode, (<ts.PropertyAccessExpression>node).dotToken),
                    visitNode(cbNode, (<ts.PropertyAccessExpression>node).name)]);
            case ts.SyntaxKind.ElementAccessExpression:
                return col([visitNode(cbNode, (<ts.ElementAccessExpression>node).expression),
                    visitNode(cbNode, (<ts.ElementAccessExpression>node).argumentExpression)]);
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.NewExpression:
                return col([visitNode(cbNode, (<ts.CallExpression>node).expression),
                    visitNodes(cbNodes, (<ts.CallExpression>node).typeArguments),
                    visitNodes(cbNodes, (<ts.CallExpression>node).arguments)]);
            case ts.SyntaxKind.TaggedTemplateExpression:
                return col([visitNode(cbNode, (<ts.TaggedTemplateExpression>node).tag),
                    visitNode(cbNode, (<ts.TaggedTemplateExpression>node).template)]);
            case ts.SyntaxKind.TypeAssertionExpression:
                return col([visitNode(cbNode, (<ts.TypeAssertion>node).type),
                    visitNode(cbNode, (<ts.TypeAssertion>node).expression)]);
            case ts.SyntaxKind.ParenthesizedExpression:
                return col([visitNode(cbNode, (<ts.ParenthesizedExpression>node).expression)]);
            case ts.SyntaxKind.DeleteExpression:
                return col([visitNode(cbNode, (<ts.DeleteExpression>node).expression)]);
            case ts.SyntaxKind.TypeOfExpression:
                return col([visitNode(cbNode, (<ts.TypeOfExpression>node).expression)]);
            case ts.SyntaxKind.VoidExpression:
                return col([visitNode(cbNode, (<ts.VoidExpression>node).expression)]);
            case ts.SyntaxKind.PrefixUnaryExpression:
                return col([syntaxKindToObject((<ts.PrefixUnaryExpression>node).operator),
                    visitNode(cbNode, (<ts.PrefixUnaryExpression>node).operand)]);
            case ts.SyntaxKind.YieldExpression:
                return col([visitNode(cbNode, (<ts.YieldExpression>node).asteriskToken),
                    visitNode(cbNode, (<ts.YieldExpression>node).expression)]);
            case ts.SyntaxKind.AwaitExpression:
                return col([visitNode(cbNode, (<ts.AwaitExpression>node).expression)]);
            case ts.SyntaxKind.PostfixUnaryExpression:
                return col([visitNode(cbNode, (<ts.PostfixUnaryExpression>node).operand),
                    syntaxKindToObject((<ts.PostfixUnaryExpression>node).operator)]);
            case ts.SyntaxKind.BinaryExpression:
                return col([visitNode(cbNode, (<ts.BinaryExpression>node).left),
                    visitNode(cbNode, (<ts.BinaryExpression>node).operatorToken),
                    visitNode(cbNode, (<ts.BinaryExpression>node).right)]);
            case ts.SyntaxKind.AsExpression:
                return col([visitNode(cbNode, (<ts.AsExpression>node).expression),
                    visitNode(cbNode, (<ts.AsExpression>node).type)]);
            //case ts.SyntaxKind.NonNullExpression:
            //    return col([visitNode(cbNode, (<ts.NonNullExpression>node).expression)]);
            case ts.SyntaxKind.ConditionalExpression:
                return col([visitNode(cbNode, (<ts.ConditionalExpression>node).condition),
                    visitNode(cbNode, (<ts.ConditionalExpression>node).questionToken),
                    visitNode(cbNode, (<ts.ConditionalExpression>node).whenTrue),
                    visitNode(cbNode, (<ts.ConditionalExpression>node).colonToken),
                    visitNode(cbNode, (<ts.ConditionalExpression>node).whenFalse)]);
            case ts.SyntaxKind.SpreadElementExpression:
                return col([visitNode(cbNode, (<ts.SpreadElementExpression>node).expression)]);
            case ts.SyntaxKind.Block:
            case ts.SyntaxKind.ModuleBlock:
                return col([visitNodes(cbNodes, (<ts.Block>node).statements)]);
            case ts.SyntaxKind.SourceFile:
                return col([visitNodes(cbNodes, (<ts.SourceFile>node).statements),
                    visitNode(cbNode, (<ts.SourceFile>node).endOfFileToken)]);
            case ts.SyntaxKind.VariableStatement:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.VariableStatement>node).declarationList)]);
            case ts.SyntaxKind.VariableDeclarationList:
                return col([visitNodes(cbNodes, (<ts.VariableDeclarationList>node).declarations)]);
            case ts.SyntaxKind.ExpressionStatement:
                return col([visitNode(cbNode, (<ts.ExpressionStatement>node).expression)]);
            case ts.SyntaxKind.IfStatement:
                return col([visitNode(cbNode, (<ts.IfStatement>node).expression),
                    visitNode(cbNode, (<ts.IfStatement>node).thenStatement),
                    visitNode(cbNode, (<ts.IfStatement>node).elseStatement)]);
            case ts.SyntaxKind.DoStatement:
                return col([visitNode(cbNode, (<ts.DoStatement>node).statement),
                    visitNode(cbNode, (<ts.DoStatement>node).expression)]);
            case ts.SyntaxKind.WhileStatement:
                return col([visitNode(cbNode, (<ts.WhileStatement>node).expression),
                    visitNode(cbNode, (<ts.WhileStatement>node).statement)]);
            case ts.SyntaxKind.ForStatement:
                return col([visitNode(cbNode, (<ts.ForStatement>node).initializer),
                    visitNode(cbNode, (<ts.ForStatement>node).condition),
                    visitNode(cbNode, (<ts.ForStatement>node).incrementor),
                    visitNode(cbNode, (<ts.ForStatement>node).statement)]);
            case ts.SyntaxKind.ForInStatement:
                return col([visitNode(cbNode, (<ts.ForInStatement>node).initializer),
                    visitNode(cbNode, (<ts.ForInStatement>node).expression),
                    visitNode(cbNode, (<ts.ForInStatement>node).statement)]);
            case ts.SyntaxKind.ForOfStatement:
                return col([visitNode(cbNode, (<ts.ForOfStatement>node).initializer),
                    visitNode(cbNode, (<ts.ForOfStatement>node).expression),
                    visitNode(cbNode, (<ts.ForOfStatement>node).statement)]);
            case ts.SyntaxKind.ContinueStatement:
            case ts.SyntaxKind.BreakStatement:
                return col([visitNode(cbNode, (<ts.BreakOrContinueStatement>node).label)]);
            case ts.SyntaxKind.ReturnStatement:
                return col([visitNode(cbNode, (<ts.ReturnStatement>node).expression)]);
            case ts.SyntaxKind.WithStatement:
                return col([visitNode(cbNode, (<ts.WithStatement>node).expression),
                    visitNode(cbNode, (<ts.WithStatement>node).statement)]);
            case ts.SyntaxKind.SwitchStatement:
                return col([visitNode(cbNode, (<ts.SwitchStatement>node).expression),
                    visitNode(cbNode, (<ts.SwitchStatement>node).caseBlock)]);
            case ts.SyntaxKind.CaseBlock:
                return col([visitNodes(cbNodes, (<ts.CaseBlock>node).clauses)]);
            case ts.SyntaxKind.CaseClause:
                return col([visitNode(cbNode, (<ts.CaseClause>node).expression),
                    visitNodes(cbNodes, (<ts.CaseClause>node).statements)]);
            case ts.SyntaxKind.DefaultClause:
                return col([visitNodes(cbNodes, (<ts.DefaultClause>node).statements)]);
            case ts.SyntaxKind.LabeledStatement:
                return col([visitNode(cbNode, (<ts.LabeledStatement>node).label),
                    visitNode(cbNode, (<ts.LabeledStatement>node).statement)]);
            case ts.SyntaxKind.ThrowStatement:
                return col([visitNode(cbNode, (<ts.ThrowStatement>node).expression)]);
            case ts.SyntaxKind.TryStatement:
                return col([visitNode(cbNode, (<ts.TryStatement>node).tryBlock),
                    visitNode(cbNode, (<ts.TryStatement>node).catchClause),
                    visitNode(cbNode, (<ts.TryStatement>node).finallyBlock)]);
            case ts.SyntaxKind.CatchClause:
                return col([visitNode(cbNode, (<ts.CatchClause>node).variableDeclaration),
                    visitNode(cbNode, (<ts.CatchClause>node).block)]);
            case ts.SyntaxKind.Decorator:
                return col([visitNode(cbNode, (<ts.Decorator>node).expression)]);
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.ClassLikeDeclaration>node).name),
                    visitNodes(cbNodes, (<ts.ClassLikeDeclaration>node).typeParameters),
                    visitNodes(cbNodes, (<ts.ClassLikeDeclaration>node).heritageClauses),
                    visitNodes(cbNodes, (<ts.ClassLikeDeclaration>node).members)]);
            case ts.SyntaxKind.InterfaceDeclaration:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.InterfaceDeclaration>node).name),
                    visitNodes(cbNodes, (<ts.InterfaceDeclaration>node).typeParameters),
                    visitNodes(cbNodes, (<ts.ClassDeclaration>node).heritageClauses),
                    visitNodes(cbNodes, (<ts.InterfaceDeclaration>node).members)]);
            case ts.SyntaxKind.TypeAliasDeclaration:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.TypeAliasDeclaration>node).name),
                    visitNodes(cbNodes, (<ts.TypeAliasDeclaration>node).typeParameters),
                    visitNode(cbNode, (<ts.TypeAliasDeclaration>node).type)]);
            case ts.SyntaxKind.EnumDeclaration:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.EnumDeclaration>node).name),
                    visitNodes(cbNodes, (<ts.EnumDeclaration>node).members)]);
            case ts.SyntaxKind.EnumMember:
                return col([visitNode(cbNode, (<ts.EnumMember>node).name),
                    visitNode(cbNode, (<ts.EnumMember>node).initializer)]);
            case ts.SyntaxKind.ModuleDeclaration:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.ModuleDeclaration>node).name),
                    visitNode(cbNode, (<ts.ModuleDeclaration>node).body)]);
            case ts.SyntaxKind.ImportEqualsDeclaration:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.ImportEqualsDeclaration>node).name),
                    visitNode(cbNode, (<ts.ImportEqualsDeclaration>node).moduleReference)]);
            case ts.SyntaxKind.ImportDeclaration:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.ImportDeclaration>node).importClause),
                    visitNode(cbNode, (<ts.ImportDeclaration>node).moduleSpecifier)]);
            case ts.SyntaxKind.ImportClause:
                return col([visitNode(cbNode, (<ts.ImportClause>node).name),
                    visitNode(cbNode, (<ts.ImportClause>node).namedBindings)]);
            //case ts.SyntaxKind.GlobalModuleExportDeclaration:
            //    return col([visitNode(cbNode, (<ts.GlobalModuleExportDeclaration>node).name)]);

            case ts.SyntaxKind.NamespaceImport:
                return col([visitNode(cbNode, (<ts.NamespaceImport>node).name)]);
            case ts.SyntaxKind.NamedImports:
            case ts.SyntaxKind.NamedExports:
                return col([visitNodes(cbNodes, (<ts.NamedImportsOrExports>node).elements)]);
            case ts.SyntaxKind.ExportDeclaration:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.ExportDeclaration>node).exportClause),
                    visitNode(cbNode, (<ts.ExportDeclaration>node).moduleSpecifier)]);
            case ts.SyntaxKind.ImportSpecifier:
            case ts.SyntaxKind.ExportSpecifier:
                return col([visitNode(cbNode, (<ts.ImportOrExportSpecifier>node).propertyName),
                    visitNode(cbNode, (<ts.ImportOrExportSpecifier>node).name)]);
            case ts.SyntaxKind.ExportAssignment:
                return col([visitNodes(cbNodes, node.decorators),
                    visitNodes(cbNodes, node.modifiers),
                    visitNode(cbNode, (<ts.ExportAssignment>node).expression)]);
            case ts.SyntaxKind.TemplateExpression:
                return col([visitNode(cbNode, (<ts.TemplateExpression>node).head), visitNodes(cbNodes, (<ts.TemplateExpression>node).templateSpans)]);
            case ts.SyntaxKind.TemplateSpan:
                return col([visitNode(cbNode, (<ts.TemplateSpan>node).expression), visitNode(cbNode, (<ts.TemplateSpan>node).literal)]);
            case ts.SyntaxKind.ComputedPropertyName:
                return col([visitNode(cbNode, (<ts.ComputedPropertyName>node).expression)]);
            case ts.SyntaxKind.HeritageClause:
                return col([visitNodes(cbNodes, (<ts.HeritageClause>node).types)]);
            case ts.SyntaxKind.ExpressionWithTypeArguments:
                return col([visitNode(cbNode, (<ts.ExpressionWithTypeArguments>node).expression),
                    visitNodes(cbNodes, (<ts.ExpressionWithTypeArguments>node).typeArguments)]);
            case ts.SyntaxKind.ExternalModuleReference:
                return col([visitNode(cbNode, (<ts.ExternalModuleReference>node).expression)]);
            case ts.SyntaxKind.MissingDeclaration:
                return col([visitNodes(cbNodes, node.decorators)]);

            case ts.SyntaxKind.JsxElement:
                return col([visitNode(cbNode, (<ts.JsxElement>node).openingElement),
                    visitNodes(cbNodes, (<ts.JsxElement>node).children),
                    visitNode(cbNode, (<ts.JsxElement>node).closingElement)]);
            case ts.SyntaxKind.JsxSelfClosingElement:
            case ts.SyntaxKind.JsxOpeningElement:
                return col([visitNode(cbNode, (<ts.JsxOpeningLikeElement>node).tagName),
                    visitNodes(cbNodes, (<ts.JsxOpeningLikeElement>node).attributes)]);
            case ts.SyntaxKind.JsxAttribute:
                return col([visitNode(cbNode, (<ts.JsxAttribute>node).name),
                    visitNode(cbNode, (<ts.JsxAttribute>node).initializer)]);
            case ts.SyntaxKind.JsxSpreadAttribute:
                return col([visitNode(cbNode, (<ts.JsxSpreadAttribute>node).expression)]);
            case ts.SyntaxKind.JsxExpression:
                return col([visitNode(cbNode, (<ts.JsxExpression>node).expression)]);
            case ts.SyntaxKind.JsxClosingElement:
                return col([visitNode(cbNode, (<ts.JsxClosingElement>node).tagName)]);

            case ts.SyntaxKind.JSDocTypeExpression:
                return col([visitNode(cbNode, (<ts.JSDocTypeExpression>node).type)]);
            case ts.SyntaxKind.JSDocUnionType:
                return col([visitNodes(cbNodes, (<ts.JSDocUnionType>node).types)]);
            case ts.SyntaxKind.JSDocTupleType:
                return col([visitNodes(cbNodes, (<ts.JSDocTupleType>node).types)]);
            case ts.SyntaxKind.JSDocArrayType:
                return col([visitNode(cbNode, (<ts.JSDocArrayType>node).elementType)]);
            case ts.SyntaxKind.JSDocNonNullableType:
                return col([visitNode(cbNode, (<ts.JSDocNonNullableType>node).type)]);
            case ts.SyntaxKind.JSDocNullableType:
                return col([visitNode(cbNode, (<ts.JSDocNullableType>node).type)]);
            case ts.SyntaxKind.JSDocRecordType:
                return col([visitNodes(cbNodes, (<ts.JSDocRecordType>node).members)]);
            case ts.SyntaxKind.JSDocTypeReference:
                return col([visitNode(cbNode, (<ts.JSDocTypeReference>node).name),
                    visitNodes(cbNodes, (<ts.JSDocTypeReference>node).typeArguments)]);
            case ts.SyntaxKind.JSDocOptionalType:
                return col([visitNode(cbNode, (<ts.JSDocOptionalType>node).type)]);
            case ts.SyntaxKind.JSDocFunctionType:
                return col([visitNodes(cbNodes, (<ts.JSDocFunctionType>node).parameters),
                    visitNode(cbNode, (<ts.JSDocFunctionType>node).type)]);
            case ts.SyntaxKind.JSDocVariadicType:
                return col([visitNode(cbNode, (<ts.JSDocVariadicType>node).type)]);
            case ts.SyntaxKind.JSDocConstructorType:
                return col([visitNode(cbNode, (<ts.JSDocConstructorType>node).type)]);
            case ts.SyntaxKind.JSDocThisType:
                return col([visitNode(cbNode, (<ts.JSDocThisType>node).type)]);
            case ts.SyntaxKind.JSDocRecordMember:
                return col([visitNode(cbNode, (<ts.JSDocRecordMember>node).name),
                    visitNode(cbNode, (<ts.JSDocRecordMember>node).type)]);
            case ts.SyntaxKind.JSDocComment:
                return col([visitNodes(cbNodes, (<ts.JSDocComment>node).tags)]);
            case ts.SyntaxKind.JSDocParameterTag:
                return col([visitNode(cbNode, (<ts.JSDocParameterTag>node).preParameterName),
                    visitNode(cbNode, (<ts.JSDocParameterTag>node).typeExpression),
                    visitNode(cbNode, (<ts.JSDocParameterTag>node).postParameterName)]);
            case ts.SyntaxKind.JSDocReturnTag:
                return col([visitNode(cbNode, (<ts.JSDocReturnTag>node).typeExpression)]);
            case ts.SyntaxKind.JSDocTypeTag:
                return col([visitNode(cbNode, (<ts.JSDocTypeTag>node).typeExpression)]);
            case ts.SyntaxKind.JSDocTemplateTag:
                return col([visitNodes(cbNodes, (<ts.JSDocTemplateTag>node).typeParameters)]);
        }
    }
