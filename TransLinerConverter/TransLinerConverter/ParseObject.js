"use strict";
var ts = require("typescript");
var ParseObject = (function () {
    function ParseObject(node, children, list, syntaxKind) {
        this.children = children;
        this.list = list;
        this.kinde = 0;
        this.kind = "";
        this.text = "";
        if (node != null) {
            this.kinde = node.kind;
            this.kind = ts.SyntaxKind[node.kind];
            if (node.hasOwnProperty("text")) {
                this.text = node["text"];
            }
        }
        else if (syntaxKind != null) {
            this.kinde = syntaxKind;
            this.kind = ts.SyntaxKind[syntaxKind];
        }
        var language = "perl";
        if (language == "typescript") {
            this.clike = false;
            this.typed = true;
            this.thisneed = true;
            this.perl = false;
        }
        else if (language == "perl") {
            this.clike = true;
            this.typed = false;
            this.thisneed = false;
            this.perl = true;
        }
    }
    ParseObject.prototype.print = function (n) {
        var sh = this.indent(n);
        var s = "";
        if (this.kind != "") {
            s += sh + "kind: " + this.kind + "\r\n";
        }
        if (this.text != "" && this.kind != "SourceFile") {
            s += sh + "text: " + this.text + "\r\n";
        }
        if (this.children != null) {
            //s += sh + "children:\r\n";
            //s += this.children.print(n + 1);
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj) {
                    s += obj.print(n + 1);
                }
            }
        }
        if (this.list != null) {
            s += sh + "list:\r\n";
            for (var _b = 0, _c = this.list; _b < _c.length; _b++) {
                var obj = _c[_b];
                if (obj) {
                    s += obj.print(n + 1);
                }
            }
        }
        return s;
    };
    ParseObject.prototype.indent = function (n) {
        var s = "";
        for (var i = 0; i < n; i++) {
            s += "    ";
        }
        return s;
        //return "[" + String(n) + "]" + s;
    };
    ParseObject.prototype.concop = function (list, op, n) {
        var s = "";
        if (list != null) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var obj = list_1[_i];
                if (obj != null) {
                    var s2 = obj.toTypeScript(" ", n);
                    s = this.concat(s, op, s2);
                }
            }
        }
        return s;
    };
    ParseObject.prototype.conc = function (list, n) {
        return this.concop(list, " ", n);
    };
    ParseObject.prototype.conclist = function (list, n) {
        var s = "";
        if (list != null) {
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var obj = list_2[_i];
                if (obj != null) {
                    var line = obj.toTypeScript(" ", n);
                    if (line != "") {
                        if (line[line.length - 1] == "}") {
                            s += this.indent(n) + line + "\r\n";
                        }
                        else {
                            s += this.indent(n) + line + ";\r\n";
                        }
                    }
                }
            }
        }
        return s;
    };
    ParseObject.prototype.concat = function (s1, op, s2) {
        if (s1 != "" && s2 != "") {
            if (op == " ") {
                var c = "";
                if (s1.length > 0) {
                    c = s1[s1.length - 1];
                }
                var t = "";
                if (s2.length > 0) {
                    t = s2[0];
                }
                if (t == "(" && (s1 == "if" || s1 == "switch" || s1 == "while" || s1 == "for" || s1 == "catch")) {
                    return s1 + op + s2;
                }
                else if (t == " " || t == ":" || t == ";" || t == "," || t == "." || t == "(" || t == "[" || t == "<" || t == ")" || t == "]" || t == "}" || t == ">" || s2 == "++" || s2 == "--") {
                    return s1 + s2;
                }
                else if (c == " " || c == "." || c == "(" || c == "[" || c == "{" || c == "<" || s1 == "!" || s1 == "++" || s1 == "--") {
                    return s1 + s2;
                }
                else {
                    return s1 + op + s2;
                }
            }
            else {
                return s1 + op + s2;
            }
        }
        else {
            return s1 + s2;
        }
    };
    ParseObject.prototype.format = function (formatstr, list, n) {
        // $n 1行
        // @n 複数行
        var s = "";
        var linechanged = false;
        var formatlist = formatstr.split(" ");
        for (var i = 0; i < formatlist.length; i++) {
            var f = formatlist[i];
            if (f == "_(_") {
                f = " ( ";
            }
            else if (f == "_)_") {
                f = " ) ";
            }
            if (f[0] == "$") {
                var x = Number(f.substr(1));
                if (list[x]) {
                    var arg = list[x].toTypeScript(" ", n);
                    if (!this.thisneed && i == 1 && s == "this" && arg == ".") {
                        // this は要らない。this. は消去
                        s = "";
                    }
                    else {
                        s = this.concat(s, " ", arg);
                    }
                }
                linechanged = false;
            }
            else if (f[0] == ",") {
                var x = Number(f.substr(1));
                if (list[x]) {
                    s = this.concat(s, " ", list[x].toTypeScript(", ", n));
                }
                linechanged = false;
            }
            else if (f[0] == "@") {
                var x = Number(f.substr(1));
                if (list[x]) {
                    s = this.concat(s, "\r\n", list[x].toTypeScript("nl", n + 1));
                }
                linechanged = true;
            }
            else {
                if (linechanged) {
                    s += this.indent(n) + f;
                }
                else {
                    s = this.concat(s, " ", f);
                }
                linechanged = false;
            }
        }
        return s;
    };
    ParseObject.prototype.escapestring = function (s) {
        var res = "";
        for (var i = 0; i < s.length; i++) {
            if (s[i] == "\n") {
                res += "\\n";
            }
            else if (s[i] == "\f") {
                res += "\\f";
            }
            else if (s[i] == "\b") {
                res += "\\b";
            }
            else if (s[i] == "\t") {
                res += "\\t";
            }
            else if (s[i] == "\r") {
                res += "\\r";
            }
            else if (s[i] == "\'") {
                res += "\\\'";
            }
            else if (s[i] == "\"") {
                res += "\\\"";
            }
            else if (s[i] == "\\") {
                res += "\\\\";
            }
            else {
                res += s[i];
            }
        }
        return "\"" + res + "\"";
    };
    ParseObject.prototype.toTypeScript = function (op, n) {
        if (op == "nl") {
            if (this.kinde == 0) {
                if (this.list != null) {
                    return this.conclist(this.list, n);
                }
            }
            else {
                return this.indent(n) + this.toTypeScript1(op, n) + "\r\n";
            }
        }
        else {
            if (this.kinde == 0) {
                if (this.list != null) {
                    return this.concop(this.list, op, n);
                }
            }
            else {
                return this.toTypeScript1(op, n);
            }
        }
    };
    ParseObject.prototype.toTypeScript1 = function (op, n) {
        switch (this.kinde) {
            case ts.SyntaxKind.QualifiedName:
                //return col([visitNode(cbNode, (<ts.QualifiedName>node).left),
                //    visitNode(cbNode, (<ts.QualifiedName>node).right)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.TypeParameter:
                //return col([visitNode(cbNode, (<ts.TypeParameterDeclaration>node).name),
                //    visitNode(cbNode, (<ts.TypeParameterDeclaration>node).constraint),
                //    visitNode(cbNode, (<ts.TypeParameterDeclaration>node).expression)]);
                return this.concop(this.children, ", ", n);
            case ts.SyntaxKind.ShorthandPropertyAssignment:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.ShorthandPropertyAssignment>node).name),
                //    visitNode(cbNode, (<ts.ShorthandPropertyAssignment>node).questionToken),
                //    visitNode(cbNode, (<ts.ShorthandPropertyAssignment>node).equalsToken),
                //    visitNode(cbNode, (<ts.ShorthandPropertyAssignment>node).objectAssignmentInitializer)]);
                return this.format("$0 $1 ::ShorthandPropertyAssignment:: $2 $3 $4 $5", this.children, n);
            case ts.SyntaxKind.Parameter:
            case ts.SyntaxKind.PropertyDeclaration:
                if (this.children[6]) {
                    if (this.children[7]) {
                        return this.format("$0 $1 $2 $3 $4 $5 : $6 = $7", this.children, n);
                    }
                    else {
                        return this.format("$0 $1 $2 $3 $4 $5 : $6", this.children, n);
                    }
                }
                else {
                    if (this.children[7]) {
                        return this.format("$0 $1 $2 $3 $4 $5 = $7", this.children, n);
                    }
                    else {
                        return this.format("$0 $1 $2 $3 $4 $5", this.children, n);
                    }
                }
            case ts.SyntaxKind.PropertySignature:
                return this.format("$0 $1 ::PropertySignature:: $2 $3 $4 $5 : $6 = $7", this.children, n);
            case ts.SyntaxKind.PropertyAssignment:
                if (this.children[6]) {
                    if (this.children[7]) {
                        return this.format("$0 $1 $2 $3 $4 $5 : $6 : $7", this.children, n);
                    }
                    else {
                        return this.format("$0 $1 $2 $3 $4 $5 : $6", this.children, n);
                    }
                }
                else {
                    if (this.children[7]) {
                        return this.format("$0 $1 $2 $3 $4 $5 : $7", this.children, n);
                    }
                    else {
                        return this.format("$0 $1 $2 $3 $4 $5", this.children, n);
                    }
                }
            case ts.SyntaxKind.VariableDeclaration:
                if (this.perl) {
                    if (this.children[7]) {
                        return this.format("$0 $1 my $2 $3 $4 $5 = $7", this.children, n);
                    }
                    else {
                        return this.format("$0 $1 my $2 $3 $4 $5", this.children, n);
                    }
                }
                else {
                    if (this.children[6]) {
                        if (this.children[7]) {
                            return this.format("$0 $1 var $2 $3 $4 $5 : $6 = $7", this.children, n);
                        }
                        else {
                            return this.format("$0 $1 var $2 $3 $4 $5 : $6", this.children, n);
                        }
                    }
                    else {
                        if (this.children[7]) {
                            return this.format("$0 $1 var $2 $3 $4 $5 = $7", this.children, n);
                        }
                        else {
                            return this.format("$0 $1 var $2 $3 $4 $5", this.children, n);
                        }
                    }
                }
            case ts.SyntaxKind.BindingElement:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).propertyName),
                //    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).dotDotDotToken),
                //    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).name),
                //    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).questionToken),
                //    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).type),
                //    visitNode(cbNode, (<ts.VariableLikeDeclaration>node).initializer)]);
                return this.format("$0 $1 ::BindingElement:: $2 $3 $4 $5 : $6 = $7", this.children, n);
            case ts.SyntaxKind.FunctionType:
                return this.format("::FunctionType:: $0 $1 $2 $3 $4", this.children, n);
            case ts.SyntaxKind.ConstructorType:
                return this.format("::ConstructorType:: $0 $1 $2 $3 $4", this.children, n);
            case ts.SyntaxKind.CallSignature:
                return this.format("::CallSignature:: $0 $1 $2 $3 $4", this.children, n);
            case ts.SyntaxKind.ConstructSignature:
                return this.format("::ConstructSignature:: $0 $1 $2 $3 $4", this.children, n);
            case ts.SyntaxKind.IndexSignature:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNodes(cbNodes, (<ts.SignatureDeclaration>node).typeParameters),
                //    visitNodes(cbNodes, (<ts.SignatureDeclaration>node).parameters),
                //    visitNode(cbNode, (<ts.SignatureDeclaration>node).type)]);
                return this.format("::IndexSignature:: $0 $1 $2 $3 $4", this.children, n);
            case ts.SyntaxKind.MethodDeclaration:
                return this.format("$0 $1 $2 $3 $4 $5 ( ,6 ) : $7 $8 $9", this.children, n);
            case ts.SyntaxKind.MethodSignature:
                return this.format("$0 $1 ::MethodSignature:: $2 $3 $4 $5 ( ,6 ) : $7 $8 $9", this.children, n);
            case ts.SyntaxKind.Constructor:
                return this.format("$0 $1 constructor $2 $3 $4 $5 ( ,6 ) $7 $8 $9", this.children, n);
            case ts.SyntaxKind.GetAccessor:
                return this.format("$0 $1 get $2 $3 $4 $5 ( ,6 ) : $7 $8 $9", this.children, n);
            case ts.SyntaxKind.SetAccessor:
                return this.format("$0 $1 set $2 $3 $4 $5 ( ,6 ) : $7 $8 $9", this.children, n);
            case ts.SyntaxKind.FunctionExpression:
                return this.format("$0 $1 function $2 $3 $4 $5 ( ,6 ) : $7 $8 $9", this.children, n);
            case ts.SyntaxKind.FunctionDeclaration:
                return this.format("$0 $1 function $2 $3 $4 $5 ( ,6 ) : $7 $8 $9", this.children, n);
            case ts.SyntaxKind.ArrowFunction:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).asteriskToken),
                //    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).name),
                //    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).questionToken),
                //    visitNodes(cbNodes, (<ts.FunctionLikeDeclaration>node).typeParameters),
                //    visitNodes(cbNodes, (<ts.FunctionLikeDeclaration>node).parameters),
                //    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).type),
                //    visitNode(cbNode, (<ts.ArrowFunction>node).equalsGreaterThanToken),
                //    visitNode(cbNode, (<ts.FunctionLikeDeclaration>node).body)]);
                return this.format("$0 $1 ::ArrowFunction:: $2 $3 $4 $5 ( ,6 ) : $7 $8 $9", this.children, n);
            case ts.SyntaxKind.TypeReference:
                //return col([visitNode(cbNode, (<ts.TypeReferenceNode>node).typeName),
                //    visitNodes(cbNodes, (<ts.TypeReferenceNode>node).typeArguments)]);
                if (this.children[1]) {
                    return this.format("$0 < $1 >", this.children, n);
                }
                else {
                    return this.format("$0", this.children, n);
                }
            case ts.SyntaxKind.TypePredicate:
                //return col([visitNode(cbNode, (<ts.TypePredicateNode>node).parameterName),
                //    visitNode(cbNode, (<ts.TypePredicateNode>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.TypeQuery:
                //return col([visitNode(cbNode, (<ts.TypeQueryNode>node).exprName)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.TypeLiteral:
                //return col([visitNodes(cbNodes, (<ts.TypeLiteralNode>node).members)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ArrayType:
                //return col([visitNode(cbNode, (<ts.ArrayTypeNode>node).elementType)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.TupleType:
                //return col([visitNodes(cbNodes, (<ts.TupleTypeNode>node).elementTypes)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.UnionType:
            case ts.SyntaxKind.IntersectionType:
                //return col([visitNodes(cbNodes, (<ts.UnionOrIntersectionTypeNode>node).types)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ParenthesizedType:
                //return col([visitNode(cbNode, (<ts.ParenthesizedTypeNode>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ObjectBindingPattern:
            case ts.SyntaxKind.ArrayBindingPattern:
                //return col([visitNodes(cbNodes, (<ts.BindingPattern>node).elements)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ArrayLiteralExpression:
                //return col([visitNodes(cbNodes, (<ts.ArrayLiteralExpression>node).elements)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ObjectLiteralExpression:
                //return col([visitNodes(cbNodes, (<ts.ObjectLiteralExpression>node).properties)]);
                return this.format("{ ,0 }", this.children, n);
            case ts.SyntaxKind.PropertyAccessExpression:
                //return col([visitNode(cbNode, (<ts.PropertyAccessExpression>node).expression),
                //    visitNode(cbNode, (<ts.PropertyAccessExpression>node).dotToken),
                //    visitNode(cbNode, (<ts.PropertyAccessExpression>node).name)]);
                return this.format("$0 $1 $2", this.children, n);
            case ts.SyntaxKind.ElementAccessExpression:
                //return col([visitNode(cbNode, (<ts.ElementAccessExpression>node).expression),
                //    visitNode(cbNode, (<ts.ElementAccessExpression>node).argumentExpression)]);
                return this.format("$0 [ $1 ]", this.children, n);
            case ts.SyntaxKind.CallExpression:
                if (this.perl) {
                    return this.format("& $0 $1 ( ,2 )", this.children, n);
                }
                else {
                    return this.format("$0 $1 ( ,2 )", this.children, n);
                }
            case ts.SyntaxKind.NewExpression:
                //return col([visitNode(cbNode, (<ts.CallExpression>node).expression),
                //    visitNodes(cbNodes, (<ts.CallExpression>node).typeArguments),
                //    visitNodes(cbNodes, (<ts.CallExpression>node).arguments)]);
                if (this.children[1]) {
                    return this.format("new $0 < $1 > ( ,2 )", this.children, n);
                }
                else {
                    return this.format("new $0 ( ,2 )", this.children, n);
                }
            case ts.SyntaxKind.TaggedTemplateExpression:
                //return col([visitNode(cbNode, (<ts.TaggedTemplateExpression>node).tag),
                //    visitNode(cbNode, (<ts.TaggedTemplateExpression>node).template)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.TypeAssertionExpression:
                //return col([visitNode(cbNode, (<ts.TypeAssertion>node).type),
                //    visitNode(cbNode, (<ts.TypeAssertion>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ParenthesizedExpression:
                //return col([visitNode(cbNode, (<ts.ParenthesizedExpression>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.DeleteExpression:
                //return col([visitNode(cbNode, (<ts.DeleteExpression>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.TypeOfExpression:
                //return col([visitNode(cbNode, (<ts.TypeOfExpression>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.VoidExpression:
                //return col([visitNode(cbNode, (<ts.VoidExpression>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.PrefixUnaryExpression:
                //return col([syntaxKindToObject((<ts.PrefixUnaryExpression>node).operator),
                //    visitNode(cbNode, (<ts.PrefixUnaryExpression>node).operand)]);
                return this.format("$0 $1", this.children, n);
            case ts.SyntaxKind.YieldExpression:
                //return col([visitNode(cbNode, (<ts.YieldExpression>node).asteriskToken),
                //    visitNode(cbNode, (<ts.YieldExpression>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.AwaitExpression:
                //return col([visitNode(cbNode, (<ts.AwaitExpression>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.PostfixUnaryExpression:
                //return col([visitNode(cbNode, (<ts.PostfixUnaryExpression>node).operand),
                //    syntaxKindToObject((<ts.PostfixUnaryExpression>node).operator)]);
                return this.format("$0 $1", this.children, n);
            case ts.SyntaxKind.BinaryExpression:
                //return col([visitNode(cbNode, (<ts.BinaryExpression>node).left),
                //    visitNode(cbNode, (<ts.BinaryExpression>node).operatorToken),
                //    visitNode(cbNode, (<ts.BinaryExpression>node).right)]);
                return this.format("$0 $1 $2", this.children, n);
            case ts.SyntaxKind.AsExpression:
                //return col([visitNode(cbNode, (<ts.AsExpression>node).expression),
                //    visitNode(cbNode, (<ts.AsExpression>node).type)]);
                return this.conc(this.children, n);
            //case ts.SyntaxKind.NonNullExpression:
            //    return col([visitNode(cbNode, (<ts.NonNullExpression>node).expression)]);
            case ts.SyntaxKind.ConditionalExpression:
                //return col([visitNode(cbNode, (<ts.ConditionalExpression>node).condition),
                //    visitNode(cbNode, (<ts.ConditionalExpression>node).questionToken),
                //    visitNode(cbNode, (<ts.ConditionalExpression>node).whenTrue),
                //    visitNode(cbNode, (<ts.ConditionalExpression>node).colonToken),
                //    visitNode(cbNode, (<ts.ConditionalExpression>node).whenFalse)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.SpreadElementExpression:
                //return col([visitNode(cbNode, (<ts.SpreadElementExpression>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.Block:
            case ts.SyntaxKind.ModuleBlock:
                //return col([visitNodes(cbNodes, (<ts.Block>node).statements)]);
                return this.format("{ @0 }", this.children, n);
            case ts.SyntaxKind.SourceFile:
                //return col([visitNodes(cbNodes, (<ts.SourceFile>node).statements),
                //    visitNode(cbNode, (<ts.SourceFile>node).endOfFileToken)]);
                return this.format("@0", this.children, n);
            case ts.SyntaxKind.VariableStatement:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.VariableStatement>node).declarationList)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.VariableDeclarationList:
                //return col([visitNodes(cbNodes, (<ts.VariableDeclarationList>node).declarations)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ExpressionStatement:
                //return col([visitNode(cbNode, (<ts.ExpressionStatement>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.IfStatement:
                //return col([visitNode(cbNode, (<ts.IfStatement>node).expression),
                //    visitNode(cbNode, (<ts.IfStatement>node).thenStatement),
                //    visitNode(cbNode, (<ts.IfStatement>node).elseStatement)]);
                if (this.children[2]) {
                    return this.format("if _(_ $0 _)_ then $1 else $2", this.children, n);
                }
                else {
                    return this.format("if _(_ $0 _)_ then $1", this.children, n);
                }
            case ts.SyntaxKind.DoStatement:
                //return col([visitNode(cbNode, (<ts.DoStatement>node).statement),
                //    visitNode(cbNode, (<ts.DoStatement>node).expression)]);
                return this.format("do $0 while _(_ $1 _)_", this.children, n);
            case ts.SyntaxKind.WhileStatement:
                //return col([visitNode(cbNode, (<ts.WhileStatement>node).expression),
                //    visitNode(cbNode, (<ts.WhileStatement>node).statement)]);
                return this.format("while _(_ $0 _)_ $1", this.children, n);
            case ts.SyntaxKind.ForStatement:
                //return col([visitNode(cbNode, (<ts.ForStatement>node).initializer),
                //    visitNode(cbNode, (<ts.ForStatement>node).condition),
                //    visitNode(cbNode, (<ts.ForStatement>node).incrementor),
                //    visitNode(cbNode, (<ts.ForStatement>node).statement)]);
                return this.format("for _(_ $0 ; $1 ; $2 _)_ $3", this.children, n);
            case ts.SyntaxKind.ForInStatement:
                //return col([visitNode(cbNode, (<ts.ForInStatement>node).initializer),
                //    visitNode(cbNode, (<ts.ForInStatement>node).expression),
                //    visitNode(cbNode, (<ts.ForInStatement>node).statement)]);
                return this.format("for _(_ $0 in $1 _)_ $2", this.children, n);
            case ts.SyntaxKind.ForOfStatement:
                //return col([visitNode(cbNode, (<ts.ForOfStatement>node).initializer),
                //    visitNode(cbNode, (<ts.ForOfStatement>node).expression),
                //    visitNode(cbNode, (<ts.ForOfStatement>node).statement)]);
                return this.format("for _(_ $0 of $1 _)_ $2", this.children, n);
            case ts.SyntaxKind.ContinueStatement:
                return "continue";
            case ts.SyntaxKind.BreakStatement:
                //return col([visitNode(cbNode, (<ts.BreakOrContinueStatement>node).label)]);
                return "break";
            case ts.SyntaxKind.ReturnStatement:
                //return col([visitNode(cbNode, (<ts.ReturnStatement>node).expression)]);
                if (this.children[0]) {
                    return this.format("return $0", this.children, n);
                }
                else {
                    return "return";
                }
            case ts.SyntaxKind.WithStatement:
                //return col([visitNode(cbNode, (<ts.WithStatement>node).expression),
                //    visitNode(cbNode, (<ts.WithStatement>node).statement)]);
                return this.format("with _(_ $0 _)_ $1", this.children, n);
            case ts.SyntaxKind.SwitchStatement:
                //return col([visitNode(cbNode, (<ts.SwitchStatement>node).expression),
                //    visitNode(cbNode, (<ts.SwitchStatement>node).caseBlock)]);
                return this.format("switch _(_ $0 _)_ $1", this.children, n);
            case ts.SyntaxKind.CaseBlock:
                //return col([visitNodes(cbNodes, (<ts.CaseBlock>node).clauses)]);
                return this.format("{ @0 }", this.children, n);
            case ts.SyntaxKind.CaseClause:
                //return col([visitNode(cbNode, (<ts.CaseClause>node).expression),
                //    visitNodes(cbNodes, (<ts.CaseClause>node).statements)]);
                return this.format("case $0 : @1", this.children, n);
            case ts.SyntaxKind.DefaultClause:
                //return col([visitNodes(cbNodes, (<ts.DefaultClause>node).statements)]);
                return this.format("default : @0", this.children, n);
            case ts.SyntaxKind.LabeledStatement:
                //return col([visitNode(cbNode, (<ts.LabeledStatement>node).label),
                //    visitNode(cbNode, (<ts.LabeledStatement>node).statement)]);
                return this.format("$0 : $1", this.children, n);
            case ts.SyntaxKind.ThrowStatement:
                //return col([visitNode(cbNode, (<ts.ThrowStatement>node).expression)]);
                return this.format("throw _(_ $0 _)_", this.children, n);
            case ts.SyntaxKind.TryStatement:
                //return col([visitNode(cbNode, (<ts.TryStatement>node).tryBlock),
                //    visitNode(cbNode, (<ts.TryStatement>node).catchClause),
                //    visitNode(cbNode, (<ts.TryStatement>node).finallyBlock)]);
                return this.format("try $0 $1 $2", this.children, n);
            case ts.SyntaxKind.CatchClause:
                //return col([visitNode(cbNode, (<ts.CatchClause>node).variableDeclaration),
                //    visitNode(cbNode, (<ts.CatchClause>node).block)]);
                return this.format("catch _(_ $0 _)_ $1", this.children, n);
            case ts.SyntaxKind.Decorator:
                //return col([visitNode(cbNode, (<ts.Decorator>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.ClassExpression:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.ClassLikeDeclaration>node).name),
                //    visitNodes(cbNodes, (<ts.ClassLikeDeclaration>node).typeParameters),
                //    visitNodes(cbNodes, (<ts.ClassLikeDeclaration>node).heritageClauses),
                //    visitNodes(cbNodes, (<ts.ClassLikeDeclaration>node).members)]);
                return this.format("$0 $1 class $2 $3 $4 { @5 }", this.children, n);
            case ts.SyntaxKind.InterfaceDeclaration:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.InterfaceDeclaration>node).name),
                //    visitNodes(cbNodes, (<ts.InterfaceDeclaration>node).typeParameters),
                //    visitNodes(cbNodes, (<ts.ClassDeclaration>node).heritageClauses),
                //    visitNodes(cbNodes, (<ts.InterfaceDeclaration>node).members)]);
                return this.format("$0 $1 interface $2 $3 $4 { @5 }", this.children, n);
            case ts.SyntaxKind.TypeAliasDeclaration:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.TypeAliasDeclaration>node).name),
                //    visitNodes(cbNodes, (<ts.TypeAliasDeclaration>node).typeParameters),
                //    visitNode(cbNode, (<ts.TypeAliasDeclaration>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.EnumDeclaration:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.EnumDeclaration>node).name),
                //    visitNodes(cbNodes, (<ts.EnumDeclaration>node).members)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.EnumMember:
                //return col([visitNode(cbNode, (<ts.EnumMember>node).name),
                //    visitNode(cbNode, (<ts.EnumMember>node).initializer)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ModuleDeclaration:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.ModuleDeclaration>node).name),
                //    visitNode(cbNode, (<ts.ModuleDeclaration>node).body)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ImportEqualsDeclaration:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.ImportEqualsDeclaration>node).name),
                //    visitNode(cbNode, (<ts.ImportEqualsDeclaration>node).moduleReference)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ImportDeclaration:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.ImportDeclaration>node).importClause),
                //    visitNode(cbNode, (<ts.ImportDeclaration>node).moduleSpecifier)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ImportClause:
                //return col([visitNode(cbNode, (<ts.ImportClause>node).name),
                //    visitNode(cbNode, (<ts.ImportClause>node).namedBindings)]);
                return this.conc(this.children, n);
            //case ts.SyntaxKind.GlobalModuleExportDeclaration:
            //    return col([visitNode(cbNode, (<ts.GlobalModuleExportDeclaration>node).name)]);
            case ts.SyntaxKind.NamespaceImport:
                //return col([visitNode(cbNode, (<ts.NamespaceImport>node).name)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.NamedImports:
            case ts.SyntaxKind.NamedExports:
                //return col([visitNodes(cbNodes, (<ts.NamedImportsOrExports>node).elements)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ExportDeclaration:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.ExportDeclaration>node).exportClause),
                //    visitNode(cbNode, (<ts.ExportDeclaration>node).moduleSpecifier)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ImportSpecifier:
            case ts.SyntaxKind.ExportSpecifier:
                //return col([visitNode(cbNode, (<ts.ImportOrExportSpecifier>node).propertyName),
                //    visitNode(cbNode, (<ts.ImportOrExportSpecifier>node).name)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ExportAssignment:
                //return col([visitNodes(cbNodes, node.decorators),
                //    visitNodes(cbNodes, node.modifiers),
                //    visitNode(cbNode, (<ts.ExportAssignment>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.TemplateExpression:
                //return col([visitNode(cbNode, (<ts.TemplateExpression>node).head), visitNodes(cbNodes, (<ts.TemplateExpression>node).templateSpans)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.TemplateSpan:
                //return col([visitNode(cbNode, (<ts.TemplateSpan>node).expression), visitNode(cbNode, (<ts.TemplateSpan>node).literal)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ComputedPropertyName:
                //return col([visitNode(cbNode, (<ts.ComputedPropertyName>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.HeritageClause:
                //return col([visitNodes(cbNodes, (<ts.HeritageClause>node).types)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ExpressionWithTypeArguments:
                //return col([visitNode(cbNode, (<ts.ExpressionWithTypeArguments>node).expression),
                //    visitNodes(cbNodes, (<ts.ExpressionWithTypeArguments>node).typeArguments)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.ExternalModuleReference:
                //return col([visitNode(cbNode, (<ts.ExternalModuleReference>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.MissingDeclaration:
                //return col([visitNodes(cbNodes, node.decorators)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JsxElement:
                //return col([visitNode(cbNode, (<ts.JsxElement>node).openingElement),
                //    visitNodes(cbNodes, (<ts.JsxElement>node).children),
                //    visitNode(cbNode, (<ts.JsxElement>node).closingElement)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JsxSelfClosingElement:
            case ts.SyntaxKind.JsxOpeningElement:
                //return col([visitNode(cbNode, (<ts.JsxOpeningLikeElement>node).tagName),
                //    visitNodes(cbNodes, (<ts.JsxOpeningLikeElement>node).attributes)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JsxAttribute:
                //return col([visitNode(cbNode, (<ts.JsxAttribute>node).name),
                //    visitNode(cbNode, (<ts.JsxAttribute>node).initializer)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JsxSpreadAttribute:
                //return col([visitNode(cbNode, (<ts.JsxSpreadAttribute>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JsxExpression:
                //return col([visitNode(cbNode, (<ts.JsxExpression>node).expression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JsxClosingElement:
                //return col([visitNode(cbNode, (<ts.JsxClosingElement>node).tagName)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocTypeExpression:
                //return col([visitNode(cbNode, (<ts.JSDocTypeExpression>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocUnionType:
                //return col([visitNodes(cbNodes, (<ts.JSDocUnionType>node).types)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocTupleType:
                //return col([visitNodes(cbNodes, (<ts.JSDocTupleType>node).types)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocArrayType:
                //return col([visitNode(cbNode, (<ts.JSDocArrayType>node).elementType)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocNonNullableType:
                //return col([visitNode(cbNode, (<ts.JSDocNonNullableType>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocNullableType:
                //return col([visitNode(cbNode, (<ts.JSDocNullableType>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocRecordType:
                //return col([visitNodes(cbNodes, (<ts.JSDocRecordType>node).members)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocTypeReference:
                //return col([visitNode(cbNode, (<ts.JSDocTypeReference>node).name),
                //    visitNodes(cbNodes, (<ts.JSDocTypeReference>node).typeArguments)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocOptionalType:
                //return col([visitNode(cbNode, (<ts.JSDocOptionalType>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocFunctionType:
                //return col([visitNodes(cbNodes, (<ts.JSDocFunctionType>node).parameters),
                //    visitNode(cbNode, (<ts.JSDocFunctionType>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocVariadicType:
                //return col([visitNode(cbNode, (<ts.JSDocVariadicType>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocConstructorType:
                //return col([visitNode(cbNode, (<ts.JSDocConstructorType>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocThisType:
                //return col([visitNode(cbNode, (<ts.JSDocThisType>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocRecordMember:
                //return col([visitNode(cbNode, (<ts.JSDocRecordMember>node).name),
                //    visitNode(cbNode, (<ts.JSDocRecordMember>node).type)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocComment:
                //return col([visitNodes(cbNodes, (<ts.JSDocComment>node).tags)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocParameterTag:
                //return col([visitNode(cbNode, (<ts.JSDocParameterTag>node).preParameterName),
                //    visitNode(cbNode, (<ts.JSDocParameterTag>node).typeExpression),
                //    visitNode(cbNode, (<ts.JSDocParameterTag>node).postParameterName)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocReturnTag:
                //return col([visitNode(cbNode, (<ts.JSDocReturnTag>node).typeExpression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocTypeTag:
                //return col([visitNode(cbNode, (<ts.JSDocTypeTag>node).typeExpression)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.JSDocTemplateTag:
                //return col([visitNodes(cbNodes, (<ts.JSDocTemplateTag>node).typeParameters)]);
                return this.conc(this.children, n);
            case ts.SyntaxKind.FirstToken:
                return this.kind;
            case ts.SyntaxKind.EndOfFileToken:
                return this.kind;
            case ts.SyntaxKind.FirstTriviaToken:
                return this.kind;
            case ts.SyntaxKind.MultiLineCommentTrivia:
                return this.kind;
            case ts.SyntaxKind.NewLineTrivia:
                return this.kind;
            case ts.SyntaxKind.WhitespaceTrivia:
                return this.kind;
            case ts.SyntaxKind.ShebangTrivia:
                return this.kind;
            case ts.SyntaxKind.LastTriviaToken:
                return this.kind;
            case ts.SyntaxKind.FirstLiteralToken:
                return this.text;
            case ts.SyntaxKind.StringLiteral:
                return this.escapestring(this.text);
            case ts.SyntaxKind.RegularExpressionLiteral:
                return this.text;
            case ts.SyntaxKind.FirstTemplateToken:
                return this.kind;
            case ts.SyntaxKind.TemplateHead:
                return this.kind;
            case ts.SyntaxKind.TemplateMiddle:
                return this.kind;
            case ts.SyntaxKind.LastTemplateToken:
                return this.kind;
            case ts.SyntaxKind.FirstPunctuation:
                return this.kind;
            case ts.SyntaxKind.CloseBraceToken:
                return "}";
            case ts.SyntaxKind.OpenParenToken:
                return "(";
            case ts.SyntaxKind.CloseParenToken:
                return ")";
            case ts.SyntaxKind.OpenBracketToken:
                return "[";
            case ts.SyntaxKind.CloseBracketToken:
                return "]";
            case ts.SyntaxKind.DotToken:
                return ".";
            case ts.SyntaxKind.DotDotDotToken:
                return "...";
            case ts.SyntaxKind.SemicolonToken:
                return ";";
            case ts.SyntaxKind.CommaToken:
                return ",";
            case ts.SyntaxKind.FirstBinaryOperator:
                return " < ";
            case ts.SyntaxKind.LessThanSlashToken:
                return "</";
            case ts.SyntaxKind.GreaterThanToken:
                return " > ";
            case ts.SyntaxKind.LessThanEqualsToken:
                return "<=";
            case ts.SyntaxKind.GreaterThanEqualsToken:
                return ">=";
            case ts.SyntaxKind.EqualsEqualsToken:
                return "==";
            case ts.SyntaxKind.ExclamationEqualsToken:
                return "!=";
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
                return "===";
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
                return "!==";
            case ts.SyntaxKind.EqualsGreaterThanToken:
                return "=>";
            case ts.SyntaxKind.PlusToken:
                return "+";
            case ts.SyntaxKind.MinusToken:
                return "-";
            case ts.SyntaxKind.AsteriskToken:
                return "*";
            case ts.SyntaxKind.AsteriskAsteriskToken:
                return "**";
            case ts.SyntaxKind.SlashToken:
                return "/";
            case ts.SyntaxKind.PercentToken:
                return "%";
            case ts.SyntaxKind.PlusPlusToken:
                return "++";
            case ts.SyntaxKind.MinusMinusToken:
                return "--";
            case ts.SyntaxKind.LessThanLessThanToken:
                return "<<";
            case ts.SyntaxKind.GreaterThanGreaterThanToken:
                return ">>";
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
                return ">>>";
            case ts.SyntaxKind.AmpersandToken:
                return "&";
            case ts.SyntaxKind.BarToken:
                return "|";
            case ts.SyntaxKind.CaretToken:
                return "^";
            case ts.SyntaxKind.ExclamationToken:
                return "!";
            case ts.SyntaxKind.TildeToken:
                return "~";
            case ts.SyntaxKind.AmpersandAmpersandToken:
                return "&&";
            case ts.SyntaxKind.BarBarToken:
                return "||";
            case ts.SyntaxKind.QuestionToken:
                return "?";
            case ts.SyntaxKind.ColonToken:
                return ":";
            case ts.SyntaxKind.AtToken:
                return "@";
            case ts.SyntaxKind.FirstAssignment:
                return "=";
            case ts.SyntaxKind.PlusEqualsToken:
                return "+=";
            case ts.SyntaxKind.MinusEqualsToken:
                return "-=";
            case ts.SyntaxKind.AsteriskEqualsToken:
                return "*=";
            case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
                return "**=";
            case ts.SyntaxKind.SlashEqualsToken:
                return "/=";
            case ts.SyntaxKind.PercentEqualsToken:
                return "%=";
            case ts.SyntaxKind.LessThanLessThanEqualsToken:
                return "<<=";
            case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
                return ">>=";
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
                return ">>>=";
            case ts.SyntaxKind.AmpersandEqualsToken:
                return "&=";
            case ts.SyntaxKind.BarEqualsToken:
                return "|=";
            case ts.SyntaxKind.LastBinaryOperator:
                return this.kind;
            case ts.SyntaxKind.Identifier:
                if (this.text != "") {
                    if (this.perl) {
                        return "$" + this.text;
                    }
                    else {
                        return this.text;
                    }
                }
                return this.kind;
            case ts.SyntaxKind.FirstKeyword:
                return this.kind;
            case ts.SyntaxKind.CaseKeyword:
                return "case";
            case ts.SyntaxKind.CatchKeyword:
                return "catch";
            case ts.SyntaxKind.ClassKeyword:
                return "class";
            case ts.SyntaxKind.ConstKeyword:
                return "const";
            case ts.SyntaxKind.ContinueKeyword:
                return "continue";
            case ts.SyntaxKind.DebuggerKeyword:
                return "debugger";
            case ts.SyntaxKind.DefaultKeyword:
                return "default";
            case ts.SyntaxKind.DeleteKeyword:
                return "delete";
            case ts.SyntaxKind.DoKeyword:
                return "do";
            case ts.SyntaxKind.ElseKeyword:
                return "else";
            case ts.SyntaxKind.EnumKeyword:
                return "enum";
            case ts.SyntaxKind.ExportKeyword:
                return "export";
            case ts.SyntaxKind.ExtendsKeyword:
                return "extends";
            case ts.SyntaxKind.FalseKeyword:
                return "false";
            case ts.SyntaxKind.FinallyKeyword:
                return "finally";
            case ts.SyntaxKind.ForKeyword:
                return "for";
            case ts.SyntaxKind.FunctionKeyword:
                return "function";
            case ts.SyntaxKind.IfKeyword:
                return "if";
            case ts.SyntaxKind.ImportKeyword:
                return "import";
            case ts.SyntaxKind.InKeyword:
                return "in";
            case ts.SyntaxKind.InstanceOfKeyword:
                return "instanceof";
            case ts.SyntaxKind.NewKeyword:
                return "new";
            case ts.SyntaxKind.NullKeyword:
                return "null";
            case ts.SyntaxKind.ReturnKeyword:
                return "return";
            case ts.SyntaxKind.SuperKeyword:
                return "super";
            case ts.SyntaxKind.SwitchKeyword:
                return "switch";
            case ts.SyntaxKind.ThisKeyword:
                return "this";
            case ts.SyntaxKind.ThrowKeyword:
                return "throw";
            case ts.SyntaxKind.TrueKeyword:
                return "true";
            case ts.SyntaxKind.TryKeyword:
                return "try";
            case ts.SyntaxKind.TypeOfKeyword:
                return "type";
            case ts.SyntaxKind.VarKeyword:
                return "var";
            case ts.SyntaxKind.VoidKeyword:
                return "void";
            case ts.SyntaxKind.WhileKeyword:
                return "while";
            case ts.SyntaxKind.LastReservedWord:
                return this.kind;
            case ts.SyntaxKind.FirstFutureReservedWord:
                return this.kind;
            case ts.SyntaxKind.InterfaceKeyword:
                return "interface";
            case ts.SyntaxKind.LetKeyword:
                return "let";
            case ts.SyntaxKind.PackageKeyword:
                return "package";
            case ts.SyntaxKind.PrivateKeyword:
                return "private";
            case ts.SyntaxKind.ProtectedKeyword:
                return "protected";
            case ts.SyntaxKind.PublicKeyword:
                return "public";
            case ts.SyntaxKind.StaticKeyword:
                return "static";
            case ts.SyntaxKind.LastFutureReservedWord:
                return this.kind;
            case ts.SyntaxKind.AbstractKeyword:
                return "";
            case ts.SyntaxKind.AsKeyword:
                return "as";
            case ts.SyntaxKind.AnyKeyword:
                return "any";
            case ts.SyntaxKind.AsyncKeyword:
                return "async";
            case ts.SyntaxKind.AwaitKeyword:
                return "await";
            case ts.SyntaxKind.BooleanKeyword:
                return "boolean";
            case ts.SyntaxKind.ConstructorKeyword:
                return "constructor";
            case ts.SyntaxKind.DeclareKeyword:
                return "declare";
            case ts.SyntaxKind.GetKeyword:
                return "get";
            case ts.SyntaxKind.IsKeyword:
                return "is";
            case ts.SyntaxKind.ModuleKeyword:
                return "module";
            case ts.SyntaxKind.NamespaceKeyword:
                return "namespace";
            case ts.SyntaxKind.RequireKeyword:
                return "require";
            case ts.SyntaxKind.NumberKeyword:
                return "number";
            case ts.SyntaxKind.SetKeyword:
                return "set";
            case ts.SyntaxKind.StringKeyword:
                return "string";
            case ts.SyntaxKind.SymbolKeyword:
                return "symbol";
            case ts.SyntaxKind.TypeKeyword:
                return "type";
            case ts.SyntaxKind.FromKeyword:
                return "from";
            case ts.SyntaxKind.GlobalKeyword:
                return "global";
            case ts.SyntaxKind.LastToken:
                return this.kind;
            case ts.SyntaxKind.FirstNode:
                return this.kind;
            case ts.SyntaxKind.ComputedPropertyName:
                return this.kind;
            case ts.SyntaxKind.TypeParameter:
                return this.kind;
            case ts.SyntaxKind.Parameter:
                return this.kind;
            case ts.SyntaxKind.Decorator:
                return this.kind;
            case ts.SyntaxKind.PropertySignature:
                return this.kind;
            case ts.SyntaxKind.PropertyDeclaration:
                return this.kind;
            case ts.SyntaxKind.MethodSignature:
                return this.kind;
            case ts.SyntaxKind.MethodDeclaration:
                return this.kind;
            case ts.SyntaxKind.Constructor:
                return this.kind;
            case ts.SyntaxKind.GetAccessor:
                return this.kind;
            case ts.SyntaxKind.SetAccessor:
                return this.kind;
            case ts.SyntaxKind.CallSignature:
                return this.kind;
            case ts.SyntaxKind.ConstructSignature:
                return this.kind;
            case ts.SyntaxKind.IndexSignature:
                return this.kind;
            case ts.SyntaxKind.FirstTypeNode:
                return this.kind;
            case ts.SyntaxKind.TypeReference:
                return this.kind;
            case ts.SyntaxKind.FunctionType:
                return this.kind;
            case ts.SyntaxKind.ConstructorType:
                return this.kind;
            case ts.SyntaxKind.TypeQuery:
                return this.kind;
            case ts.SyntaxKind.TypeLiteral:
                return this.kind;
            case ts.SyntaxKind.ArrayType:
                return this.kind;
            case ts.SyntaxKind.TupleType:
                return this.kind;
            case ts.SyntaxKind.UnionType:
                return this.kind;
            case ts.SyntaxKind.IntersectionType:
                return this.kind;
            case ts.SyntaxKind.ParenthesizedType:
                return this.kind;
            case ts.SyntaxKind.ThisType:
                return this.kind;
            case ts.SyntaxKind.LastTypeNode:
                return this.kind;
            case ts.SyntaxKind.ObjectBindingPattern:
                return this.kind;
            case ts.SyntaxKind.ArrayBindingPattern:
                return this.kind;
            case ts.SyntaxKind.BindingElement:
                return this.kind;
            case ts.SyntaxKind.ArrayLiteralExpression:
                return this.kind;
            case ts.SyntaxKind.ObjectLiteralExpression:
                return this.kind;
            case ts.SyntaxKind.PropertyAccessExpression:
                return this.kind;
            case ts.SyntaxKind.ElementAccessExpression:
                return this.kind;
            case ts.SyntaxKind.CallExpression:
                return this.kind;
            case ts.SyntaxKind.NewExpression:
                return this.kind;
            case ts.SyntaxKind.TaggedTemplateExpression:
                return this.kind;
            case ts.SyntaxKind.TypeAssertionExpression:
                return this.kind;
            case ts.SyntaxKind.ParenthesizedExpression:
                return this.kind;
            case ts.SyntaxKind.FunctionExpression:
                return this.kind;
            case ts.SyntaxKind.ArrowFunction:
                return this.kind;
            case ts.SyntaxKind.DeleteExpression:
                return this.kind;
            case ts.SyntaxKind.TypeOfExpression:
                return this.kind;
            case ts.SyntaxKind.VoidExpression:
                return this.kind;
            case ts.SyntaxKind.AwaitExpression:
                return this.kind;
            case ts.SyntaxKind.PrefixUnaryExpression:
                return this.kind;
            case ts.SyntaxKind.PostfixUnaryExpression:
                return this.kind;
            case ts.SyntaxKind.BinaryExpression:
                return this.kind;
            case ts.SyntaxKind.ConditionalExpression:
                return this.kind;
            case ts.SyntaxKind.TemplateExpression:
                return this.kind;
            case ts.SyntaxKind.YieldExpression:
                return this.kind;
            case ts.SyntaxKind.SpreadElementExpression:
                return this.kind;
            case ts.SyntaxKind.ClassExpression:
                return this.kind;
            case ts.SyntaxKind.OmittedExpression:
                return this.kind;
            case ts.SyntaxKind.ExpressionWithTypeArguments:
                return this.kind;
            case ts.SyntaxKind.AsExpression:
                return this.kind;
            case ts.SyntaxKind.TemplateSpan:
                return this.kind;
            case ts.SyntaxKind.SemicolonClassElement:
                return this.kind;
            case ts.SyntaxKind.Block:
                return this.kind;
            case ts.SyntaxKind.VariableStatement:
                return this.kind;
            case ts.SyntaxKind.EmptyStatement:
                return this.kind;
            case ts.SyntaxKind.ExpressionStatement:
                return this.kind;
            case ts.SyntaxKind.IfStatement:
                return this.kind;
            case ts.SyntaxKind.DoStatement:
                return this.kind;
            case ts.SyntaxKind.WhileStatement:
                return this.kind;
            case ts.SyntaxKind.ForStatement:
                return this.kind;
            case ts.SyntaxKind.ForInStatement:
                return this.kind;
            case ts.SyntaxKind.ForOfStatement:
                return this.kind;
            case ts.SyntaxKind.ContinueStatement:
                return this.kind;
            case ts.SyntaxKind.BreakStatement:
                return this.kind;
            case ts.SyntaxKind.ReturnStatement:
                return this.kind;
            case ts.SyntaxKind.WithStatement:
                return this.kind;
            case ts.SyntaxKind.SwitchStatement:
                return this.kind;
            case ts.SyntaxKind.LabeledStatement:
                return this.kind;
            case ts.SyntaxKind.ThrowStatement:
                return this.kind;
            case ts.SyntaxKind.TryStatement:
                return this.kind;
            case ts.SyntaxKind.DebuggerStatement:
                return this.kind;
            case ts.SyntaxKind.VariableDeclaration:
                return this.kind;
            case ts.SyntaxKind.VariableDeclarationList:
                return this.kind;
            case ts.SyntaxKind.FunctionDeclaration:
                return this.kind;
            case ts.SyntaxKind.ClassDeclaration:
                return this.kind;
            case ts.SyntaxKind.InterfaceDeclaration:
                return this.kind;
            case ts.SyntaxKind.TypeAliasDeclaration:
                return this.kind;
            case ts.SyntaxKind.EnumDeclaration:
                return this.kind;
            case ts.SyntaxKind.ModuleDeclaration:
                return this.kind;
            case ts.SyntaxKind.ModuleBlock:
                return this.kind;
            case ts.SyntaxKind.CaseBlock:
                return this.kind;
            case ts.SyntaxKind.ImportEqualsDeclaration:
                return this.kind;
            case ts.SyntaxKind.ImportDeclaration:
                return this.kind;
            case ts.SyntaxKind.ImportClause:
                return this.kind;
            case ts.SyntaxKind.NamespaceImport:
                return this.kind;
            case ts.SyntaxKind.NamedImports:
                return this.kind;
            case ts.SyntaxKind.ImportSpecifier:
                return this.kind;
            case ts.SyntaxKind.ExportAssignment:
                return this.kind;
            case ts.SyntaxKind.ExportDeclaration:
                return this.kind;
            case ts.SyntaxKind.NamedExports:
                return this.kind;
            case ts.SyntaxKind.ExportSpecifier:
                return this.kind;
            case ts.SyntaxKind.MissingDeclaration:
                return this.kind;
            case ts.SyntaxKind.ExternalModuleReference:
                return this.kind;
            case ts.SyntaxKind.JsxElement:
                return this.kind;
            case ts.SyntaxKind.JsxSelfClosingElement:
                return this.kind;
            case ts.SyntaxKind.JsxOpeningElement:
                return this.kind;
            case ts.SyntaxKind.JsxText:
                return this.kind;
            case ts.SyntaxKind.JsxClosingElement:
                return this.kind;
            case ts.SyntaxKind.JsxAttribute:
                return this.kind;
            case ts.SyntaxKind.JsxSpreadAttribute:
                return this.kind;
            case ts.SyntaxKind.JsxExpression:
                return this.kind;
            case ts.SyntaxKind.CaseClause:
                return this.kind;
            case ts.SyntaxKind.DefaultClause:
                return this.kind;
            case ts.SyntaxKind.HeritageClause:
                return this.kind;
            case ts.SyntaxKind.CatchClause:
                return this.kind;
            case ts.SyntaxKind.PropertyAssignment:
                return this.kind;
            case ts.SyntaxKind.ShorthandPropertyAssignment:
                return this.kind;
            case ts.SyntaxKind.EnumMember:
                return this.kind;
            case ts.SyntaxKind.SourceFile:
                return this.kind;
            case ts.SyntaxKind.JSDocTypeExpression:
                return this.kind;
            case ts.SyntaxKind.JSDocAllType:
                return this.kind;
            case ts.SyntaxKind.JSDocUnknownType:
                return this.kind;
            case ts.SyntaxKind.JSDocArrayType:
                return this.kind;
            case ts.SyntaxKind.JSDocUnionType:
                return this.kind;
            case ts.SyntaxKind.JSDocTupleType:
                return this.kind;
            case ts.SyntaxKind.JSDocNullableType:
                return this.kind;
            case ts.SyntaxKind.JSDocNonNullableType:
                return this.kind;
            case ts.SyntaxKind.JSDocRecordType:
                return this.kind;
            case ts.SyntaxKind.JSDocRecordMember:
                return this.kind;
            case ts.SyntaxKind.JSDocTypeReference:
                return this.kind;
            case ts.SyntaxKind.JSDocOptionalType:
                return this.kind;
            case ts.SyntaxKind.JSDocFunctionType:
                return this.kind;
            case ts.SyntaxKind.JSDocVariadicType:
                return this.kind;
            case ts.SyntaxKind.JSDocConstructorType:
                return this.kind;
            case ts.SyntaxKind.JSDocThisType:
                return this.kind;
            case ts.SyntaxKind.JSDocComment:
                return this.kind;
            case ts.SyntaxKind.JSDocTag:
                return this.kind;
            case ts.SyntaxKind.JSDocParameterTag:
                return this.kind;
            case ts.SyntaxKind.JSDocReturnTag:
                return this.kind;
            case ts.SyntaxKind.JSDocTypeTag:
                return this.kind;
            case ts.SyntaxKind.JSDocTemplateTag:
                return this.kind;
            case ts.SyntaxKind.SyntaxList:
                return this.kind;
        }
        return this.kind;
    };
    return ParseObject;
}());
module.exports = ParseObject;
//# sourceMappingURL=ParseObject.js.map