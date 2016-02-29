var WYCheckBox = (function () {
    function WYCheckBox(canvas, settings, text) {
        this.canvas = canvas;
        this.settings = settings;
        this.foreShadowWidth = 2;
        this.backShadowWidth = 3;
        this.shadowRate = 0.6;
        this.isDown = false;
        this.cornerRadius = 12; // 角の半径
        this.gradientRate = 0.4;
        this.text = text;
        this.downText = text;
        this.value = false;
        this.rect = new WYRect(0, 0, this.canvas.width, this.canvas.height);
    }
    WYCheckBox.prototype.getText = function () {
        return this.text;
    };
    WYCheckBox.prototype.setText = function (text) {
        this.text = text;
    };
    WYCheckBox.prototype.setDownText = function (text) {
        this.downText = text;
    };
    WYCheckBox.prototype.getValue = function () {
        return this.value;
    };
    WYCheckBox.prototype.setValue = function (value) {
        this.value = value;
        this.isDown = value;
        this.draw();
    };
    WYCheckBox.prototype.setDown = function (value) {
        this.setValue(value);
    };
    WYCheckBox.prototype.setDownWithoutDraw = function (value) {
        this.value = value;
        this.isDown = value;
    };
    WYCheckBox.prototype.setRect = function (left, top, width, height) {
        this.rect = new WYRect(left, top, width, height);
    };
    WYCheckBox.prototype.getRect = function () {
        return this.rect;
    };
    WYCheckBox.prototype.contains = function (x, y) {
        return this.rect.contains(x, y);
    };
    WYCheckBox.prototype.draw = function () {
        var w1 = this.backShadowWidth;
        var w2 = this.foreShadowWidth;
        var gc = this.canvas.getContext("2d");
        var g = new WYGraphics(gc, this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);
        if (this.isDown) {
            g.drawRoundBox(this.rect, w1, w2, this.settings.ButtonBackColor, this.isDown, this.shadowRate, this.gradientRate, this.cornerRadius);
            g.drawButtonText(this.rect, w1, w2, this.settings.ButtonTextColor, this.downText);
        }
        else {
            g.drawRoundBox(this.rect, w2, w1, this.settings.ButtonBackColor, this.isDown, this.shadowRate, this.gradientRate, this.cornerRadius);
            g.drawButtonText(this.rect, w2, w1, this.settings.ButtonTextColor, this.text);
        }
    };
    WYCheckBox.prototype.onclick = function () {
        this.setValue(!this.value);
        if (this.oncheck != null) {
            this.oncheck();
        }
    };
    WYCheckBox.prototype.mousePressed = function (x, y) {
        if (this.contains(x, y)) {
            //this.setDown(true);
            if (this.onclick != null) {
                this.onclick();
            }
        }
    };
    WYCheckBox.prototype.mouseReleased = function (x, y) {
        if (this.isDown) {
        }
    };
    WYCheckBox.prototype.mouseMoved = function (x, y) {
    };
    WYCheckBox.prototype.touchStart = function (x, y) {
        if (this.contains(x, y)) {
            this.setDown(true);
            if (this.onclick != null) {
                this.onclick();
            }
        }
    };
    WYCheckBox.prototype.touchEnd = function (ids) {
        if (this.isDown) {
            this.setDown(false);
        }
    };
    WYCheckBox.prototype.touchMove = function (x, y) {
    };
    return WYCheckBox;
})();
//# sourceMappingURL=WYCheckBox.js.map