var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WYButton = (function () {
    function WYButton() {
        this.draw_ = function () {
            // this.draw()はサブクラスのメソッドなのでこの関数を通してエラーにならないようにする
            this.draw();
        };
        this.foreShadowWidth = 2;
        this.backShadowWidth = 3;
        this.shadowRate = 0.6;
        this.isDown = false;
    }
    WYButton.prototype.onclick = function () {
        alert("未定義です");
    };
    WYButton.prototype.setDown = function (down) {
        this.isDown = down;
        this.draw_();
    };
    WYButton.prototype.setRect = function (left, top, width, height) {
        this.rect = new WYRect(left, top, width, height);
        this.reverse_rect = this.rect.getReverse();
    };
    WYButton.prototype.getRect = function () {
        return this.rect;
    };
    WYButton.prototype.contains = function (x, y) {
        return this.rect.contains(x, y);
    };
    WYButton.prototype.drawShadow = function (gc, rect, w, w2) {
        gc.beginPath();
        gc.moveTo(rect.left, rect.top);
        gc.lineTo(rect.left, rect.bottom);
        gc.lineTo(rect.left + w, rect.bottom - w2);
        gc.lineTo(rect.left + w, rect.top + w);
        gc.lineTo(rect.right - w2, rect.top + w);
        gc.lineTo(rect.right, rect.top);
        gc.closePath();
        gc.stroke();
        gc.fill();
    };
    WYButton.prototype.mousedown = function (x, y) {
        if (this.contains(x, y)) {
            this.setDown(true);
            if (this.onclick != null) {
                this.onclick();
            }
        }
    };
    WYButton.prototype.mouseup = function (x, y) {
        if (this.isDown) {
            this.setDown(false);
        }
    };
    WYButton.prototype.mouseup2 = function (x, y) {
        if (this.contains(x, y)) {
            this.setDown(false);
        }
    };
    WYButton.prototype.touchstart = function (x, y) {
        if (this.contains(x, y)) {
            this.setDown(true);
            if (this.onclick != null) {
                this.onclick();
            }
        }
    };
    WYButton.prototype.touchend = function () {
        if (this.isDown) {
            this.setDown(false);
        }
    };
    WYButton.prototype.mousePressed = function (x, y) {
        this.mousedown(x, y);
    };
    WYButton.prototype.mouseReleased = function (x, y) {
        this.mouseup(x, y);
    };
    WYButton.prototype.mouseMoved = function (x, y) {
    };
    WYButton.prototype.touchStart = function (x, y) {
        this.touchstart(x, y);
    };
    WYButton.prototype.touchEnd = function (ids) {
        this.touchend();
    };
    WYButton.prototype.touchMove = function (x, y) {
    };
    return WYButton;
})();
var WYImageButton = (function (_super) {
    __extends(WYImageButton, _super);
    function WYImageButton(gc) {
        _super.call(this);
        this.gc = gc;
    }
    WYImageButton.prototype.setUpImage = function (location) {
        this.upImage = new Image(); // これがないと全部同じになる(prototypeと同じになる？)
        this.upImage.src = location;
    };
    WYImageButton.prototype.setDownImage = function (location) {
        this.downImage = new Image(); // これがないと全部同じになる(prototypeと同じになる？)
        this.downImage.src = location;
    };
    WYImageButton.prototype.draw = function () {
        if (this.isDown) {
            this.gc.drawImage(this.downImage, this.rect.left, this.rect.top, this.rect.width, this.rect.height);
        }
        else {
            this.gc.drawImage(this.upImage, this.rect.left, this.rect.top, this.rect.width, this.rect.height);
        }
    };
    return WYImageButton;
})(WYButton);
var WYTextButton = (function (_super) {
    __extends(WYTextButton, _super);
    function WYTextButton(gc, settings) {
        _super.call(this);
        this.gc = gc;
        this.settings = settings;
        this.text = "";
    }
    WYTextButton.prototype.setText = function (text) {
        this.text = text;
    };
    WYTextButton.prototype.drawText = function () {
        var g = new WYGraphics(this.gc, this.settings.MainFont, false, null);
        if (this.isDown) {
            g.drawButtonText(this.rect, this.backShadowWidth, this.foreShadowWidth, this.settings.ButtonTextColor, this.text);
        }
        else {
            g.drawButtonText(this.rect, this.foreShadowWidth, this.backShadowWidth, this.settings.ButtonTextColor, this.text);
        }
    };
    return WYTextButton;
})(WYButton);
var WYFlatButton = (function (_super) {
    __extends(WYFlatButton, _super);
    function WYFlatButton(gc, settings) {
        _super.call(this, gc, settings);
    }
    WYFlatButton.prototype.setUpColor = function (red, green, blue) {
        this.upColor = new WYColor(red, green, blue);
    };
    WYFlatButton.prototype.setDownColor = function (red, green, blue) {
        this.downColor = new WYColor(red, green, blue);
    };
    WYFlatButton.prototype.drawButton = function (gc, rect, reverse_rect, w1, w2, color, isDown) {
        gc.fillStyle = color.getRGB(this.shadowRate, isDown);
        this.drawShadow(gc, rect, w1, w2);
        gc.fillStyle = color.getRGB(this.shadowRate, !isDown);
        this.drawShadow(gc, reverse_rect, -w2, -w1);
        gc.fillStyle = color.getRGB(1, true);
        gc.fillRect(rect.left + w1, rect.top + w1, rect.width - w1 - w2, rect.height - w1 - w2);
    };
    WYFlatButton.prototype.draw = function () {
        if (this.isDown) {
            this.drawButton(this.gc, this.rect, this.reverse_rect, this.backShadowWidth, this.foreShadowWidth, this.settings.ButtonBackColor, this.isDown);
        }
        else {
            this.drawButton(this.gc, this.rect, this.reverse_rect, this.foreShadowWidth, this.backShadowWidth, this.settings.ButtonBackColor, this.isDown);
        }
        this.drawText();
    };
    return WYFlatButton;
})(WYTextButton);
var WYRoundButton = (function (_super) {
    __extends(WYRoundButton, _super);
    function WYRoundButton(gc, settings, cornerRadius) {
        _super.call(this, gc, settings);
        this.cornerRadius = cornerRadius; // 角の半径
        this.gradientRate = 0.4;
    }
    WYRoundButton.prototype.drawButton = function (gc, rect, w1, w2, color, isDown) {
        var g = new WYGraphics(gc, this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);
        g.drawRoundBox(rect, w1, w2, color, isDown, this.shadowRate, this.gradientRate, this.cornerRadius);
    };
    WYRoundButton.prototype.drawButton2 = function (gc, rect, w1, w2, color, isDown) {
        var cd = this.cornerRadius * 2;
        var g = new WYGraphics(gc, this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);
        g.fillShadowRoundRect(rect.left, rect.top, rect.width, rect.height, cd, cd, w1 + 1, w2 + 1, color.getShadowColor(this.shadowRate, isDown), color.getShadowColor(this.shadowRate, !isDown));
        var grad_color = color.getGradient2(gc, rect.left, rect.top, rect.width, rect.height, color.getShadowColor(0.4, false));
        g.setColor(grad_color);
        var cd2 = Math.max(cd - w1 - w2, 0);
        g.fillRoundRect(rect.left + w1, rect.top + w1, rect.width - w1 - w2, rect.height - w1 - w2, cd2, cd2);
    };
    WYRoundButton.prototype.draw = function () {
        if (this.isDown) {
            this.drawButton(this.gc, this.rect, this.backShadowWidth, this.foreShadowWidth, this.settings.ButtonBackColor, this.isDown);
        }
        else {
            this.drawButton(this.gc, this.rect, this.foreShadowWidth, this.backShadowWidth, this.settings.ButtonBackColor, this.isDown);
        }
        this.drawText();
    };
    return WYRoundButton;
})(WYTextButton);
var WYGradientButton = (function (_super) {
    __extends(WYGradientButton, _super);
    function WYGradientButton(gc, settings) {
        _super.call(this, gc, settings);
    }
    WYGradientButton.prototype.setUpColor = function (red, green, blue) {
        this.upColor = new WYColor(red, green, blue);
    };
    WYGradientButton.prototype.setUpColor2 = function (red, green, blue) {
        this.upColor2 = new WYColor(red, green, blue);
    };
    WYGradientButton.prototype.setDownColor = function (red, green, blue) {
        this.downColor = new WYColor(red, green, blue);
    };
    WYGradientButton.prototype.setDownColor2 = function (red, green, blue) {
        this.downColor2 = new WYColor(red, green, blue);
    };
    WYGradientButton.prototype.drawGradientButton = function (gc, rect, reverse_rect, w1, w2, color1, color2, isDown) {
        gc.fillStyle = color1.getRGB(this.shadowRate, isDown);
        this.drawShadow(gc, rect, w1, w2);
        gc.fillStyle = color1.getRGB(this.shadowRate, !isDown);
        this.drawShadow(gc, reverse_rect, -w2, -w1);
        gc.fillStyle = color1.getVGradient(gc, rect.height, color2);
        gc.fillRect(rect.left + w1, rect.top + w1, rect.width - w1 - w2, rect.height - w1 - w2);
    };
    WYGradientButton.prototype.draw = function () {
        if (this.isDown) {
            this.drawGradientButton(this.gc, this.rect, this.reverse_rect, this.backShadowWidth, this.foreShadowWidth, this.downColor, this.downColor2, this.isDown);
        }
        else {
            this.drawGradientButton(this.gc, this.rect, this.reverse_rect, this.foreShadowWidth, this.backShadowWidth, this.upColor, this.upColor2, this.isDown);
        }
    };
    return WYGradientButton;
})(WYTextButton);
var WYSliderButton = (function (_super) {
    __extends(WYSliderButton, _super);
    function WYSliderButton(gc, settings) {
        var cornerRadius = 12; // 角の半径
        _super.call(this, gc, settings, cornerRadius);
    }
    return WYSliderButton;
})(WYRoundButton);
//# sourceMappingURL=WYButton.js.map