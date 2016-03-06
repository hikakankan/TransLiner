var TreeView = (function () {
    function TreeView(canvas, rootPage, settings) {
        this.openButtonWidth = 24;
        this.openButtonWidthMargin = 26;
        this.menuButtonWidth = 24;
        this.menuButtonWidthMargin = 26;
        this.menuButtonWidth2 = 48;
        this.headlineWidth = 320;
        this.lineHeight = 24;
        this.radius = 12;
        this.xButtonSize = 24;
        this.yButtonSize = 26;
        this.touchStart = function (x, y) {
            for (var i = 0; i < this.menus.length; i++) {
                if (this.menus[i].menuContains(x, y)) {
                    this.menus[i].touchStart(x, y);
                    return;
                }
            }
            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].touchStart(x, y);
            }
        };
        this.canvas = canvas;
        this.rootPage = rootPage;
        this.settings = settings;
        this.buttons = new Array();
        this.menus = new Array();
        this.headlineButtons = new Array();
        def_mouse_event(canvas, this);
    }
    TreeView.prototype.redraw = function () {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
        }
        // 開いているメニューを描画
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].getValue()) {
                this.menus[i].draw();
            }
        }
    };
    TreeView.prototype.clear = function () {
        var gc = this.canvas.getContext("2d");
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].clear(gc, this.settings.BodyBackColor);
        }
        for (var i = 0; i < this.menus.length; i++) {
            this.menus[i].clear(gc, this.settings.BodyBackColor);
        }
    };
    TreeView.prototype.draw = function () {
        this.buttons = new Array();
        this.menus = new Array();
        this.headlineButtons = new Array();
        this.createTree(this.rootPage, 0, 0);
        // キャンバスのサイズが小さすぎるときは大きくする
        if (this.canvas.height < this.createTreeHeight(this.rootPage) + this.yButtonSize * 2) {
            this.canvas.height = this.createTreeHeight(this.rootPage) + this.yButtonSize * 2;
        }
        if (this.canvas.width < this.getTreeWidth() + this.xButtonSize * 2) {
            this.canvas.width = this.getTreeWidth() + this.xButtonSize * 2;
        }
        this.redraw();
    };
    TreeView.prototype.renewAndDraw = function (command, page) {
        // TreeViewを作り直して再描画
        this.clear(); // いったん全部消去
        this.closeMenuAll(); // メニューを閉じる
        this.rootPage.SelectedPage = page;
        command(this.rootPage);
        this.draw();
    };
    TreeView.prototype.closeMenuAll = function () {
        for (var i = 0; i < this.menus.length; i++) {
            this.menus[i].closeAll();
        }
    };
    TreeView.prototype.closeMenu = function () {
        this.closeMenuGroup(this.menus);
    };
    TreeView.prototype.closeMenuGroup = function (menus) {
        for (var i = 0; i < menus.length; i++) {
            menus[i].setValue(false);
        }
    };
    TreeView.prototype.closeHeadlines = function () {
        for (var i = 0; i < this.headlineButtons.length; i++) {
            this.headlineButtons[i].setValue(false);
        }
    };
    TreeView.prototype.openMenuCount = function () {
        var count = 0;
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].getValue()) {
                count++;
            }
        }
        return count;
    };
    TreeView.prototype.createTree = function (page, x, y) {
        if (!page.CanExpand()) {
            page.IsExpanded = true;
        }
        this.createHeadline(x, y, page);
        var height = this.yButtonSize;
        if (page.IsExpanded && page.SubPages.Count > 0) {
            for (var i = 0; i < page.SubPages.Count; i++) {
                var subpage = page.SubPages.Collection[i];
                this.createTree(subpage, x + this.xButtonSize, y + height);
                height += this.createTreeHeight(subpage);
            }
        }
    };
    TreeView.prototype.createTreeHeight = function (page) {
        var height = this.yButtonSize;
        if (page.IsExpanded && page.SubPages.Count > 0) {
            for (var i = 0; i < page.SubPages.Count; i++) {
                var subpage = page.SubPages.Collection[i];
                height += this.createTreeHeight(subpage);
            }
        }
        return height;
    };
    TreeView.prototype.getTreeWidth = function () {
        var left = 0;
        var right = 0;
        for (var i = 0; i < this.buttons.length; i++) {
            var rect = this.buttons[i].getRect();
            if (left > rect.left) {
                left = rect.left;
            }
            if (right < rect.right) {
                right = rect.right;
            }
        }
        return right - left;
    };
    TreeView.prototype.addButton = function (menu, page, i, j, itemwidth, text, command) {
        var button = new TVButton(this.canvas, this.settings, this.radius, page);
        button.setText(text);
        var treeview = this;
        button.OnClick = function () {
            // 削除
            treeview.renewAndDraw(command, page);
        };
        menu.add(button, i, j, itemwidth);
    };
    TreeView.prototype.createHeadline = function (x, y, page) {
        var openButton = new TVCheckBox(this.canvas, this.settings, this.radius, page);
        openButton.setRect(x, y, this.openButtonWidth, this.lineHeight);
        openButton.setText("＋");
        openButton.setDownText("－");
        openButton.setValue(page.IsExpanded);
        var treeview = this;
        openButton.OnCheck = function () {
            if (openButton.getValue()) {
                treeview.renewAndDraw(function (root) { return root.Expand(); }, page);
            }
            else {
                treeview.renewAndDraw(function (root) { return root.Unexpand(); }, page);
            }
        };
        this.buttons.push(openButton);
        if (!this.settings.NoEdit) {
            this.createEditMenu(x, y, page);
        }
        var headlineX;
        if (this.settings.NoEdit) {
            headlineX = x + this.openButtonWidthMargin;
        }
        else {
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
        };
    };
    TreeView.prototype.createEditMenu = function (x, y, page) {
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
        };
        this.menus.push(menuButton);
        var p = 0;
        var menuMoveButton = new TVMenu(this.canvas, this.settings, this.radius, page);
        menuMoveButton.setUpDownText("移動");
        menuButton.add(menuMoveButton, p++, 1, this.menuButtonWidth2);
        this.addButton(menuMoveButton, page, 0, -1, this.menuButtonWidth, "+", function (root) { return root.MoveUp(); });
        this.addButton(menuMoveButton, page, 0, 1, this.menuButtonWidth, "+", function (root) { return root.MoveDown(); });
        this.addButton(menuMoveButton, page, 1, -1, this.menuButtonWidth, "+", function (root) { return root.MoveUpRightBottom(); });
        this.addButton(menuMoveButton, page, 1, 1, this.menuButtonWidth, "+", function (root) { return root.MoveDownRightTop(); });
        this.addButton(menuMoveButton, page, -1, -1, this.menuButtonWidth, "+", function (root) { return root.MoveLeftUp(); });
        this.addButton(menuMoveButton, page, -1, 1, this.menuButtonWidth, "+", function (root) { return root.MoveLeftDown(); });
        var menuCreateButton = new TVMenu(this.canvas, this.settings, this.radius, page);
        menuCreateButton.setUpDownText("作成");
        menuButton.add(menuCreateButton, p++, 1, this.menuButtonWidth2);
        this.addButton(menuCreateButton, page, 0, -1, this.menuButtonWidth, "+", function (root) { return root.CreateUp(); });
        this.addButton(menuCreateButton, page, 0, 1, this.menuButtonWidth, "+", function (root) { return root.CreateDown(); });
        this.addButton(menuCreateButton, page, 1, -1, this.menuButtonWidth, "+", function (root) { return root.CreateRightTop(); });
        this.addButton(menuCreateButton, page, 1, 1, this.menuButtonWidth, "+", function (root) { return root.CreateRightBottom(); });
        var menuDuplicateButton = new TVMenu(this.canvas, this.settings, this.radius, page);
        menuDuplicateButton.setUpDownText("複製");
        menuButton.add(menuDuplicateButton, p++, 1, this.menuButtonWidth2);
        this.addButton(menuDuplicateButton, page, 0, -1, this.menuButtonWidth, "+", function (root) { return root.DuplicateUp(); });
        this.addButton(menuDuplicateButton, page, 0, -1, this.menuButtonWidth, "+", function (root) { return root.DuplicateDown(); });
        var menuDeleteButton = new TVMenu(this.canvas, this.settings, this.radius, page);
        menuDeleteButton.setUpDownText("削除");
        menuButton.add(menuDeleteButton, p++, 1, this.menuButtonWidth2);
        this.addButton(menuDeleteButton, page, 0, 1, this.menuButtonWidth2, "OK", function (root) { return root.DeleteSelectedItem(); });
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
        };
        menuMoveButton.OnCheck = menuCheckFunc;
        menuCreateButton.OnCheck = menuCheckFunc;
        menuDuplicateButton.OnCheck = menuCheckFunc;
        menuDeleteButton.OnCheck = menuCheckFunc;
    };
    // メニューが開いているときはまずメニューをチェックして、メニューがクリックされたときは他のボタンはチェックしない
    TreeView.prototype.mousePressed = function (x, y) {
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].menuContains(x, y)) {
                this.menus[i].mousePressed(x, y);
                return;
            }
        }
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].mousePressed(x, y);
        }
    };
    TreeView.prototype.mouseReleased = function (x, y) {
        for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].menuContains(x, y)) {
                this.menus[i].mouseReleased(x, y);
                return;
            }
        }
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].mouseReleased(x, y);
        }
    };
    TreeView.prototype.mouseMoved = function (x, y) {
    };
    TreeView.prototype.touchEnd = function (ids) {
        for (var i = 0; i < this.menus.length; i++) {
            this.menus[i].touchEnd(ids);
        }
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].touchEnd(ids);
        }
    };
    TreeView.prototype.touchMove = function (x, y) {
    };
    TreeView.prototype.showSelectedText = function (headlineText, contentText) {
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
    };
    TreeView.prototype.setSelectedTitle = function (title) {
        if (!this.settings.NoEdit) {
            for (var i = 0; i < this.headlineButtons.length; i++) {
                if (this.headlineButtons[i].getValue()) {
                    this.headlineButtons[i].setHeadlineText(title);
                    this.headlineButtons[i].draw();
                    return;
                }
            }
        }
    };
    TreeView.prototype.setSelectedText = function (text) {
        if (!this.settings.NoEdit) {
            for (var i = 0; i < this.headlineButtons.length; i++) {
                if (this.headlineButtons[i].getValue()) {
                    this.headlineButtons[i].setContentText(text);
                    return;
                }
            }
        }
    };
    Object.defineProperty(TreeView.prototype, "HeadlineElement", {
        set: function (headlineElement) {
            this.headlineElement = headlineElement;
            var treeview = this;
            headlineElement.onkeydown = function () { treeview.setSelectedTitle(headlineElement.value); };
            headlineElement.onkeyup = function () { treeview.setSelectedTitle(headlineElement.value); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeView.prototype, "ContentElement", {
        set: function (contentElement) {
            this.contentElement = contentElement;
            var treeview = this;
            contentElement.onkeydown = function () { treeview.setSelectedText(contentElement.value); };
            contentElement.onkeyup = function () { treeview.setSelectedText(contentElement.value); };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeView.prototype, "InputFileElement", {
        set: function (inputFileElement) {
            this.inputFileElement = inputFileElement;
            var treeview = this;
            inputFileElement.addEventListener("change", function () {
                var file = inputFileElement.files[0];
                treeview.load(file);
                //treeview.loadX(file);
            }, true);
        },
        enumerable: true,
        configurable: true
    });
    TreeView.prototype.load = function (file) {
        // FileReaderを使った読み込み
        var treeview = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            treeview.clear();
            if (file.type == "application/xml" || file.type == "text/xml") {
                var parser = new DOMParser();
                var doc = parser.parseFromString(reader.result, "text/xml");
                treeview.rootPage.loadXML(doc.documentElement);
            }
            else {
                treeview.rootPage.loadText(reader.result, file.name);
            }
            treeview.draw();
        };
        reader.readAsText(file);
    };
    TreeView.prototype.loadX = function (file) {
        // XMLHttpRequestを使った読み込み：この関数を使うときファイルはindex.htmlと同じディレクトリにある必要がある
        var request = new XMLHttpRequest();
        request.open("GET", file.name, false);
        request.send(null);
        this.clear();
        if (file.type == "application/xml" || file.type == "text/xml") {
            this.rootPage.loadXML(request.responseXML.documentElement);
        }
        else {
            this.rootPage.loadText(request.responseText, file.name);
        }
        this.draw();
    };
    TreeView.prototype.loadXML = function (filename) {
        // XMLHttpRequestを使った読み込み：この関数を使うときファイルはindex.htmlと同じディレクトリにある必要がある
        this.settings.NoTitle = true; // テキストとは別に見出しを設定するかどうか(trueのときテキストの先頭部分が見出しになる)
        this.settings.NoEdit = false; // 編集可能かどうか(trueのとき編集不可)
        this.rootPage.NoTitle = this.settings.NoTitle;
        var request = new XMLHttpRequest();
        request.open("GET", filename, false);
        request.send(null);
        this.clear();
        this.rootPage.loadXML(request.responseXML.documentElement);
        this.draw();
    };
    TreeView.prototype.loadXMLbyFile = function (filename) {
        // XMLHttpRequestを使った読み込み：この関数を使うときファイルはindex.htmlと同じディレクトリにある必要がある
        this.settings.NoTitle = false; // テキストとは別に見出しを設定するかどうか(trueのときテキストの先頭部分が見出しになる)
        this.settings.NoEdit = true; // 編集可能かどうか(trueのとき編集不可)
        this.rootPage.NoTitle = this.settings.NoTitle;
        var request = new XMLHttpRequest();
        request.open("GET", filename, false);
        request.send(null);
        this.clear();
        this.rootPage.loadXML(request.responseXML.documentElement);
        this.draw();
    };
    return TreeView;
})();
//# sourceMappingURL=TreeView.js.map