//<server>var TLPage = require("./TLPageServer.js"); // サーバー用
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TLRootPage = (function (_super) {
    __extends(TLRootPage, _super);
    function TLRootPage(title, text, settings) {
        _super.call(this, title, text, null, settings);
        this.serverSide = false; // ブラウザ側で実行する //<browser> ブラウザ用
        this.root = this;
    }
    Object.defineProperty(TLRootPage.prototype, "SelectedPage", {
        get: function () {
            return this.SelectedPage_;
        },
        set: function (page) {
            this.UnselectAll();
            page.IsSelected = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TLRootPage.prototype, "SelectedText", {
        get: function () {
            var selectedPage = this.SelectedPage;
            if (selectedPage != null) {
                return selectedPage.Text;
            }
            return "";
        },
        set: function (value) {
            var selectedPage = this.SelectedPage;
            if (selectedPage != null) {
                selectedPage.Text = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    //<server>private serverSide = true; // サーバー側で実行する
    TLRootPage.prototype.execCommand = function (command, actual_proc) {
        if (this.Settings.NoServer || this.serverSide) {
            // サーバーを使わないか、サーバー側のときは実際に動作する処理を行う
            return actual_proc();
        }
        else {
            // サーバーを使うときのブラウザ側の処理 コマンドを送信
            this.setPath("0");
            var path = this.SelectedPage.getPagePath();
            var request = new XMLHttpRequest();
            request.open("GET", "tlcom.command?name=" + command + "&path=" + path, false);
            request.send(null);
            return request.responseText == "true" && actual_proc(); // ブラウザ側のツリーも更新
        }
    };
    TLRootPage.prototype.receiveCommand = function (command) {
        // コマンドを受け取ったサーバー側の処理
        if (command == "MoveLeftUp") {
            return this.MoveLeftUp_();
        }
        else if (command == "MoveLeftDown") {
            return this.MoveLeftDown_();
        }
        else if (command == "MoveUpRightTop") {
            return this.MoveUpRightTop_();
        }
        else if (command == "MoveUpRightBottom") {
            return this.MoveUpRightBottom_();
        }
        else if (command == "MoveDownRightTop") {
            return this.MoveDownRightTop_();
        }
        else if (command == "MoveDownRightBottom") {
            return this.MoveDownRightBottom_();
        }
        else if (command == "MoveUp") {
            return this.MoveUp_();
        }
        else if (command == "MoveDown") {
            return this.MoveDown_();
        }
        else if (command == "CreateUp") {
            return this.CreateUp_();
        }
        else if (command == "CreateDown") {
            return this.CreateDown_();
        }
        else if (command == "CreateRightTop") {
            return this.CreateRightTop_();
        }
        else if (command == "CreateRightBottom") {
            return this.CreateRightBottom_();
        }
        else if (command == "DuplicateUp") {
            return this.DuplicateUp_();
        }
        else if (command == "DuplicateDown") {
            return this.DuplicateDown_();
        }
        else if (command == "DuplicateRightTop") {
            return this.DuplicateRightTop_();
        }
        else if (command == "DuplicateRightBottom") {
            return this.DuplicateRightBottom_();
        }
        else if (command == "DeleteSelectedItem") {
            return this.DeleteSelectedItem_();
        }
        else if (command == "Expand") {
            return this.Expand_();
        }
        else if (command == "Unexpand") {
            return this.Unexpand_();
        }
        return false;
    };
    TLRootPage.prototype.MoveLeftUp_ = function () {
        return this.MoveLeft(null, -1, null, -1, 0);
    };
    TLRootPage.prototype.MoveLeftUp = function () {
        var _this = this;
        return this.execCommand("MoveLeftUp", function () { return _this.MoveLeftUp_(); });
    };
    TLRootPage.prototype.MoveLeftDown_ = function () {
        return this.MoveLeft(null, -1, null, -1, 1);
    };
    TLRootPage.prototype.MoveLeftDown = function () {
        var _this = this;
        return this.execCommand("MoveLeftDown", function () { return _this.MoveLeftDown_(); });
    };
    TLRootPage.prototype.MoveUpRightTop_ = function () {
        return this.MoveRight(null, -1, -1, -1, true);
    };
    TLRootPage.prototype.MoveUpRightTop = function () {
        var _this = this;
        return this.execCommand("MoveUpRightTop", function () { return _this.MoveUpRightTop_(); });
    };
    TLRootPage.prototype.MoveUpRightBottom_ = function () {
        return this.MoveRight(null, -1, -1, -1, false);
    };
    TLRootPage.prototype.MoveUpRightBottom = function () {
        var _this = this;
        return this.execCommand("MoveUpRightBottom", function () { return _this.MoveUpRightBottom_(); });
    };
    TLRootPage.prototype.MoveDownRightTop_ = function () {
        return this.MoveRight(null, -1, 1, 0, true);
    };
    TLRootPage.prototype.MoveDownRightTop = function () {
        var _this = this;
        return this.execCommand("MoveDownRightTop", function () { return _this.MoveDownRightTop_(); });
    };
    TLRootPage.prototype.MoveDownRightBottom_ = function () {
        return this.MoveRight(null, -1, 1, 0, false);
    };
    TLRootPage.prototype.MoveDownRightBottom = function () {
        var _this = this;
        return this.execCommand("MoveDownRightBottom", function () { return _this.MoveDownRightBottom_(); });
    };
    TLRootPage.prototype.MoveUp_ = function () {
        return this.Move(null, -1, -1) || this.MoveLeftUp_();
    };
    TLRootPage.prototype.MoveUp = function () {
        var _this = this;
        return this.execCommand("MoveUp", function () { return _this.MoveUp_(); });
    };
    TLRootPage.prototype.MoveDown_ = function () {
        return this.Move(null, -1, 1) || this.MoveLeftDown_();
    };
    TLRootPage.prototype.MoveDown = function () {
        var _this = this;
        return this.execCommand("MoveDown", function () { return _this.MoveDown_(); });
    };
    TLRootPage.prototype.CreateUp_ = function () {
        return this.Create(null, -1, 0);
    };
    TLRootPage.prototype.CreateUp = function () {
        var _this = this;
        return this.execCommand("CreateUp", function () { return _this.CreateUp_(); });
    };
    TLRootPage.prototype.CreateDown_ = function () {
        return this.Create(null, -1, 1);
    };
    TLRootPage.prototype.CreateDown = function () {
        var _this = this;
        return this.execCommand("CreateDown", function () { return _this.CreateDown_(); });
    };
    TLRootPage.prototype.CreateRightTop_ = function () {
        return this.CreateRight(null, -1, true);
    };
    TLRootPage.prototype.CreateRightTop = function () {
        var _this = this;
        return this.execCommand("CreateRightTop", function () { return _this.CreateRightTop_(); });
    };
    TLRootPage.prototype.CreateRightBottom_ = function () {
        return this.CreateRight(null, -1, false);
    };
    TLRootPage.prototype.CreateRightBottom = function () {
        var _this = this;
        return this.execCommand("CreateRightBottom", function () { return _this.CreateRightBottom_(); });
    };
    TLRootPage.prototype.DuplicateUp_ = function () {
        return this.Duplicate(null, -1, 0);
    };
    TLRootPage.prototype.DuplicateUp = function () {
        var _this = this;
        return this.execCommand("DuplicateUp", function () { return _this.DuplicateUp_(); });
    };
    TLRootPage.prototype.DuplicateDown_ = function () {
        return this.Duplicate(null, -1, 1);
    };
    TLRootPage.prototype.DuplicateDown = function () {
        var _this = this;
        return this.execCommand("DuplicateDown", function () { return _this.DuplicateDown_(); });
    };
    TLRootPage.prototype.DuplicateRightTop_ = function () {
        return this.DuplicateRight(null, -1, true);
    };
    TLRootPage.prototype.DuplicateRightTop = function () {
        var _this = this;
        return this.execCommand("DuplicateRightTop", function () { return _this.DuplicateRightTop_(); });
    };
    TLRootPage.prototype.DuplicateRightBottom_ = function () {
        return this.DuplicateRight(null, -1, false);
    };
    TLRootPage.prototype.DuplicateRightBottom = function () {
        var _this = this;
        return this.execCommand("DuplicateRightBottom", function () { return _this.DuplicateRightBottom_(); });
    };
    TLRootPage.prototype.DeleteSelectedItem_ = function () {
        return this.Delete(null, -1);
    };
    TLRootPage.prototype.DeleteSelectedItem = function () {
        var _this = this;
        return this.execCommand("DeleteSelectedItem", function () { return _this.DeleteSelectedItem_(); });
    };
    TLRootPage.prototype.SelectedUp = function () {
        return this.SelectedMove(null, -1, -1);
    };
    TLRootPage.prototype.SelectedDown = function () {
        return this.SelectedMove(null, -1, 1);
    };
    TLRootPage.prototype.Expand_ = function () {
        return this.ExpandedChange(null, -1, true);
    };
    TLRootPage.prototype.Expand = function () {
        //return this.execCommand("Expand", this.Expand_);
        return this.Expand_();
    };
    TLRootPage.prototype.Unexpand_ = function () {
        return this.ExpandedChange(null, -1, false);
    };
    TLRootPage.prototype.Unexpand = function () {
        //return this.execCommand("Unexpand", this.Unexpand_);
        return this.Unexpand_();
    };
    TLRootPage.prototype.loadXML = function (xml) {
        this.IsExpanded = false;
        this.SubPages.Clear();
        this.FromXml(xml);
    };
    TLRootPage.prototype.loadJSON = function (obj) {
        this.IsExpanded = false;
        this.SubPages.Clear();
        this.FromJSON(obj);
    };
    TLRootPage.prototype.loadText = function (text, path) {
        this.IsExpanded = false;
        this.SubPages.Clear();
        this.FromText2(text, ".", path);
    };
    TLRootPage.prototype.GetFileNameWithoutExtension = function (path) {
        var index_sep = path.lastIndexOf("\\");
        if (index_sep >= 0) {
            path = path.substring(index_sep + 1);
        }
        var index_ext = path.lastIndexOf(".");
        if (index_ext >= 0) {
            path = path.substring(0, index_ext);
        }
        return path;
    };
    TLRootPage.prototype.makeSections = function (text, header, path) {
        var result = new Array();
        var sections = text.split("\r\n" + header);
        var first = true;
        for (var _i = 0; _i < sections.length; _i++) {
            var section = sections[_i];
            if (first && section.length > 0) {
                if (this.StartsWith(section, header)) {
                    result.push(this.GetFileNameWithoutExtension(path));
                    result.push(section.substring(1));
                }
                else {
                    result.push(section);
                }
            }
            else {
                result.push(section);
            }
            first = false;
        }
        return result;
    };
    /// <summary>
    /// WZ形式のテキストを読み込む
    /// </summary>
    /// <param name="text"></param>
    /// <param name="header"></param>
    /// <param name="path">ファイルのパス。ルートのテキストがないときファイル名をテキストにする。</param>
    TLRootPage.prototype.FromText2 = function (text, header, path) {
        this.FromText(this.makeSections(text, header, path), header);
    };
    return TLRootPage;
})(TLPage);
//<server>module.exports = TLRootPage; // サーバー用
//# sourceMappingURL=TLRootPage.js.map