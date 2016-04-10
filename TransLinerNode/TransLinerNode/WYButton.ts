class WYButton
{
    protected foreShadowWidth: number;
    protected backShadowWidth: number;
    protected shadowRate: number;
    protected isDown: boolean;
    protected rect: WYRect;
    protected reverse_rect: WYRect;

    public constructor() {
        this.foreShadowWidth = 2;
        this.backShadowWidth = 3;
        this.shadowRate = 0.6;
        this.isDown = false;
    }

    public onclick(): void
	{
		alert("未定義です");
	}

    public draw_ = function (): void
    {
        // this.draw()はサブクラスのメソッドなのでこの関数を通してエラーにならないようにする
        this.draw();
    }

    public setDown(down: boolean): void
	{
		this.isDown = down;
		this.draw_();
	}

    public setRect(left: number, top: number, width: number, height: number): void
	{
		this.rect = new WYRect(left, top, width, height);
		this.reverse_rect = this.rect.getReverse();
	}

    protected getRect(): WYRect {
        return this.rect;
    }

    public contains(x: number, y: number): boolean
	{
		return this.rect.contains(x, y);
	}

    public drawShadow(gc: CanvasRenderingContext2D, rect: WYRect, w: number, w2: number): void
	{
		gc.beginPath();
		gc.moveTo(rect.left      , rect.top);
		gc.lineTo(rect.left      , rect.bottom);
		gc.lineTo(rect.left  + w , rect.bottom - w2);
		gc.lineTo(rect.left  + w , rect.top    + w);
		gc.lineTo(rect.right - w2, rect.top    + w);
		gc.lineTo(rect.right     , rect.top);
		gc.closePath();
		gc.stroke();
		gc.fill();
	}

    public mousedown(x: number, y: number): void
	{
		if ( this.contains(x, y) ) {
			this.setDown(true);
			if ( this.onclick != null ) {
				this.onclick();
			}
		}
	}

    public mouseup(x: number, y: number): void
	{
		if ( this.isDown ) {
			this.setDown(false);
		}
	}

    public mouseup2(x: number, y: number): void
	{
		if ( this.contains(x, y) ) {
			this.setDown(false);
		}
	}

    public touchstart(x: number, y: number): void
	{
		if ( this.contains(x, y) ) {
			this.setDown(true);
			if ( this.onclick != null ) {
				this.onclick();
			}
		}
	}

    public touchend(): void
	{
		if ( this.isDown ) {
			this.setDown(false);
		}
	}

    public mousePressed(x: number, y: number): void
	{
		this.mousedown(x, y);
	}

    public mouseReleased(x: number, y: number): void
	{
		this.mouseup(x, y);
	}

    public mouseMoved(x: number, y: number): void
	{
	}

    public touchStart(x: number, y: number): void
	{
		this.touchstart(x, y);
	}

    public touchEnd(ids): void
	{
		this.touchend();
	}

    public touchMove(x: number, y: number): void
	{
	}
}

class WYImageButton extends WYButton
{
    private gc: CanvasRenderingContext2D;
    private upImage: HTMLImageElement;
    private downImage: HTMLImageElement;

    public constructor(gc: CanvasRenderingContext2D) {
        super();
        this.gc = gc;
    }

    public setUpImage(location: string): void
	{
		this.upImage = new Image(); // これがないと全部同じになる(prototypeと同じになる？)
		this.upImage.src = location;
	}

    public setDownImage(location: string): void
	{
		this.downImage = new Image(); // これがないと全部同じになる(prototypeと同じになる？)
		this.downImage.src = location;
	}

    public draw(): void
	{
		if ( this.isDown ) {
			this.gc.drawImage(this.downImage, this.rect.left, this.rect.top, this.rect.width, this.rect.height);
		} else {
			this.gc.drawImage(this.upImage, this.rect.left, this.rect.top, this.rect.width, this.rect.height);
		}
	}
}

class WYTextButton extends WYButton
{
    protected gc: CanvasRenderingContext2D;
    protected settings: ViewSettings;
    private text: string;

    public constructor(gc: CanvasRenderingContext2D, settings: ViewSettings) {
        super();
        this.gc = gc;
        this.settings = settings;
        this.text = "";
    }

    public setText(text: string): void
	{
		this.text = text;
	}

    public drawText(): void
	{
		var g = new WYGraphics(this.gc, this.settings.MainFont, false, null);
		if ( this.isDown ) {
			g.drawButtonText(this.rect, this.backShadowWidth, this.foreShadowWidth, this.settings.ButtonTextColor, this.text);
		} else {
			g.drawButtonText(this.rect, this.foreShadowWidth, this.backShadowWidth, this.settings.ButtonTextColor, this.text);
		}
	}
}

class WYFlatButton extends WYTextButton
{
    private upColor: WYColor;
    private downColor: WYColor;

    public constructor(gc: CanvasRenderingContext2D, settings: ViewSettings) {
        super(gc, settings);
    }

    public setUpColor(red: number, green: number, blue: number): void
	{
		this.upColor = new WYColor(red, green, blue);
	}

    public setDownColor(red: number, green: number, blue: number): void
	{
		this.downColor = new WYColor(red, green, blue);
	}

    public drawButton(gc: CanvasRenderingContext2D, rect: WYRect, reverse_rect: WYRect, w1: number, w2: number, color: WYColor, isDown: boolean): void
	{
		gc.fillStyle = color.getRGB(this.shadowRate, isDown);
		this.drawShadow(gc, rect, w1, w2);
		gc.fillStyle = color.getRGB(this.shadowRate, !isDown);
		this.drawShadow(gc, reverse_rect, -w2, -w1);
		gc.fillStyle = color.getRGB(1, true);
		gc.fillRect(rect.left + w1, rect.top + w1, rect.width - w1 - w2, rect.height - w1 - w2);
	}

    public draw(): void
	{
		if ( this.isDown ) {
			this.drawButton(this.gc, this.rect, this.reverse_rect, this.backShadowWidth, this.foreShadowWidth, this.settings.ButtonBackColor, this.isDown);
		} else {
			this.drawButton(this.gc, this.rect, this.reverse_rect, this.foreShadowWidth, this.backShadowWidth, this.settings.ButtonBackColor, this.isDown);
		}
		this.drawText();
	}
}

class WYRoundButton extends WYTextButton
{
    private cornerRadius: number;
    private gradientRate: number;

    public constructor(gc: CanvasRenderingContext2D, settings: ViewSettings, cornerRadius: number) {
        super(gc, settings);
        this.cornerRadius = cornerRadius; // 角の半径
        this.gradientRate = 0.4;
    }

    public drawButton(gc: CanvasRenderingContext2D, rect: WYRect, w1: number, w2: number, color: WYColor, isDown: boolean): void
	{
		var g = new WYGraphics(gc, this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);
		g.drawRoundBox(rect, w1, w2, color, isDown, this.shadowRate, this.gradientRate, this.cornerRadius);
	}

    public drawButton2(gc: CanvasRenderingContext2D, rect: WYRect, w1: number, w2: number, color: WYColor, isDown: boolean): void
	{
		var cd = this.cornerRadius * 2;
		var g = new WYGraphics(gc, this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);

		g.fillShadowRoundRect(rect.left, rect.top, rect.width, rect.height, cd, cd, w1 + 1, w2 + 1, color.getShadowColor(this.shadowRate, isDown), color.getShadowColor(this.shadowRate, !isDown));

		var grad_color = color.getGradient2(gc, rect.left, rect.top, rect.width, rect.height, color.getShadowColor(0.4, false));
		g.setColor(grad_color);
		var cd2 = Math.max(cd - w1 - w2, 0);
		g.fillRoundRect(rect.left + w1, rect.top + w1, rect.width - w1 - w2, rect.height - w1 - w2, cd2, cd2);
	}

    public draw(): void
	{
		if ( this.isDown ) {
			this.drawButton(this.gc, this.rect, this.backShadowWidth, this.foreShadowWidth, this.settings.ButtonBackColor, this.isDown);
		} else {
			this.drawButton(this.gc, this.rect, this.foreShadowWidth, this.backShadowWidth, this.settings.ButtonBackColor, this.isDown);
		}
		this.drawText();
	}
}

class WYGradientButton extends WYTextButton
{
    private upColor: WYColor;
    private upColor2: WYColor;
    private downColor: WYColor;
    private downColor2: WYColor;

    public constructor(gc: CanvasRenderingContext2D, settings: ViewSettings) {
        super(gc, settings);
    }

    public setUpColor(red: number, green: number, blue: number): void
	{
		this.upColor = new WYColor(red, green, blue);
	}

    public setUpColor2(red: number, green: number, blue: number): void
	{
		this.upColor2 = new WYColor(red, green, blue);
	}

    public setDownColor(red: number, green: number, blue: number): void
	{
		this.downColor = new WYColor(red, green, blue);
	}

    public setDownColor2(red: number, green: number, blue: number): void
	{
		this.downColor2 = new WYColor(red, green, blue);
	}

    public drawGradientButton(gc: CanvasRenderingContext2D, rect: WYRect, reverse_rect: WYRect, w1: number, w2: number, color1: WYColor, color2: WYColor, isDown: boolean): void
	{
		gc.fillStyle = color1.getRGB(this.shadowRate, isDown);
		this.drawShadow(gc, rect, w1, w2);
		gc.fillStyle = color1.getRGB(this.shadowRate, !isDown);
		this.drawShadow(gc, reverse_rect, -w2, -w1);
		gc.fillStyle = color1.getVGradient(gc, rect.height, color2);
		gc.fillRect(rect.left + w1, rect.top + w1, rect.width - w1 - w2, rect.height - w1 - w2);
	}

    public draw(): void
	{
		if ( this.isDown ) {
			this.drawGradientButton(this.gc, this.rect, this.reverse_rect, this.backShadowWidth, this.foreShadowWidth, this.downColor, this.downColor2, this.isDown);
		} else {
			this.drawGradientButton(this.gc, this.rect, this.reverse_rect, this.foreShadowWidth, this.backShadowWidth, this.upColor, this.upColor2, this.isDown);
		}
	}
}

class WYSliderButton extends WYRoundButton
{
    public constructor(gc: CanvasRenderingContext2D, settings: ViewSettings) {
        var cornerRadius: number = 12; // 角の半径
        super(gc, settings, cornerRadius);
    }

    public numberTextBox: WYNumericSliderTextBox;
}
