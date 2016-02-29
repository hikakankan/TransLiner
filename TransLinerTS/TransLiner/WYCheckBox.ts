class WYCheckBox
{
    private canvas: HTMLCanvasElement;
    private settings: ViewSettings;
    private foreShadowWidth: number;
    private backShadowWidth: number;
    private shadowRate: number;
    private isDown: boolean;
    private cornerRadius: number;
    private gradientRate: number;
    private text: string;
    private downText: string;
    private value: boolean;
    private rect: WYRect;
    public oncheck: () => void;

    public constructor(canvas: HTMLCanvasElement, settings: ViewSettings, text: string) {
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

    public getText(): string
	{
		return this.text;
	}

    public setText(text: string): void {
        this.text = text;
    }

    public setDownText(text: string): void
    {
        this.downText = text;
    }

    public getValue(): boolean
	{
		return this.value;
	}

    public setValue(value: boolean): void
	{
		this.value = value;
		this.isDown = value;
		this.draw();
	}

    public setDown(value: boolean): void
	{
		this.setValue(value);
	}

    public setDownWithoutDraw(value: boolean): void {
        this.value = value;
        this.isDown = value;
    }

    public setRect(left: number, top: number, width: number, height: number): void
	{
		this.rect = new WYRect(left, top, width, height);
    }

    public getRect(): WYRect
    {
        return this.rect;
    }

    public contains(x: number, y: number): boolean
	{
		return this.rect.contains(x, y);
	}

    public draw(): void
	{
		var w1 = this.backShadowWidth;
		var w2 = this.foreShadowWidth;
		var gc = this.canvas.getContext("2d");
		var g = new WYGraphics(gc, this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);
		if ( this.isDown ) {
			g.drawRoundBox(this.rect, w1, w2, this.settings.ButtonBackColor, this.isDown, this.shadowRate, this.gradientRate, this.cornerRadius);
			g.drawButtonText(this.rect, w1, w2, this.settings.ButtonTextColor, this.downText);
		} else {
			g.drawRoundBox(this.rect, w2, w1, this.settings.ButtonBackColor, this.isDown, this.shadowRate, this.gradientRate, this.cornerRadius);
			g.drawButtonText(this.rect, w2, w1, this.settings.ButtonTextColor, this.text);
		}
	}

    public onclick(): void
	{
		this.setValue(!this.value);
		if ( this.oncheck != null ) {
			this.oncheck();
		}
	}

    public mousePressed(x: number, y: number): void
	{
		if ( this.contains(x, y) ) {
			//this.setDown(true);
			if ( this.onclick != null ) {
				this.onclick();
			}
		}
	}

    public mouseReleased(x: number, y: number): void
	{
		if ( this.isDown ) {
			//this.setDown(false);
		}
	}

    public mouseMoved(x: number, y: number): void
	{
	}

    public touchStart(x: number, y: number): void
	{
		if ( this.contains(x, y) ) {
			this.setDown(true);
			if ( this.onclick != null ) {
				this.onclick();
			}
		}
	}

    public touchEnd(ids): void
	{
		if ( this.isDown ) {
			this.setDown(false);
		}
	}

    public touchMove(x: number, y: number): void
	{
	}
}
