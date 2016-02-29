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
    return TLRootPage;
})(TLPage);
//# sourceMappingURL=TLRootPage.js.map