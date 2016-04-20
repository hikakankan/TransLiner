import * as ts from "typescript";
//import convert = require("./convert");
import * as convert from "./convert";
import ParseObject = require("./ParseObject");

function setParent(pobj: ParseObject, list: ParseObject[]): void {
    if (list) {
        for (var obj of list) {
            if (obj) {
                obj.setParent(pobj);
            }
        }
    }
}

function createParseObject(node: ts.Node, children: ParseObject[], list: ParseObject[], syntaxKind: ts.SyntaxKind) {
    var pobj = new ParseObject(node, children, list, syntaxKind);
    setParent(pobj, children);
    setParent(pobj, list);
    return pobj;
}

function convertToObject(node: ts.Node): ParseObject {
    var obj = convert.forEachChild(node, convertToObject, convertNodesToObject, collectChildren, syntaxKindToObject);
    //var children = ts.forEachChild(node, convertToObject, convertNodesToObject);
    if (obj) {
        return createParseObject(node, obj.children, null, null);
        //var pobj = new ParseObject(node, obj.children, null, null);
        //setParent(pobj, obj.children);
        //return pobj;
    } else {
        return createParseObject(node, null, null, null);
        //return new ParseObject(node, null, null, null);
    }
}

function convertNodesToObject(nodes: ts.Node[]): ParseObject {
    var list = new Array();
    for (var node of nodes) {
        list.push(convertToObject(node));
    }
    return createParseObject(null, null, list, null);
    //var pobj = new ParseObject(null, null, list, null);
    //setParent(pobj, list);
    //return pobj;
}

function collectChildren(children: ParseObject[]): ParseObject {
    return createParseObject(null, children, null, null);
    //var pobj = new ParseObject(null, children, null, null);
    //setParent(pobj, children);
    //return pobj;
}

function syntaxKindToObject(syntaxKind: ts.SyntaxKind): ParseObject {
    return new ParseObject(null, null, null, syntaxKind);
}

import * as fs from "fs";

var file = "TLPage.ts"; // この用途は不明

function convertFile(filename_src: string, filename_dest: string) {
    let text = fs.readFileSync(filename_src, "UTF-8");
    let sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, /*setParentPointers*/ true);
    let result = convertToObject(sourceFile).toTypeScript(" ", -1);
    fs.writeFileSync(filename_dest, result, "UTF-8");
}

convertFile("./TLPage.ts", "./TLPage.pm");
convertFile("./TLRootPage.ts", "./TLRootPage.pm");
convertFile("./TLPageSettings.ts", "./TLPageSettings.pm");

import http = require('http');
var port = process.env.port || 1337
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("終了\r\n", "UTF-8");
    res.end();
}).listen(port);
