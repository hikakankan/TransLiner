var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TVTextBox = (function (_super) {
    __extends(TVTextBox, _super);
    function TVTextBox(element, settings) {
        _super.call(this, element, settings);
        var textBox = document.createElement("input");
        textBox.width = this.getRect().width.toString();
        textBox.height = this.getRect().height.toString();
    }
    TVTextBox.prototype.clear = function (gc, color) {
        var gr = new WYGraphics(gc, null, false, null);
        gr.setColor(color);
        gr.fillRect(this.getRect().left, this.getRect().top, this.getRect().width, this.getRect().height);
    };
    TVTextBox.prototype.mousePressed = function (x, y) {
    };
    TVTextBox.prototype.mouseReleased = function (x, y) {
    };
    TVTextBox.prototype.touchStart = function (x, y) {
    };
    TVTextBox.prototype.touchEnd = function (ids) {
    };
    return TVTextBox;
})(WYCanvasTextBox);
var TVDropTextBox = (function (_super) {
    __extends(TVDropTextBox, _super);
    function TVDropTextBox(element, settings, cornerRadius, page) {
        _super.call(this, element, settings, cornerRadius, page);
        //this.headlineTextBox = new TVTextBox(element, settings);
        //this.contentTextBox = new TVTextBox(element, settings);
    }
    TVDropTextBox.prototype.draw = function () {
        _super.prototype.draw.call(this);
        if (this.getValue()) {
        }
    };
    TVDropTextBox.prototype.clear = function (gc, color) {
        _super.prototype.clear.call(this, gc, color);
        //this.contentTextBox.clear(gc, color);
    };
    TVDropTextBox.prototype.closeAll = function () {
        // このメニュー以下のすべてのメニューを閉じる
        this.setDownWithoutDraw(false);
    };
    TVDropTextBox.prototype.setText = function (text) {
    };
    return TVDropTextBox;
})(TVCheckBox);
//# sourceMappingURL=TVDropTextBox.js.map