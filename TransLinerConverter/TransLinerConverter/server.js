"use strict";
var ts = require("typescript");
//import convert = require("./convert");
var convert = require("./convert");
var ParseObject = require("./ParseObject");
function convertToObject(node) {
    var obj = convert.forEachChild(node, convertToObject, convertNodesToObject, collectChildren, syntaxKindToObject);
    //var children = ts.forEachChild(node, convertToObject, convertNodesToObject);
    if (obj) {
        return new ParseObject(node, obj.children, null, null);
    }
    else {
        return new ParseObject(node, null, null, null);
    }
}
function convertNodesToObject(nodes) {
    var list = new Array();
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        list.push(convertToObject(node));
    }
    return new ParseObject(null, null, list, null);
}
function collectChildren(children) {
    return new ParseObject(null, children, null, null);
}
function syntaxKindToObject(syntaxKind) {
    return new ParseObject(null, null, null, syntaxKind);
}
var fs = require("fs");
var filename = "./TLPage.ts";
var text = fs.readFileSync(filename, "UTF-8");
var sourceFile = ts.createSourceFile("file.ts", text, ts.ScriptTarget.Latest, /*setParentPointers*/ true);
//let result = convertToObject(sourceFile).print(0);
var result = convertToObject(sourceFile).toTypeScript(" ", -1);
//let caselist = "";
//for (var i = 0; i < ts.SyntaxKind.Count; i++) {
//    caselist += "case ts.SyntaxKind." + ts.SyntaxKind[i] + ":\r\n";
//    caselist += "    return this.kind;\r\n";
//}
var http = require('http');
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(result + "\r\n");
    //res.end(caselist + "\r\n");
}).listen(port);
//# sourceMappingURL=server.js.map