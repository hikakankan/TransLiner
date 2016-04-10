"use strict";
var http = require('http');
var fs = require("fs");
var url = require("url");
var TLRootPage = require("./TLRootPageServer");
var TLPageSettings = require("./TLPageSettingsServer");
var setting = new TLPageSettings();
var root = new TLRootPage("", "", setting);
root.Load("./sample.json");
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    var urls = url.parse(req.url);
    console.log("pathname=" + urls.pathname + " href=" + urls.href + " method=" + req.method);
    if (req.method == "GET") {
        if (urls.pathname == "/tlcom.command") {
            console.log("urls.query=" + urls.query);
            var name = query_get_value(urls.query, "name");
            console.log("name=" + name);
            var path = query_get_value(urls.query, "path");
            console.log("path=" + path);
            if (name == "getpage") {
                if (root.Settings.PageLoad) {
                    // パスを指定されたページをロード
                    write_json(res, root.getPageByPathString(path).ToJSON());
                }
                else {
                    // 全体をロード
                    write_json(res, root.ToJSON());
                }
            }
            else if (name == "MoveUp") {
                exec_command(name, path, res);
            }
            else if (name == "MoveDown") {
                exec_command(name, path, res);
            }
            else if (name == "MoveLeftUp") {
                exec_command(name, path, res);
            }
            else if (name == "MoveDownRightTop") {
                exec_command(name, path, res);
            }
            else {
                write_json(res, { "Title": "エラー", "Text": "コマンドが間違っています", "SubPages": [] });
            }
        }
        else if (urls.pathname == "/") {
            read_write(res, "/transliner.html");
        }
        else {
            read_write(res, urls.pathname);
        }
    }
}).listen(port);
function query_get_value(query, name) {
    if (query == null) {
        return "";
    }
    var qss = query.split("&");
    for (var i = 0; i < qss.length; i++) {
        //console.log(qss[i]);
        var q = qss[i].split("=");
        if (q[0] == name) {
            return q[1];
        }
    }
    return "";
}
function exec_command(name, path, response) {
    root.UnselectAll();
    root.getPageByPathString(path).IsSelected = true;
    console.log("exec_command before receiveCommand");
    var result = root.receiveCommand(name);
    console.log("exec_command after receiveCommand");
    write_bool(response, result);
}
function get_content_type(filename) {
    var index = filename.lastIndexOf(".");
    if (index >= 0) {
        var ext = filename.substr(index + 1);
        if (ext == "js") {
            return "text/javascript";
        }
        return "text/" + ext;
    }
    return "text/plain";
}
function read_write(response, filename) {
    fs.readFile("." + filename, "UTF-8", function (err, data) {
        if (err) {
            console.log("readFile error: " + filename);
            throw err;
        }
        response.writeHead(200, { "Content-Type": get_content_type(filename) });
        response.write(data);
        response.end();
    });
}
function write_json(response, json) {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(json));
    response.end();
}
function write_text(response, text) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write(text);
    response.end();
}
function write_bool(response, val) {
    if (val) {
        write_text(response, "true");
    }
    else {
        write_text(response, "false");
    }
}
//# sourceMappingURL=server.js.map