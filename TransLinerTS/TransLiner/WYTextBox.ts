class WYTextBox
{
    protected rect: WYRect;
    private reverse_rect: WYRect;

    public getRect(): WYRect
    {
        return this.rect;
    }

    public setRect(left: number, top: number, width: number, height: number)
	{
		this.rect = new WYRect(left, top, width, height);
		this.reverse_rect = this.rect.getReverse();
	}

	public contains(x: number, y: number)
	{
		return this.rect.contains(x, y);
	}

    public drawShadow(gc: CanvasRenderingContext2D, rect: WYRect, w: number, w2: number)
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
}

class WYFlatTextBox extends WYTextBox
{
    private gc: CanvasRenderingContext2D;
    private settings: ViewSettings;
    private foreShadowWidth: number;
    private backShadowWidth: number;
    private leftMargin: number;
    private topMargin: number;
    private shadowRate: number;
    private gradientRate: number;
    private isDown: boolean;
    private text: string;
    private cornerRadius: number;

    public constructor(gc: CanvasRenderingContext2D, settings: ViewSettings) {
        super();
        this.gc = gc;
        this.settings = settings;

        this.foreShadowWidth = 2;
        this.backShadowWidth = 2;
        this.leftMargin = 2;
        this.topMargin = 1;
        this.shadowRate = 0.6;
        this.gradientRate = 1;
        this.isDown = true;
        this.text = "";
        this.cornerRadius = 10; // 角の半径
    }

    public getText(): string
	{
		return this.text;
	}

    public setText(text: string): void
	{
		this.text = text;
		this.draw();
	}

    public draw(): void
	{
		var w1 = this.backShadowWidth;
		var w2 = this.foreShadowWidth;
		var g = new WYGraphics(this.gc, this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);
		g.drawRoundBox(this.rect, w1, w2, this.settings.TextBackColor, this.isDown, this.shadowRate, this.gradientRate, this.cornerRadius);

		g.setColor(this.settings.TextTextColor);
		g.drawString(this.text, this.rect.left + w1 + this.cornerRadius + this.leftMargin, this.rect.top + w1 + this.topMargin);
	}
}

class WYCanvasBaseTextBox extends WYTextBox
{
    private canvas: HTMLCanvasElement;
    private settings: ViewSettings;
    private can_size_up: boolean;
    private can_size_down: boolean;
    private foreShadowWidth: number;
    private backShadowWidth: number;
    private leftMargin: number;
    private topMargin: number;
    private shadowRate: number;
    private gradientRate: number;
    private text: string;
    private cornerRadius: number;

    public constructor(canvas: HTMLCanvasElement, settings: ViewSettings) {
        super();
        this.canvas = canvas;
        this.settings = settings;
        this.can_size_up = true;
        this.can_size_down = true;
        this.foreShadowWidth = 2;
        this.backShadowWidth = 2;
        this.leftMargin = 2;
        this.topMargin = 1;
        this.shadowRate = 0.6;
        this.gradientRate = 1;
        this.text = "";
        this.cornerRadius = 10; // 角の半径
    }

    public init_by_canvas = function(): void
	{
		this.org_width = this.canvas.width;
		this.org_height = this.canvas.height;
		this.setRect(0, 0, this.canvas.width, this.canvas.height);
	}

    public getText = function(): string
	{
		return this.text;
	}

    public setText = function(text: string): void
	{
		this.text = text;
		this.draw();
	}

    public change_size = function(g: WYGraphics): void
	{
		var width = g.getFontMetrics().stringWidth(this.text) + this.cornerRadius * 2 + this.leftMargin + this.foreShadowWidth + this.backShadowWidth;
		var new_width = this.canvas.width;
		if ( this.can_size_up && width > this.canvas.width ) {
			new_width = width;
		} else if ( this.can_size_down && width < this.canvas.width ) {
			new_width = Math.max(width, this.org_width);
		}
		if ( new_width != this.canvas.width ) {
			this.canvas.width = new_width;
			this.setRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

    public draw = function(): void
	{
		var g = new WYGraphics(this.canvas.getContext("2d"), this.settings.MainFont, this.settings.UseImage, this.settings.ImageSettings);
		this.change_size(g);
		var w1 = this.backShadowWidth;
		var w2 = this.foreShadowWidth;
		g.drawRoundBox(this.rect, w1, w2, this.settings.TextBackColor, true, this.shadowRate, this.gradientRate, this.cornerRadius);

		g.setColor(this.settings.TextTextColor);
		g.drawString(this.text, this.rect.left + w1 + this.cornerRadius + this.leftMargin, this.rect.top + w1 + this.topMargin);
	}
}

class WYCanvasTextBox extends WYCanvasBaseTextBox
{
    public constructor(canvas: HTMLCanvasElement, settings: ViewSettings) {
        super(canvas, settings);
        this.init_by_canvas();
    }
}

class WYTextElement extends WYTextBox
{
    private element: HTMLElement;

    public constructor(element) {
        super();
        this.element = element;
    }

	public getText = function(): string
	{
		if ( this.element.value != null ) {
			return this.element.value;
		} else {
			return this.element.innerHTML;
		}
	}

	public setText = function(text: string): void
	{
		if ( this.element.value != null ) {
			this.element.value = text;
		} else {
			this.element.innerHTML = text;
		}
	}
}

class WYNumericTextBox extends WYFlatTextBox
{
    private value: number;
    private min_number: number;
    private max_number: number;
    private value_step: number;

    public constructor(gc: CanvasRenderingContext2D, settings: ViewSettings) {
        super(gc, settings);
        this.value = 0;
        this.min_number = 0;
        this.max_number = 100;
        this.value_step = 1;
    }

	public getNumber = function(): number
	{
		return this.value;
	}

	public setNumber = function(value: number): void
	{
		this.value = value;
		this.setText(String(value));
		this.draw();
	}

    public setMinNumber = function (value: number): void
	{
		this.min_number = value;
	}

	public setMaxNumber = function(value:number): void
	{
		this.max_number = value;
	}

	public upNumber = function(): void
	{
		if ( this.value + this.value_step <= this.max_number ) {
			this.setNumber(this.value + this.value_step);
		}
	}

	public downNumber = function(): void
	{
		if ( this.value - this.value_step >= this.min_number ) {
			this.setNumber(this.value - this.value_step);
		}
	}
}

class WYNumericSliderTextBox extends WYNumericTextBox
{
    private mousedown: boolean;
    private mousedown_x: number;
    private mousedown_y: number;
    private mousemove_x: number;
    private mousemove_y: number;
    private mousemove_min_dist: number;

    public constructor(gc: CanvasRenderingContext2D, settings: ViewSettings) {
        super(gc, settings);

        this.mousedown = false;
        this.mousedown_x = 0;
        this.mousedown_y = 0;
        this.mousemove_x = 0;
        this.mousemove_y = 0;

        this.mousemove_min_dist = 1;
    }

    public mousePressed = function (x: number, y: number): void
	{
		if ( this.contains(x, y) ) {
			this.mousedown = true;
			this.mousedown_x = x;
			this.mousedown_y = y;
			this.mousedown_value = this.value;
		}
	}

    public mouseReleased = function (x: number, y: number): void
	{
		this.mousedown = false;
		if ( this.mousemove_y <= this.mousedown_y - this.mousemove_min_dist ) {
			// 上に移動した
			this.upNumber();
		} else if ( this.mousemove_y >= this.mousedown_y + this.mousemove_min_dist ) {
			// 下に移動した
			this.downNumber();
		}
	}

    public mouseMoved = function (x: number, y: number): void
	{
		if ( this.mousedown && this.contains(x, y) ) {
			this.mousemove_x = x;
			this.mousemove_y = y;
		}
	}

    public touchStart = function (x: number, y: number): void
	{
		this.mousePressed(x, y);
	}

    public touchEnd = function (ids): void
	{
		this.mouseReleased(0, 0);
	}

    public touchMove = function (x: number, y: number): void
	{
		this.mouseMoved(x, y);
	}
}

class WYCanvasNumericSliderTextBox extends WYNumericSliderTextBox
{
    private canvas: HTMLCanvasElement;

    public constructor(id, settings) {
        this.canvas = <HTMLCanvasElement>document.getElementById(id);
        var gc: CanvasRenderingContext2D = this.canvas.getContext("2d");
        super(gc, settings);
        this.setRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function createTextBox(id, settings, text): WYCanvasTextBox
{
    var canvas = <HTMLCanvasElement>document.getElementById(id);
	var text_box = new WYCanvasTextBox(canvas, settings);
	text_box.setText(text);
	return text_box;
}
