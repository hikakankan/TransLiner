import * as ts from "typescript";
//import convert = require("./convert");
import * as convert from "./convert";
import ParseObject = require("./ParseObject");

function convertToObject(node: ts.Node): ParseObject {
    var obj = convert.forEachChild(node, convertToObject, convertNodesToObject, collectChildren, syntaxKindToObject);
    //var children = ts.forEachChild(node, convertToObject, convertNodesToObject);
    if (obj) {
        return new ParseObject(node, obj.children, null, null);
    } else {
        return new ParseObject(node, null, null, null);
    }
}

function convertNodesToObject(nodes: ts.Node[]): ParseObject {
    var list = new Array();
    for (var node of nodes) {
        list.push(convertToObject(node));
    }
    return new ParseObject(null, null, list, null);
}

function collectChildren(children: ParseObject[]): ParseObject {
    return new ParseObject(null, children, null, null);
}

function syntaxKindToObject(syntaxKind: ts.SyntaxKind): ParseObject {
    return new ParseObject(null, null, null, syntaxKind);
}

import * as fs from "fs";

var filename = "./TLPage.ts";

let text = fs.readFileSync(filename, "UTF-8");

let sourceFile = ts.createSourceFile("file.ts", text, ts.ScriptTarget.Latest, /*setParentPointers*/ true);
//let result = convertToObject(sourceFile).print(0);
let result = convertToObject(sourceFile).toTypeScript(" ", -1);

//let caselist = "";
//for (var i = 0; i < ts.SyntaxKind.Count; i++) {
//    caselist += "case ts.SyntaxKind." + ts.SyntaxKind[i] + ":\r\n";
//    caselist += "    return this.kind;\r\n";
//}

import http = require('http');
var port = process.env.port || 1337
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(result + "\r\n");
    //res.end(caselist + "\r\n");
}).listen(port);
