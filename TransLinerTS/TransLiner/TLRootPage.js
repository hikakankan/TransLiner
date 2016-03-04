var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TLRootPage = (function (_super) {
    __extends(TLRootPage, _super);
    function TLRootPage(title, text, NoTitle) {
        _super.call(this, title, text, null, NoTitle);
        this.root = this;
    }
    Object.defineProperty(TLRootPage.prototype, "SelectedPage", {
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
    TLRootPage.prototype.MoveLeftUp = function () {
        return this.MoveLeft(null, -1, null, -1, 0);
    };
    TLRootPage.prototype.MoveLeftDown = function () {
        return this.MoveLeft(null, -1, null, -1, 1);
    };
    TLRootPage.prototype.MoveUpRightTop = function () {
        return this.MoveRight(null, -1, -1, -1, true);
    };
    TLRootPage.prototype.MoveUpRightBottom = function () {
        return this.MoveRight(null, -1, -1, -1, false);
    };
    TLRootPage.prototype.MoveDownRightTop = function () {
        return this.MoveRight(null, -1, 1, 0, true);
    };
    TLRootPage.prototype.MoveDownRightBottom = function () {
        return this.MoveRight(null, -1, 1, 0, false);
    };
    TLRootPage.prototype.MoveUp = function () {
        return this.Move(null, -1, -1) || this.MoveLeftUp();
    };
    TLRootPage.prototype.MoveDown = function () {
        return this.Move(null, -1, 1) || this.MoveLeftDown();
    };
    TLRootPage.prototype.CreateUp = function () {
        return this.Create(null, -1, 0);
    };
    TLRootPage.prototype.CreateDown = function () {
        return this.Create(null, -1, 1);
    };
    TLRootPage.prototype.CreateRightTop = function () {
        return this.CreateRight(null, -1, true);
    };
    TLRootPage.prototype.CreateRightBottom = function () {
        return this.CreateRight(null, -1, false);
    };
    TLRootPage.prototype.DuplicateUp = function () {
        return this.Duplicate(null, -1, 0);
    };
    TLRootPage.prototype.DuplicateDown = function () {
        return this.Duplicate(null, -1, 1);
    };
    TLRootPage.prototype.DuplicateRightTop = function () {
        return this.DuplicateRight(null, -1, true);
    };
    TLRootPage.prototype.DuplicateRightBottom = function () {
        return this.DuplicateRight(null, -1, false);
    };
    TLRootPage.prototype.DeleteSelectedItem = function () {
        return this.Delete(null, -1);
    };
    TLRootPage.prototype.SelectedUp = function () {
        return this.SelectedMove(null, -1, -1);
    };
    TLRootPage.prototype.SelectedDown = function () {
        return this.SelectedMove(null, -1, 1);
    };
    TLRootPage.prototype.Expand = function () {
        return this.ExpandedChange(null, -1, true);
    };
    TLRootPage.prototype.Unexpand = function () {
        return this.ExpandedChange(null, -1, false);
    };
    TLRootPage.prototype.loadXML = function (xml) {
        this.IsExpanded = false;
        this.SubPages.Clear();
        this.FromXml(xml);
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
//# sourceMappingURL=TLRootPage.js.map