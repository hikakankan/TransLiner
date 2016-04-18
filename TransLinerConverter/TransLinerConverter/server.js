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
function setParent(pobj, list) {
    if (list) {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var obj = list_1[_i];
            if (obj) {
                obj.setParent(pobj);
            }
        }
    }
}
function convertNodesToObject(nodes) {
    var list = new Array();
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        list.push(convertToObject(node));
    }
    var pobj = new ParseObject(null, null, list, null);
    setParent(pobj, list);
    return pobj;
}
function collectChildren(children) {
    var pobj = new ParseObject(null, children, null, null);
    setParent(pobj, children);
    return pobj;
}
function syntaxKindToObject(syntaxKind) {
    return new ParseObject(null, null, null, syntaxKind);
}
var fs = require("fs");
var file = "TLPage.ts"; // この用途は不明
function convertFile(filename_src, filename_dest) {
    var text = fs.readFileSync(filename_src, "UTF-8");
    var sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, /*setParentPointers*/ true);
    var result = convertToObject(sourceFile).toTypeScript(" ", -1);
    fs.writeFileSync(filename_dest, result, "UTF-8");
}
convertFile("./TLPage.ts", "./TLPage.pm");
convertFile("./TLRootPage.ts", "./TLRootPage.pm");
convertFile("./TLPageSettings.ts", "./TLPageSettings.pm");
var http = require('http');
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("終了\r\n", "UTF-8");
    res.end();
}).listen(port);
//# sourceMappingURL=server.js.map