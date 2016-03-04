class TreeView {
    private canvas: HTMLCanvasElement;
    private rootPage: TLRootPage;
    private openButtonWidth = 24;
    private openButtonWidthMargin = 26;
    private menuButtonWidth = 24;
    private menuButtonWidthMargin = 26;
    private menuButtonWidth2 = 48;
    private headlineWidth = 320;
    private lineHeight = 24;
    private settings: ViewSettings;
    private radius = 12;
    private buttons: Array<TVCheckBox>;
    private menus: Array<TVMenu>;
    private headlineButtons: Array<TVCheckTextBox>;
    private xButtonSize = 24;
    private yButtonSize = 26;

    public constructor(canvas: HTMLCanvasElement, rootPage: TLRootPage, settings: ViewSettings) {
        this.canvas = canvas;
        this.rootPage = rootPage;
        this.settings = settings;
        this.buttons = new Array<TVCheckBox>();
        this.menus = new Array<TVMenu>();
        this.headlineButtons = new Array<TVCheckTextBox>();
        def_mouse_event(canvas, this);
    }

    public redraw(): void {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
        }
        // 開いているメニューを描画
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].getValue()) {
                this.menus[i].draw();
            }
        }
    }

    public clear() {
        var gc: CanvasRenderingContext2D = this.canvas.getContext("2d");
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].clear(gc, this.settings.BodyBackColor);
        }
        for (var i = 0; i < this.menus.length; i++) {
            this.menus[i].clear(gc, this.settings.BodyBackColor);
        }
    }

    public draw(): void {
        this.buttons = new Array<TVCheckBox>();
        this.menus = new Array<TVMenu>();
        this.headlineButtons = new Array<TVCheckTextBox>();
        this.createTree(this.rootPage, 0, 0);
        // キャンバスのサイズが小さすぎるときは大きくする
        if (this.canvas.height < this.createTreeHeight(this.rootPage) + this.yButtonSize * 2) {
            this.canvas.height = this.createTreeHeight(this.rootPage) + this.yButtonSize * 2;
        }
        if (this.canvas.width < this.getTreeWidth() + this.xButtonSize * 2) {
            this.canvas.width = this.getTreeWidth() + this.xButtonSize * 2;
        }
        this.redraw();
    }

    public renewAndDraw(command: (TLRootPage) => void, page: TLPage): void {
        // TreeViewを作り直して再描画
        this.clear(); // いったん全部消去
        this.closeMenuAll(); // メニューを閉じる
        this.rootPage.SelectedPage = page;
        command(this.rootPage);
        this.draw();
    }

    private closeMenuAll() {
        for (var i = 0; i < this.menus.length; i++) {
            this.menus[i].closeAll();
        }
    }

    private closeMenu() {
        this.closeMenuGroup(this.menus);
    }

    private closeMenuGroup(menus: TVMenu[]) {
        for (var i = 0; i < menus.length; i++) {
            menus[i].setValue(false);
        }
    }

    private closeHeadlines() {
        for (var i = 0; i < this.headlineButtons.length; i++) {
            this.headlineButtons[i].setValue(false);
        }
    }

    private openMenuCount() {
        var count = 0;
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].getValue()) {
                count++;
            }
        }
        return count;
    }

    public createTree(page: TLPage, x: number, y: number): void {
        if (page.SubPages.Count == 0) {
            page.IsExpanded = true;
        }
        this.createHeadline(x, y, page);
        var height: number = this.yButtonSize;
        if (page.IsExpanded && page.SubPages.Count > 0) {
            for (var i: number = 0; i < page.SubPages.Count; i++) {
                var subpage: TLPage = page.SubPages.Collection[i];
                this.createTree(subpage, x + this.xButtonSize, y + height);
                height += this.createTreeHeight(subpage);
            }
        }
    }

    public createTreeHeight(page: TLPage): number {
        var height: number = this.yButtonSize;
        if (page.IsExpanded && page.SubPages.Count > 0) {
            for (var i: number = 0; i < page.SubPages.Count; i++) {
                var subpage: TLPage = page.SubPages.Collection[i];
                height += this.createTreeHeight(subpage);
            }
        }
        return height;
    }

    private getTreeWidth(): number {
        var left: number = 0;
        var right: number = 0;
        for (var i = 0; i < this.buttons.length; i++) {
            var rect: WYRect = this.buttons[i].getRect();
            if (left > rect.left) {
                left = rect.left;
            }
            if (right < rect.right) {
                right = rect.right;
            }
        }
        return right - left;
    }

    private addButton(menu: TVMenu, page: TLPage, i: number, j: number, itemwidth: number, text: string, command: (TLRootPage) => void) {
        var button = new TVButton(this.canvas, this.settings, this.radius, page);
        button.setText(text);

        var treeview = this;
        button.OnClick = function () {
            // 削除
            treeview.renewAndDraw(command, page);
        }

        menu.add(button, i, j, itemwidth);
    }

    public createHeadline(x: number, y: number, page: TLPage): void {
        var openButton = new TVCheckBox(this.canvas, this.settings, this.radius, page);
        openButton.setRect(x, y, this.openButtonWidth, this.lineHeight);
        openButton.setText("＋");
        openButton.setDownText("－");
        openButton.setValue(page.IsExpanded);
        var treeview = this;
        openButton.OnCheck = function () {
            if (openButton.getValue()) {
                treeview.renewAndDraw((root: TLRootPage) => root.Expand(), page);
            } else {
                treeview.renewAndDraw((root: TLRootPage) => root.Unexpand(), page);
            }
        }
        this.buttons.push(openButton);

        if (!this.settings.NoEdit) {
            this.createEditMenu(x, y, page);
        }

        var headlineX: number;
        if (this.settings.NoEdit) {
            headlineX = x + this.openButtonWidthMargin;
        } else {
            headlineX = x + this.openButtonWidthMargin + this.menuButtonWidthMargin;
        }

        var headlineButton = new TVCheckTextBox(this.canvas, this.settings, this.radius, page);
        headlineButton.setRect(headlineX, y, this.headlineWidth, this.lineHeight);
        this.buttons.push(headlineButton);
        this.headlineButtons.push(headlineButton);
        var headlineButtons = this.headlineButtons;
        headlineButton.OnCheck = function () {
            if (!this.getValue()) {
                // 見出し編集を閉じたとき
                treeview.clear(); // いったん全部消去
                treeview.closeMenu(); // メニューを全部閉じる
                treeview.redraw(); // TreeView全体を再描画
            }
            else {
                // 見出し編集を開いたとき
                treeview.clear(); // いったん全部消去
                treeview.closeHeadlines(); // 見出しを全部閉じる
                treeview.closeMenu(); // メニューを全部閉じる
                this.setValue(true); // この見出し編集を開く
                treeview.redraw(); // TreeView全体を再描画
                treeview.showSelectedText(this.getHeadlineText(), this.getContentText());
            }
        }
    }

    private createEditMenu(x: number, y: number, page: TLPage) {
        var treeview = this;
        var menuButton = new TVMenu(this.canvas, this.settings, this.radius, page);
        menuButton.setRect(x + this.openButtonWidthMargin, y, this.menuButtonWidth, this.lineHeight);
        menuButton.setText("▼");
        menuButton.setDownText("▲");
        this.buttons.push(menuButton);

        menuButton.OnCheck = function () {
            if (!this.getValue()) {
                // メニューを閉じたとき
                treeview.clear(); // いったん全部消去
                treeview.redraw(); // TreeView全体を再描画
            }
            else {
                // メニューを開いたとき
                // このメニュー以外で最上位のメニューで開いているものがあるか？
                if (treeview.openMenuCount() >= 2) {
                    // ある場合はこのメニュー以外は閉じる
                    treeview.clear(); // いったん全部消去
                    treeview.closeMenu(); // いったんメニューを全部閉じる
                    treeview.redraw(); // TreeView全体を再描画
                    // このメニューを開く
                    this.setValue(true);
                }
            }
        }
        this.menus.push(menuButton);

        var p = 0;
        var menuMoveButton = new TVMenu(this.canvas, this.settings, this.radius, page);
        menuMoveButton.setUpDownText("移動");
        menuButton.add(menuMoveButton, p++, 1, this.menuButtonWidth2);
        this.addButton(menuMoveButton, page, 0, -1, this.menuButtonWidth, "+", (root: TLRootPage) => root.MoveUp());
        this.addButton(menuMoveButton, page, 0, 1, this.menuButtonWidth, "+", (root: TLRootPage) => root.MoveDown());
        this.addButton(menuMoveButton, page, 1, -1, this.menuButtonWidth, "+", (root: TLRootPage) => root.MoveUpRightBottom());
        this.addButton(menuMoveButton, page, 1, 1, this.menuButtonWidth, "+", (root: TLRootPage) => root.MoveDownRightTop());
        this.addButton(menuMoveButton, page, -1, -1, this.menuButtonWidth, "+", (root: TLRootPage) => root.MoveLeftUp());
        this.addButton(menuMoveButton, page, -1, 1, this.menuButtonWidth, "+", (root: TLRootPage) => root.MoveLeftDown());

        var menuCreateButton = new TVMenu(this.canvas, this.settings, this.radius, page);
        menuCreateButton.setUpDownText("作成");
        menuButton.add(menuCreateButton, p++, 1, this.menuButtonWidth2);
        this.addButton(menuCreateButton, page, 0, -1, this.menuButtonWidth, "+", (root: TLRootPage) => root.CreateUp());
        this.addButton(menuCreateButton, page, 0, 1, this.menuButtonWidth, "+", (root: TLRootPage) => root.CreateDown());
        this.addButton(menuCreateButton, page, 1, -1, this.menuButtonWidth, "+", (root: TLRootPage) => root.CreateRightTop());
        this.addButton(menuCreateButton, page, 1, 1, this.menuButtonWidth, "+", (root: TLRootPage) => root.CreateRightBottom());

        var menuDuplicateButton = new TVMenu(this.canvas, this.settings, this.radius, page);
        menuDuplicateButton.setUpDownText("複製");
        menuButton.add(menuDuplicateButton, p++, 1, this.menuButtonWidth2);
        this.addButton(menuDuplicateButton, page, 0, -1, this.menuButtonWidth, "+", (root: TLRootPage) => root.DuplicateUp());
        this.addButton(menuDuplicateButton, page, 0, -1, this.menuButtonWidth, "+", (root: TLRootPage) => root.DuplicateDown());

        var menuDeleteButton = new TVMenu(this.canvas, this.settings, this.radius, page);
        menuDeleteButton.setUpDownText("削除");
        menuButton.add(menuDeleteButton, p++, 1, this.menuButtonWidth2);
        this.addButton(menuDeleteButton, page, 0, 1, this.menuButtonWidth2, "OK", (root: TLRootPage) => root.DeleteSelectedItem());

        var menuCheckFunc = function () {
            if (!this.getValue()) {
                // メニューを閉じたとき
                treeview.clear(); // いったん全部消去
                treeview.redraw(); // TreeView全体を再描画
            }
            else {
                // メニューを開いたとき
                treeview.clear(); // いったん全部消去
                treeview.closeMenuGroup([menuMoveButton, menuCreateButton, menuDuplicateButton, menuDeleteButton]); // 同じグループのメニューを全部閉じる
                treeview.redraw(); // TreeView全体を再描画
                // このメニューを開く
                this.setValue(true);
            }
        }
        menuMoveButton.OnCheck = menuCheckFunc;
        menuCreateButton.OnCheck = menuCheckFunc;
        menuDuplicateButton.OnCheck = menuCheckFunc;
        menuDeleteButton.OnCheck = menuCheckFunc;
    }

    // メニューが開いているときはまずメニューをチェックして、メニューがクリックされたときは他のボタンはチェックしない
    public mousePressed(x: number, y: number): void {
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].menuContains(x, y)) {
                this.menus[i].mousePressed(x, y);
                return;
            }
        }
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].mousePressed(x, y);
        }
    }

    public mouseReleased(x: number, y: number): void {
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].menuContains(x, y)) {
                this.menus[i].mouseReleased(x, y);
                return;
            }
        }
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].mouseReleased(x, y);
        }
    }

    public mouseMoved(x: number, y: number): void {
    }

    public touchStart = function (x: number, y: number): void {
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].menuContains(x, y)) {
                this.menus[i].touchStart(x, y);
                return;
            }
        }
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].touchStart(x, y);
        }
    }

    public touchEnd(ids): void {
        for (var i = 0; i < this.menus.length; i++) {
            this.menus[i].touchEnd(ids);
            // ここで位置をチェックすべきだが情報がないのでチェックしない
        }
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].touchEnd(ids);
        }
    }

    public touchMove(x: number, y: number): void {
    }

    private headlineElement: HTMLInputElement;
    private contentElement: HTMLTextAreaElement;

    private showSelectedText(headlineText: string, contentText: string) {
        if (this.headlineElement != null) {
            this.headlineElement.value = headlineText;
            this.headlineElement.focus();
        }
        if (this.contentElement != null) {
            this.contentElement.value = contentText;
            if (this.settings.NoTitle) {
                this.contentElement.focus();
            }
        }
    }

    public setSelectedTitle(title: string) {
        if (!this.settings.NoEdit) {
            for (var i = 0; i < this.headlineButtons.length; i++) {
                if (this.headlineButtons[i].getValue()) {
                    this.headlineButtons[i].setHeadlineText(title);
                    this.headlineButtons[i].draw();
                    return;
                }
            }
        }
    }

    public setSelectedText(text: string) {
        if (!this.settings.NoEdit) {
            for (var i = 0; i < this.headlineButtons.length; i++) {
                if (this.headlineButtons[i].getValue()) {
                    this.headlineButtons[i].setContentText(text);
                    return;
                }
            }
        }
    }

    public set HeadlineElement(headlineElement: HTMLInputElement) {
        this.headlineElement = headlineElement;
        var treeview = this;
        headlineElement.onkeydown = function () { treeview.setSelectedTitle(headlineElement.value) }
        headlineElement.onkeyup = function () { treeview.setSelectedTitle(headlineElement.value) }
    }

    public set ContentElement(contentElement: HTMLTextAreaElement) {
        this.contentElement = contentElement;
        var treeview = this;
        contentElement.onkeydown = function () { treeview.setSelectedText(contentElement.value) }
        contentElement.onkeyup = function () { treeview.setSelectedText(contentElement.value) }
    }

    private inputFileElement: HTMLInputElement;

    public set InputFileElement(inputFileElement: HTMLInputElement) {
        this.inputFileElement = inputFileElement;
        var treeview = this;
        inputFileElement.addEventListener("change", function () {
            var file = inputFileElement.files[0];
            treeview.load(file);
            //treeview.loadX(file);
        }, true);
    }

    public load(file: File) {
        // FileReaderを使った読み込み
        var treeview = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            treeview.clear();
            if (file.type == "application/xml" || file.type == "text/xml") {
                var parser = new DOMParser();
                var doc: Document = parser.parseFromString(reader.result, "text/xml");
                treeview.rootPage.loadXML(doc.documentElement);
            } else {
                treeview.rootPage.loadText(reader.result, file.name);
            }
            treeview.draw();
        }
        reader.readAsText(file);
    }

    public loadX(file: File) {
        // XMLHttpRequestを使った読み込み：この関数を使うときファイルはindex.htmlと同じディレクトリにある必要がある
        var request = new XMLHttpRequest();
        request.open("GET", file.name, false);
        request.send(null);
        this.clear();
        if (file.type == "application/xml" || file.type == "text/xml") {
            this.rootPage.loadXML(request.responseXML.documentElement);
        } else {
            this.rootPage.loadText(request.responseText, file.name);
        }
        this.draw();
    }
}
