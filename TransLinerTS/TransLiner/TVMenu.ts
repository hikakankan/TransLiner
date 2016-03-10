class TVCheckBox extends WYCheckBox {
    private page: TLPage;
    //private NoTitle: boolean;
    public constructor(element: HTMLCanvasElement, settings: ViewSettings, cornerRadius: number, page: TLPage, private NoTitle: boolean) {
        super(element, settings, page.Title);
        //this.NoTitle = settings.NoTitle;
        this.page = page;
    }
    public clear(gc: CanvasRenderingContext2D, color: WYColor) {
        var gr: WYGraphics = new WYGraphics(gc, null, false, null);
        gr.setColor(color);
        gr.fillRect(this.getRect().left, this.getRect().top, this.getRect().width, this.getRect().height);
    }
    public setUpDownText(text: string): void {
        super.setText(text);
        super.setDownText(text);
    }
    public getHeadlineText(): string {
        return this.getText();
    }
    public setHeadlineText(text: string): void {
        this.page.Title = text;
        if (!this.NoTitle) {
            this.setUpDownText(this.page.Title);
        }
    }
    public getContentText(): string {
        return this.page.Text;
    }
    public setContentText(text: string): void {
        this.page.Text = text;
        if (this.NoTitle) {
            this.setUpDownText(this.page.Title);
        }
    }
    public set OnCheck(func: () => void) {
        this.oncheck = func;
    }
}

class TVCheckTextBox extends TVCheckBox {
    public constructor(element: HTMLCanvasElement, settings: ViewSettings, cornerRadius: number, page: TLPage, NoTitle: boolean) {
        super(element, settings, cornerRadius, page, NoTitle);
    }
}

class TVButton extends WYRoundButton {
    private page: TLPage;
    public constructor(element: HTMLCanvasElement, settings: ViewSettings, cornerRadius: number, page: TLPage) {
        super(element.getContext("2d"), settings, cornerRadius);
        this.page = page;
    }
    public clear(gc: CanvasRenderingContext2D, color: WYColor) {
        var gr: WYGraphics = new WYGraphics(gc, null, false, null);
        gr.setColor(color);
        gr.fillRect(this.getRect().left, this.getRect().top, this.getRect().width, this.getRect().height);
    }
    public set OnClick(func: () => void) {
        this.onclick = func;
    }
    public menuContains(x: number, y: number): boolean {
        return this.contains(x, y);
    }
    public closeAll() {
        // このメニュー以下のすべてのメニューを閉じる
        // ボタンのときは何もしない
    }
}

class TVMenu extends TVCheckBox {
    private submenus: Array<TVMenu | TVButton>;
    private xmargin = 2;
    private ymargin = 2;
    private widths: number[][];
    private widths_shift = 1;
    public constructor(element: HTMLCanvasElement, settings: ViewSettings, cornerRadius: number, page: TLPage, NoTitle: boolean) {
        super(element, settings, cornerRadius, page, NoTitle);
        this.submenus = new Array<TVMenu | TVButton>();
    }
    private getWidths(i: number, j: number): number {
        return this.widths[j + this.widths_shift][i + this.widths_shift];
    }
    private setWidths(i: number, j: number, width: number): void {
        if (this.widths == null) {
            this.widths = new Array<Array<number>>();
        }
        if (this.widths[j + this.widths_shift] == null) {
            this.widths[j + this.widths_shift] = new Array<number>();
        }
        this.widths[j + this.widths_shift][i + this.widths_shift] = width;
    }
    public add(item: TVMenu | TVButton, i: number, j: number, itemwidth: number) {
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
    }
    public draw(): void {
        super.draw();
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                this.submenus[i].draw();
            }
        }
    }
    public clear(gc: CanvasRenderingContext2D, color: WYColor) {
        super.clear(gc, color);
        for (var i = 0; i < this.submenus.length; i++) {
            this.submenus[i].clear(gc, color);
        }
    }
    public closeAll() {
        // このメニュー以下のすべてのメニューを閉じる
        this.setDownWithoutDraw(false);
        for (var i = 0; i < this.submenus.length; i++) {
            this.submenus[i].closeAll();
        }
    }
    public mousePressed(x: number, y: number): void {
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                if (this.submenus[i].menuContains(x, y)) {
                    this.submenus[i].mousePressed(x, y);
                    return;
                }
            }
        }
        super.mousePressed(x, y);
    }
    public mouseReleased(x: number, y: number): void {
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                if (this.submenus[i].menuContains(x, y)) {
                    this.submenus[i].mouseReleased(x, y);
                    return;
                }
            }
        }
        super.mouseReleased(x, y);
    }
    public touchStart(x: number, y: number): void {
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                if (this.submenus[i].menuContains(x, y)) {
                    this.submenus[i].touchStart(x, y);
                    return;
                }
            }
        }
        super.touchStart(x, y);
    }
    public touchEnd(ids): void {
        if (this.getValue()) {
            for (var i = 0; i < this.submenus.length; i++) {
                this.submenus[i].touchEnd(ids);
            }
        }
        super.touchEnd(ids);
    }
    public menuContains(x: number, y: number): boolean {
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
    }
}
