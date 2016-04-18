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

function setParent(pobj: ParseObject, list: ParseObject[]): void {
    if (list) {
        for (var obj of list) {
            if (obj) {
                obj.setParent(pobj);
            }
        }
    }
}

function convertNodesToObject(nodes: ts.Node[]): ParseObject {
    var list = new Array();
    for (var node of nodes) {
        list.push(convertToObject(node));
    }
    var pobj = new ParseObject(null, null, list, null);
    setParent(pobj, list);
    return pobj;
}

function collectChildren(children: ParseObject[]): ParseObject {
    var pobj = new ParseObject(null, children, null, null);
    setParent(pobj, children);
    return pobj;
}

function syntaxKindToObject(syntaxKind: ts.SyntaxKind): ParseObject {
    return new ParseObject(null, null, null, syntaxKind);
}

import * as fs from "fs";

var filename = "./TLPage.ts";
var filename_dest = "./TLPage.pm";

let text = fs.readFileSync(filename, "UTF-8");

let sourceFile = ts.createSourceFile("TLPage.ts", text, ts.ScriptTarget.Latest, /*setParentPointers*/ true);
//let result = convertToObject(sourceFile).print(0);
let obj = convertToObject(sourceFile);
obj.setParent(null);
let result = obj.toTypeScript(" ", -1);

fs.writeFileSync(filename_dest, result, "UTF-8");

//let caselist = "";
//for (var i = 0; i < ts.SyntaxKind.Count; i++) {
//    caselist += "case ts.SyntaxKind." + ts.SyntaxKind[i] + ":\r\n";
//    caselist += "    return this.kind;\r\n";
//}

import http = require('http');
var port = process.env.port || 1337
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(result + "\r\n", "UTF-8");
    res.end();
    //res.end(result + "\r\n", "utf-8");
    //res.end(caselist + "\r\n");
}).listen(port);
