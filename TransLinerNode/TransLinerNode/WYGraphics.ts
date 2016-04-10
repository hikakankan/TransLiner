class GCFont
{
    public Name: string;
    public Height: number;

    public constructor(name: string, height: number) {
        this.Name = name;
        this.Height = height;
    }
}

class GCDefaultFont extends GCFont
{
    public constructor() {
        super("16px 'Times New Roman'", 16);
    }
}

class WYGraphics
{
    private graph: CanvasRenderingContext2D;
    private font: GCFont;
    private use_image: boolean;
    private image_settings: ImageSettings;
    private col: WYColor;

    public constructor(graph: CanvasRenderingContext2D, font: GCFont, use_image: boolean, image_settings: ImageSettings) {
        this.graph = graph;
        this.font = font;
        this.use_image = use_image;
        this.image_settings = image_settings;
        this.col = null;
    }

    public setColor(c: WYColor): void {
        this.col = c;
    }

    public drawLine(x1: number, y1: number, x2: number, y2: number): void {
        this.graph.strokeStyle = this.col.getColor();
        this.graph.beginPath();
        this.graph.moveTo(x1, y1);
        this.graph.lineTo(x2, y2);
        this.graph.stroke();
    }

    public fillPolygon(xs: number[], ys: number[]): void {
        this.graph.fillStyle = this.col.getColor();
        this.graph.beginPath();
        this.graph.moveTo(xs[0], ys[0]);
        for (var i = 1; i < xs.length; i++) {
            this.graph.lineTo(xs[i], ys[i]);
        }
        this.graph.closePath();
        this.graph.fill();
    }

    public drawOval(x: number, y: number, diameter_x: number, diameter_y: number): void {
        // 楕円を描くことができないので円を描く
        var radius = (diameter_x + diameter_y) / 4;
        if (radius <= 0) {
            return;
        }
        var xx = x + diameter_x / 2;
        var yy = y + diameter_y / 2;
        this.graph.strokeStyle = this.col.getColor();
        this.graph.beginPath();
        this.graph.arc(xx, yy, radius, 0, Math.PI * 2, false);
        this.graph.stroke();
    }

    public drawArc(x: number, y: number, diameter_x: number, diameter_y: number, startAngle: number, arcsize: number): void {
        var endAngle = startAngle + arcsize;
        var radius = (diameter_x + diameter_y) / 4;
        if (radius <= 0) {
            return;
        }
        var xx = x + diameter_x / 2;
        var yy = y + diameter_y / 2;
        this.graph.strokeStyle = this.col.getColor();
        this.graph.beginPath();
        this.graph.arc(xx, yy, radius, startAngle * Math.PI / 180, endAngle * Math.PI / 180, false);
        this.graph.stroke();
    }

    public fillArc(x: number, y: number, diameter_x: number, diameter_y: number, startAngle: number, arcsize: number, thick: number): void {
        var endAngle = startAngle + arcsize;
        var radius = (diameter_x + diameter_y) / 4;
        var xx = x + diameter_x / 2;
        var yy = y + diameter_y / 2;
        this.graph.fillStyle = this.col.getColor();
        this.graph.beginPath();
        this.graph.arc(xx, yy, radius, startAngle * Math.PI / 180, endAngle * Math.PI / 180, false);
        if (radius > thick) {
            this.graph.arc(xx, yy, radius - thick, endAngle * Math.PI / 180, startAngle * Math.PI / 180, true);
        } else {
            this.graph.lineTo(xx, yy);
        }
        this.graph.fill();
    }

    public fillPie(x: number, y: number, diameter_x: number, diameter_y: number, startAngle: number, arcsize: number): void {
        var endAngle = startAngle + arcsize;
        var radius = (diameter_x + diameter_y) / 4;
        if (radius <= 0) {
            return;
        }
        var xx = x + diameter_x / 2;
        var yy = y + diameter_y / 2;
        this.graph.fillStyle = this.col.getColor();
        this.graph.beginPath();
        this.graph.arc(xx, yy, radius, startAngle * Math.PI / 180, endAngle * Math.PI / 180, false);
        this.graph.lineTo(xx, yy);
        this.graph.closePath();
        this.graph.fill();
    }

    public fillRect(x: number, y: number, width: number, height: number): void {
        this.graph.fillStyle = this.col.getColor();
        this.graph.fillRect(x, y, width, height);
    }

    public drawRoundRect(x: number, y: number, width: number, height: number, d1: number, d2: number): void {
        var r1 = d1 / 2;
        var r2 = d2 / 2;
        this.drawLine(x + r1, y, x + width - r1, y); // 上
        this.drawLine(x + r1, y + height, x + width - r1, y + height); // 下
        this.drawLine(x, y + r2, x, y + height - r2); // 左
        this.drawLine(x + width, y + r2, x + width, y + height - r2); // 右
        this.drawArc(x, y, d1, d2, 180, 90); // 左上
        this.drawArc(x + width - d1, y, d1, d2, 270, 90); // 右上
        this.drawArc(x, y + height - d2, d1, d2, 90, 90); // 左下
        this.drawArc(x + width - d1, y + height - d2, d1, d2, 0, 90);  // 右下
    }

    public arc(x: number, y: number, diameter_x: number, diameter_y: number, startAngle: number, arcsize: number): void {
        var endAngle = startAngle + arcsize;
        var radius = (diameter_x + diameter_y) / 4;
        if (radius <= 0) {
            return;
        }
        var xx = x + diameter_x / 2;
        var yy = y + diameter_y / 2;
        this.graph.arc(xx, yy, radius, startAngle * Math.PI / 180, endAngle * Math.PI / 180, false);
    }

    public fillRoundRect(x: number, y: number, width: number, height: number, d1: number, d2: number): void {
        var r1 = d1 / 2;
        var r2 = d2 / 2;
        this.graph.fillStyle = this.col.getColor();
        this.graph.beginPath();
        this.arc(x, y, d1, d2, 180, 90); // 左上
        this.arc(x + width - d1, y, d1, d2, 270, 90); // 右上
        this.arc(x + width - d1, y + height - d2, d1, d2, 0, 90); // 右下
        this.arc(x, y + height - d2, d1, d2, 90, 90); // 左下
        this.graph.closePath();
        this.graph.fill();
    }

    public fillArc2(x: number, y: number, diameter_x: number, diameter_y: number, startAngle: number, arcsize: number, thick: number, dx: number, dy: number, width: number, height: number, top: number): void {
        var endAngle = startAngle + arcsize;
        var radius = (diameter_x + diameter_y) / 4;
        var cx = x + diameter_x / 2;
        var cy = y + diameter_y / 2;
        this.graph.fillStyle = this.col.getColor();
        this.graph.beginPath();
        this.graph.arc(cx, cy, radius, startAngle * Math.PI / 180, endAngle * Math.PI / 180, false);
        var t = thick * top;
        var w = width * top;
        var h = height * top;
        var vx = x + dx;
        var vy = y + dy;
        this.graph.lineTo(vx + w, vy);
        this.graph.lineTo(vx + w, vy + t);
        if (radius > thick) {
            this.graph.arc(cx, cy, radius - thick, endAngle * Math.PI / 180, startAngle * Math.PI / 180, true);
        } else {
            this.graph.lineTo(cx, cy);
        }
        this.graph.lineTo(vx + t, vy + h);
        this.graph.lineTo(vx, vy + h);
        this.graph.closePath();
        this.graph.fill();
    }

    public fillShadowRoundRect(x: number, y: number, width: number, height: number, d1: number, d2: number, top_thick: number, bottom_thick: number, top_color: WYColor, bottom_color: WYColor): void {
        var r1 = d1 / 2;
        var r2 = d2 / 2;
        this.col = top_color;
        this.fillArc2(x, y, d1, d2, 180, 90, top_thick, 0, 0, width - r1, height - r2, 1); // 左上

        this.col = bottom_color;
        this.fillArc2(x + width - d1, y + height - d2, d1, d2, 0, 90, bottom_thick, d1, d2, width - r1, height - r2, -1); // 右下

        this.col = top_color.getGradient(this.graph, x + width - r1, y, r1, r2, bottom_color);
        this.fillArc(x + width - d1, y, d1, d2, 270, 90, top_thick); // 右上

        this.col = top_color.getGradient(this.graph, x, y + height - r1, r1, r2, bottom_color);
        this.fillArc(x, y + height - d2, d1, d2, 90, 90, bottom_thick); // 左下
    }

    public drawString(str: string, x: number, y: number): void {
        if (this.use_image) {
            this.image_settings.DrawString(str, x, y, this.graph);
        }
        else {
            this.graph.fillStyle = this.col.getColor();
            if (this.font && this.font.Name) {
                this.graph.font = this.font.Name;
            }
            this.graph.textBaseline = "top";
            this.graph.fillText(str, x, y);
        }
    }

    public drawRoundBox(rect: WYRect, w1: number, w2: number, color: WYColor, isDown: boolean, shadowRate: number, gradientRate: number, cornerRadius: number): void {
        var cd = cornerRadius * 2;

        this.fillShadowRoundRect(rect.left, rect.top, rect.width, rect.height, cd, cd, w1 + 1, w2 + 1, color.getShadowColor(shadowRate, isDown), color.getShadowColor(shadowRate, !isDown));

        var grad_color = color.getGradient2(this.graph, rect.left, rect.top, rect.width, rect.height, color.getShadowColor(gradientRate, false));
        this.setColor(grad_color);
        var cd2 = Math.max(cd - w1 - w2, 0);
        this.fillRoundRect(rect.left + w1, rect.top + w1, rect.width - w1 - w2, rect.height - w1 - w2, cd2, cd2);
    }

	// ボタンのテキストを書く
    public drawButtonText(rect: WYRect, w1: number, w2: number, color: WYColor, text: string): void {
        this.graph.fillStyle = color.getColor();
        if (this.font && this.font.Name) {
            this.graph.font = this.font.Name;
        }
        var w = this.graph.measureText(text).width;
        var h = 16; // 既定値を設定
        if (this.font && this.font.Height) {
            h = this.font.Height * 1.2; // topの位置をここで調整する
        }
        this.graph.textBaseline = "top";
        this.graph.fillText(text, rect.left + (rect.width - w - w1 - w2) / 2 + w1, rect.top + (rect.height - h - w1 - w2) / 2 + w1);
    }

    public getFontMetrics(): WYFont {
        return new WYFont(this.font, this.graph, this.use_image, this.image_settings);
    }
}

class WYFont
{
    private font: GCFont;
    private graph: CanvasRenderingContext2D;
    private use_image: boolean;
    private image_settings: ImageSettings;

    public constructor(font: GCFont, graph: CanvasRenderingContext2D, use_image: boolean, image_settings: ImageSettings) {
        this.font = font;
        this.graph = graph;
        this.use_image = use_image;
        this.image_settings = image_settings;
    }

    public getHeight(): number
	{
		if ( this.use_image )
		{
			return this.image_settings.GetHeight();
		}
		else
		{
			return this.font.Height;
		}
	}

    public stringWidth(str: string): number
	{
		if ( this.use_image )
		{
			return this.image_settings.GetWidth(str);
		}
		else
		{
			//if ( this.font.Name != null ) {
			if ( this.font && this.font.Name ) {
				this.graph.font = this.font.Name;
			}
			return this.graph.measureText(str).width;
		}
	}

    public getAscent(): number
	{
		if ( this.use_image )
		{
			return 0;
		}
		else
		{
			return -this.font.Height / 8; // HTML用にここで調節する(数字が少し下になるため？)
		}
	}
}

class WYColor
{
    private red: number;
    private green: number;
    private blue: number;
    private gradient: CanvasGradient;

    public constructor(red: number, green: number, blue: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.gradient = null;
    }

    public getRGBColor(): string
	{
		return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
	}

    public getColor(): string | CanvasGradient
	{
		if ( this.gradient != null ) {
			return this.gradient;
		} else {
			return this.getRGBColor();
		}
	}

    public getRGB(brightness: number, positive: boolean): string
	{
		var c = this.getShadowColor(brightness, positive);
		return c.getRGBColor();
	}

    public getShadowColor(brightness: number, positive: boolean): WYColor
	{
        var r: number;
        var g: number;
        var b: number;
		if ( positive ) {
			r = Math.min(Math.floor(this.red   * brightness), 255);
			g = Math.min(Math.floor(this.green * brightness), 255);
			b = Math.min(Math.floor(this.blue  * brightness), 255);
		} else {
			r = 255 - Math.min(Math.floor((255 - this.red)   * brightness), 255);
			g = 255 - Math.min(Math.floor((255 - this.green) * brightness), 255);
			b = 255 - Math.min(Math.floor((255 - this.blue)  * brightness), 255);
		}
		return new WYColor(r, g, b);
	}

    public getVGradient(gc: CanvasRenderingContext2D, height: number, color2: WYColor): CanvasGradient
	{
		var grad  = gc.createLinearGradient(0, 0, 0, height);
		grad.addColorStop(0, this.getRGB(1, true));
		grad.addColorStop(1, color2.getRGB(1, true));
		return grad;
	}

    public getGradient(gc: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color2: WYColor): WYColor
	{
		var grad  = gc.createLinearGradient(x, y, x + width, y + height);
		grad.addColorStop(0, this.getRGBColor());
		grad.addColorStop(1, color2.getRGBColor());
		var c = new WYColor(0, 0, 0);
		c.gradient = grad;
		return c;
	}

    public getGradient2(gc: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color2: WYColor): WYColor
	{
		var grad  = gc.createLinearGradient(x, y, x + width, y + height);
		grad.addColorStop(0, this.getRGBColor());
		grad.addColorStop(0.5, color2.getRGBColor());
		grad.addColorStop(1, this.getRGBColor());
		var c = new WYColor(0, 0, 0);
		c.gradient = grad;
		return c;
	}
}

class WYPoint
{
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public move(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}
}

class WYDimension
{
    public width: number;
    public height: number;

    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

class WYRectangle
{
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    public constructor(p: WYPoint, d: WYDimension) {
        this.x = p.x;
        this.y = p.y;
        this.width = d.width;
        this.height = d.height;
    }
}

class WYRect
{
    public left: number;
    public top: number;
    public width: number;
    public height: number;
    public right: number;
    public bottom: number;

    public constructor(left: number, top: number, width: number, height: number) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.right = left + width;
        this.bottom = top + height;
    }

	public getReverse(): WYRect
	{
		return new WYRect(this.left + this.width, this.top + this.height, -this.width, -this.height);
	}

	public contains(x, y): boolean
	{
		return x >= this.left && x < this.left + this.width && y >= this.top && y < this.top + this.height;
	}
}
