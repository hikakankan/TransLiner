var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TVCheckBox = (function (_super) {
    __extends(TVCheckBox, _super);
    //private NoTitle: boolean;
    function TVCheckBox(element, settings, cornerRadius, page, NoTitle) {
        _super.call(this, element, settings, page.Title);
        this.NoTitle = NoTitle;
        //this.NoTitle = settings.NoTitle;
        this.page = page;
    }
    TVCheckBox.prototype.clear = function (gc, color) {
        var gr = new WYGraphics(gc, null, false, null);
        gr.setColor(color);
        gr.fillRect(this.getRect().left, this.getRect().top, this.getRect().width, this.getRect().height);
    };
    TVCheckBox.prototype.setUpDownText = function (text) {
        _super.prototype.setText.call(this, text);
        _super.prototype.setDownText.call(this, text);
    };
    TVCheckBox.prototype.getHeadlineText = function () {
        return this.getText();
    };
    TVCheckBox.prototype.setHeadlineText = function (text) {
        this.page.Title = text;
        if (!this.NoTitle) {
            this.setUpDownText(this.page.Title);
        }
    };
    TVCheckBox.prototype.getContentText = function () {
        return this.page.Text;
    };
    TVCheckBox.prototype.setContentText = function (text) {
        this.page.Text = text;
        if (this.NoTitle) {
            this.setUpDownText(this.page.Title);
        }
    };
    Object.defineProperty(TVCheckBox.prototype, "OnCheck", {
        set: function (func) {
            this.oncheck = func;
        },
        enumerable: true,
        configurable: true
    });
    return TVCheckBox;
})(WYCheckBox);
var TVCheckTextBox = (function (_super) {
    __extends(TVCheckTextBox, _super);
    function TVCheckTextBox(element, settings, cornerRadius, page, NoTitle) {
        _super.call(this, element, settings, cornerRadius, page, NoTitle);
    }
    return TVCheckTextBox;
})(TVCheckBox);
var TVButton = (function (_super) {
    __extends(TVButton, _super);
    function TVButton(element, settings, cornerRadius, page) {
        _super.call(this, element.getContext("2d"), settings, cornerRadius);
        this.page = page;
    }
    TVButton.prototype.clear = function (gc, color) {
        var gr = new WYGraphics(gc, null, false, null);
        gr.setColor(color);
        gr.fillRect(this.getRect().left, this.getRect().top, this.getRect().width, this.getRect().height);
    };
    Object.defineProperty(TVButton.prototype, "OnClick", {
        set: function (func) {
            this.onclick = func;
        },
        enumerable: true,
        configurable: true
    });
    TVButton.prototype.menuContains = function (x, y) {
        return this.contains(x, y);
    };
    TVButton.prototype.closeAll = function () {
        // このメニュー以下のすべてのメニューを閉じる
        // ボタンのときは何もしない
    };
    return TVButton;
})(WYRoundButton);
var TVMenu = (function (_super) {
    __extends(TVMenu, _super);
    function TVMenu(element, settings, cornerRadius, page, NoTitle) {
        _super.call(this, element, settings, cornerRadius, page, NoTitle);
        this.xmargin = 2;
        this.ymargin = 2;
        this.widths_shift = 1;
        this.submenus = new Array();
    }
    TVMenu.prototype.getWidths = function (i, j) {
        return this.widths[j + this.widths_shift][i + this.widths_shift];
    };
    TVMenu.prototype.setWidths = function (i, j, width) {
        if (this.widths == null) {
            this.widths = new Array();
        }
        if (this.widths[j + this.widths_shift] == null) {
            this.widths[j + this.widths_shift] = new Array();
        }
        this.widths[j + this.widths_shift][i + this.widths_shift] = width;
    };
    TVMenu.prototype.add = function (item, i, j, itemwidth) {
        this.setWidths(i, j, itemwidth);
        var rect = this.getRect();
        var x = rect.left;
        if (i >= 0) {
            for (var ii = 0; ii < i; ii++) {
                x += this.getWidths(ii, j) + this.xmargin;
            }
        }
        else {
            for (var ii = -1; ii >= i; ii--) {
                x -= this.getWidths(ii, j) + this.xmargin;
            }
        }
        var y = rect.top + (rect.height + this.ymargin) * j;
        item.setRect(x, y, itemwidth, rect.height);
        this.submenus.push(item);
    };
    TVMenu.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                this.submenus[i].draw();
            }
        }
    };
    TVMenu.prototype.clear = function (gc, color) {
        _super.prototype.clear.call(this, gc, color);
        for (var i = 0; i < this.submenus.length; i++) {
            this.submenus[i].clear(gc, color);
        }
    };
    TVMenu.prototype.closeAll = function () {
        // このメニュー以下のすべてのメニューを閉じる
        this.setDownWithoutDraw(false);
        for (var i = 0; i < this.submenus.length; i++) {
            this.submenus[i].closeAll();
        }
    };
    TVMenu.prototype.mousePressed = function (x, y) {
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                if (this.submenus[i].menuContains(x, y)) {
                    this.submenus[i].mousePressed(x, y);
                    return;
                }
            }
        }
        _super.prototype.mousePressed.call(this, x, y);
    };
    TVMenu.prototype.mouseReleased = function (x, y) {
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                if (this.submenus[i].menuContains(x, y)) {
                    this.submenus[i].mouseReleased(x, y);
                    return;
                }
            }
        }
        _super.prototype.mouseReleased.call(this, x, y);
    };
    TVMenu.prototype.touchStart = function (x, y) {
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                if (this.submenus[i].menuContains(x, y)) {
                    this.submenus[i].touchStart(x, y);
                    return;
                }
            }
        }
        _super.prototype.touchStart.call(this, x, y);
    };
    TVMenu.prototype.touchEnd = function (ids) {
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                this.submenus[i].touchEnd(ids);
            }
        }
        _super.prototype.touchEnd.call(this, ids);
    };
    TVMenu.prototype.menuContains = function (x, y) {
        if (this.contains(x, y)) {
            return true;
        }
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                if (this.submenus[i].menuContains(x, y)) {
                    return true;
                }
            }
        }
        return false;
    };
    return TVMenu;
})(TVCheckBox);
//# sourceMappingURL=TVMenu.js.map