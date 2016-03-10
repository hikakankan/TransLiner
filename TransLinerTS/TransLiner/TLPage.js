//var fs = require("fs"); // サーバー用
var TLPageCollection = (function () {
    function TLPageCollection() {
        this.Collection = new Array();
    }
    Object.defineProperty(TLPageCollection.prototype, "Count", {
        get: function () {
            return this.Collection.length;
        },
        enumerable: true,
        configurable: true
    });
    TLPageCollection.prototype.Last = function () {
        return this.Collection[this.Collection.length - 1];
    };
    TLPageCollection.prototype.RemoveAt = function (index) {
        this.Collection.splice(index, 1);
    };
    TLPageCollection.prototype.Insert = function (index, page) {
        this.Collection.splice(index, 0, page);
    };
    TLPageCollection.prototype.Add = function (page) {
        this.Collection.push(page);
    };
    TLPageCollection.prototype.Clear = function () {
        this.Collection = new Array();
    };
    return TLPageCollection;
})();
var TLPage = (function () {
    function TLPage(title, text, root, Settings) {
        this.Settings = Settings;
        this.title_length = 40;
        this.title = "";
        this.text = "";
        this.isSelected = false;
        this.isExpanded = false;
        this.title = title;
        this.text = text;
        this.root = root;
        this.SubPages = new TLPageCollection();
        this.loaded = true;
        this.filename = "";
        this.pagePath = "";
    }
    TLPage.prototype.UnselectAll = function () {
        this.IsSelected = false;
        for (var i = 0; i < this.SubPages.Count; i++) {
            this.SubPages.Collection[i].UnselectAll();
        }
    };
    TLPage.prototype.getLine = function (text) {
        var r = text.indexOf('\r');
        var n = text.indexOf('\n');
        if (r >= 0) {
            if (n >= 0) {
                return text.substring(0, Math.min(r, n));
            }
            else {
                return text.substring(0, r);
            }
        }
        else {
            if (n >= 0) {
                return text.substring(0, n);
            }
            else {
                return text;
            }
        }
    };
    TLPage.prototype.getTitle = function (text) {
        if (this.Settings.NoTitle) {
            var line = this.getLine(text);
            if (line.length <= this.title_length) {
                return line;
            }
            else {
                return line.substring(0, this.title_length);
            }
        }
        else {
            return this.title;
        }
    };
    Object.defineProperty(TLPage.prototype, "Title", {
        get: function () {
            var title = this.getTitle(this.text);
            if (title == "") {
                if (this.title != "") {
                    // ページごとにロードしたときここにタイトルが入っている
                    return this.title;
                }
                return "タイトルなし";
            }
            else {
                return title;
            }
        },
        set: function (title) {
            // ページごとにロードしたときのため、タイトルなしのときもここにタイトルを入れておく
            this.title = title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TLPage.prototype, "Text", {
        get: function () {
            this.loadPageFile(); // 分割ロード用
            return this.text;
        },
        set: function (value) {
            this.text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TLPage.prototype, "IsSelected", {
        get: function () {
            return this.isSelected;
        },
        set: function (value) {
            this.isSelected = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TLPage.prototype, "IsExpanded", {
        get: function () {
            return this.isExpanded;
        },
        set: function (value) {
            if (value) {
                this.loadPageFile(); // 分割ロード用
            }
            this.isExpanded = value;
        },
        enumerable: true,
        configurable: true
    });
    TLPage.prototype.CanExpand = function () {
        return !this.IsExpanded && (!this.loaded || this.SubPages.Count > 0);
    };
    Object.defineProperty(TLPage.prototype, "SelectedPage", {
        get: function () {
            if (this.IsSelected) {
                return this;
            }
            else {
                for (var _i = 0, _a = this.SubPages.Collection; _i < _a.length; _i++) {
                    var page = _a[_i];
                    var selectedPage = page.SelectedPage;
                    if (selectedPage != null) {
                        return selectedPage;
                    }
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    TLPage.prototype.validIndex = function (index, count) {
        if (count != null) {
            return index >= 0 && index < count;
        }
        else {
            return index >= 0;
        }
    };
    TLPage.prototype.MoveLeft = function (parent, myIndex, parentparent, parentIndex, dest) {
        if (this.IsSelected) {
            if (this.validIndex(myIndex) && this.validIndex(parentIndex)) {
                parent.SubPages.RemoveAt(myIndex);
                parentparent.SubPages.Insert(parentIndex + dest, this);
                return true;
            }
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.MoveLeft(this, i, parent, myIndex, dest)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.MoveRight = function (parent, myIndex, destBefore, destAfter, destTop) {
        if (this.IsSelected) {
            if (this.validIndex(myIndex) && this.validIndex(myIndex + destBefore, parent.SubPages.Count)) {
                parent.SubPages.RemoveAt(myIndex);
                if (destTop) {
                    parent.SubPages.Collection[myIndex + destAfter].SubPages.Insert(0, this);
                }
                else {
                    parent.SubPages.Collection[myIndex + destAfter].SubPages.Add(this);
                }
                if (!parent.SubPages.Collection[myIndex + destAfter].IsExpanded) {
                    parent.SubPages.Collection[myIndex + destAfter].IsExpanded = true;
                }
                return true;
            }
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.MoveRight(this, i, destBefore, destAfter, destTop)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.Move = function (parent, myIndex, dest) {
        if (this.IsSelected) {
            if (this.validIndex(myIndex) && this.validIndex(myIndex + dest, parent.SubPages.Count)) {
                parent.SubPages.RemoveAt(myIndex);
                parent.SubPages.Insert(myIndex + dest, this);
                return true;
            }
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.Move(this, i, dest)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.SelectedMove = function (parent, myIndex, dest) {
        if (this.IsSelected) {
            if (this.validIndex(myIndex) && myIndex + dest == -1) {
                // 先頭の項目が選択されている状態でさらに上に移動すると上位に移動
                parent.IsSelected = true;
            }
            else if (this.validIndex(myIndex) && myIndex + dest == parent.SubPages.Count) {
                // 最後尾の項目が選択されている状態でさらに下に移動すると上位の下の項目に移動
                parent.IsSelected = true;
                this.root.SelectedDownOver(null, -1);
            }
            else if (this.IsExpanded && dest == 1) {
                // 項目が開いている状態で下に移動すると下位の先頭に移動
                if (this.SubPages.Count > 0) {
                    this.SubPages.Collection[0].IsSelected = true;
                }
            }
            else if (this.validIndex(myIndex) && this.validIndex(myIndex + dest, parent.SubPages.Count)) {
                if (dest == -1) {
                    parent.SubPages.Collection[myIndex + dest].SelectLastExpandedItem();
                }
                else {
                    parent.SubPages.Collection[myIndex + dest].IsSelected = true;
                }
            }
            return true;
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.SelectedMove(this, i, dest)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.SelectLastExpandedItem = function () {
        if (this.IsExpanded && this.SubPages.Count > 0) {
            this.SubPages.Last().SelectLastExpandedItem();
        }
        else {
            this.IsSelected = true;
        }
    };
    TLPage.prototype.SelectedDownOver = function (parent, myIndex) {
        var dest = 1;
        if (this.IsSelected) {
            if (this.validIndex(myIndex) && myIndex + dest == parent.SubPages.Count) {
                // 最後尾の項目が選択されている状態でさらに下に移動すると上位の下の項目に移動
                parent.IsSelected = true;
                this.root.SelectedDownOver(null, -1);
            }
            else if (this.validIndex(myIndex) && this.validIndex(myIndex + dest, parent.SubPages.Count)) {
                parent.SubPages.Collection[myIndex + dest].IsSelected = true;
            }
            return true;
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.SelectedDownOver(this, i)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.ExpandedChange = function (parent, myIndex, expanded) {
        if (this.IsSelected) {
            if (!this.IsExpanded) {
                if (!expanded) {
                    // 項目が閉じている状態でさらに閉じようとすると上位に移動
                    if (this.validIndex(myIndex)) {
                        parent.IsSelected = true;
                    }
                }
                else {
                    this.IsExpanded = expanded;
                }
            }
            else {
                if (!expanded) {
                    this.IsExpanded = expanded;
                }
                else {
                    // 項目が開いている状態でさらに開こうとすると下位の先頭に移動
                    if (this.SubPages.Count > 0) {
                        this.SubPages.Collection[0].IsSelected = true;
                    }
                }
            }
            return true;
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.ExpandedChange(this, i, expanded)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.Create = function (parent, myIndex, dest) {
        if (this.IsSelected) {
            if (this.validIndex(myIndex)) {
                var page = new TLPage("", "", this.root, this.Settings);
                parent.SubPages.Insert(myIndex + dest, page);
                page.IsSelected = true;
                return true;
            }
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.Create(this, i, dest)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.CreateRight = function (parent, myIndex, destTop) {
        if (this.IsSelected) {
            if (this.validIndex(myIndex)) {
                var page = new TLPage("", "", this.root, this.Settings);
                if (destTop) {
                    this.SubPages.Insert(0, page);
                }
                else {
                    this.SubPages.Add(page);
                }
                this.IsExpanded = true;
                page.IsSelected = true;
                return true;
            }
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.CreateRight(this, i, destTop)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.Delete = function (parent, myIndex) {
        if (this.IsSelected) {
            if (this.validIndex(myIndex)) {
                parent.SubPages.RemoveAt(myIndex);
                if (this.validIndex(myIndex, this.SubPages.Count)) {
                    parent.SubPages.Collection[myIndex].IsSelected = true;
                }
                else {
                    if (this.validIndex(myIndex - 1)) {
                        parent.SubPages.Collection[myIndex - 1].IsSelected = true;
                    }
                    else {
                    }
                }
                return true;
            }
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.Delete(this, i)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.Clone = function () {
        var page = new TLPage(this.Title, this.Text, this.root, this.Settings);
        for (var i = 0; i < this.SubPages.Count; i++) {
            var subpage = this.SubPages.Collection[i].Clone();
            page.SubPages.Add(subpage);
        }
        return page;
    };
    TLPage.prototype.Duplicate = function (parent, myIndex, dest) {
        if (this.IsSelected) {
            if (this.validIndex(myIndex)) {
                var page = this.Clone();
                parent.SubPages.Insert(myIndex + dest, page);
                page.IsSelected = true;
                return true;
            }
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.Duplicate(this, i, dest)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.DuplicateRight = function (parent, myIndex, destTop) {
        if (this.IsSelected) {
            if (this.validIndex(myIndex)) {
                var page = this.Clone();
                if (destTop) {
                    this.SubPages.Insert(0, page);
                }
                else {
                    this.SubPages.Add(page);
                }
                this.IsExpanded = true;
                page.IsSelected = true;
                return true;
            }
        }
        else {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                if (subpage.DuplicateRight(this, i, destTop)) {
                    return true;
                }
            }
        }
        return false;
    };
    TLPage.prototype.create_text = function (doc, name, text) {
        var element = doc.createElement(name);
        var content = doc.createTextNode(text);
        element.appendChild(content);
        return element;
    };
    TLPage.prototype.ToXml = function (doc) {
        var page = doc.createElement("page");
        page.appendChild(this.create_text(doc, "title", this.Title));
        page.appendChild(this.create_text(doc, "text", this.text));
        var subpages = doc.createElement("subpages");
        page.appendChild(subpages);
        for (var _i = 0, _a = this.SubPages.Collection; _i < _a.length; _i++) {
            var p = _a[_i];
            if (this.Settings.PageLoad) {
                var subpage = doc.createElement("page");
                subpage.appendChild(this.create_text(doc, "title", p.Title));
                subpages.appendChild(subpage);
            }
            else {
                subpages.appendChild(p.ToXml(doc));
            }
        }
        return page;
    };
    TLPage.prototype.ToJSON = function () {
        var subpages = new Array();
        for (var _i = 0, _a = this.SubPages.Collection; _i < _a.length; _i++) {
            var p = _a[_i];
            if (this.Settings.PageLoad) {
                subpages.push({ "Title": p.Title });
            }
            else {
                subpages.push(p.ToJSON());
            }
        }
        return { "Title": this.Title, "Text": this.Text, "SubPages": subpages };
    };
    TLPage.prototype.find_element = function (parent, name) {
        if (parent.hasChildNodes) {
            for (var i = 0; i < parent.childNodes.length; i++) {
                var child = parent.childNodes[i];
                if (child.nodeType == Node.ELEMENT_NODE && child.nodeName == name) {
                    return child;
                }
            }
        }
        return null;
    };
    TLPage.prototype.get_text = function (parent, name) {
        var element = this.find_element(parent, name);
        return element.textContent;
    };
    TLPage.prototype.FromXml = function (element) {
        this.Title = this.get_text(element, "title");
        var fileelement = this.find_element(element, "file");
        if (fileelement != null) {
            this.loaded = false;
            this.filename = fileelement.textContent;
        }
        else {
            var subpages = this.find_element(element, "subpages");
            if (subpages != null) {
                this.loaded = true;
                this.filename = "";
                this.Text = this.get_text(element, "text");
                for (var i = 0; i < subpages.childNodes.length; i++) {
                    var child = subpages.childNodes[i];
                    if (child.nodeType == Node.ELEMENT_NODE) {
                        var page = new TLPage("", "", this.root, this.Settings);
                        page.FromXml(child);
                        this.SubPages.Add(page);
                    }
                }
            }
            else {
                // ファイルが指定されていなくてサブページもないときはページごとのロード
                this.loaded = false;
                this.filename = "";
            }
        }
    };
    TLPage.prototype.FromJSON = function (obj) {
        this.Title = obj["Title"];
        var file = obj["File"];
        if (file != null) {
            this.loaded = false;
            this.filename = file;
        }
        else {
            var subpages = obj["SubPages"];
            if (subpages != null) {
                this.loaded = true;
                this.filename = "";
                this.Text = obj["Text"];
                for (var i = 0; i < subpages.length; i++) {
                    var child = subpages[i];
                    var page = new TLPage("", "", this.root, this.Settings);
                    page.FromJSON(child);
                    this.SubPages.Add(page);
                }
            }
            else {
                // ファイルが指定されていなくてサブページもないときはページごとのロード
                this.loaded = false;
                this.filename = "";
            }
        }
    };
    // パスからページを取得
    TLPage.prototype.getPageByPath = function (path) {
        if (path.length == 0) {
            return this;
        }
        else {
            var index = Number(path[0]);
            if (index >= 0 && index < this.SubPages.Count) {
                return this.SubPages.Collection[index].getPageByPath(path.slice(1));
            }
        }
        return null;
    };
    TLPage.prototype.getPageByPathString = function (path) {
        return this.getPageByPath(path.split("/").slice(1));
    };
    // 現在ロードされているすべてのページにパスを設定する
    TLPage.prototype.setPath = function (path) {
        this.pagePath = path;
        if (this.loaded) {
            for (var i = 0; i < this.SubPages.Count; i++) {
                var subpage = this.SubPages.Collection[i];
                subpage.setPath(path + "/" + String(i));
            }
        }
    };
    TLPage.prototype.loadPageFile = function () {
        if (!this.loaded) {
            if (this.filename != "") {
                this.Load(this.filename);
            }
            else {
                // ページごとのロード
                this.root.setPath("0");
                this.Load("tlcom.command?name=getpage&path=" + this.pagePath);
            }
            this.loaded = true;
            this.filename = "";
        }
    };
    TLPage.prototype.get_ext = function (file) {
        var index = file.lastIndexOf(".");
        if (index >= 0) {
            return file.substring(index + 1);
        }
        return "";
    };
    TLPage.prototype.Load = function (path) {
        // ファイルの拡張子によって LoadXML か LoadJSON のどちらかを実行する
        if (this.get_ext(path) == "xml") {
            this.LoadXML(path);
        }
        else {
            this.LoadJSON(path);
        }
    };
    // サーバー用
    //TLPage.prototype.Load = function (path) {
    //    // サーバー側 Node.js で使う
    //    var this_ = this;
    //    fs.readFile("./" + path, "UTF-8", function (err, data) {
    //        if (err) {
    //            console.log("readFile error");
    //            throw err;
    //        }
    //        var obj = JSON.parse(data);
    //        this_.FromJSON(obj);
    //    });
    //};
    TLPage.prototype.LoadXML = function (path) {
        // ブラウザ側で使う
        var request = new XMLHttpRequest();
        request.open("GET", path, false);
        request.send(null);
        var doc = request.responseXML;
        this.FromXml(doc.documentElement);
    };
    TLPage.prototype.LoadJSON = function (path) {
        // ブラウザ側で使う
        var request = new XMLHttpRequest();
        request.open("GET", path, false);
        request.send(null);
        this.FromJSON(JSON.parse(request.responseText));
    };
    TLPage.prototype.Save = function (path) {
        // ブラウザ側では処理できないので処理はなし
    };
    // サーバー用
    //TLPage.prototype.Save = function (path) {
    //    // サーバー側 Node.js で使う
    //    var obj = this.ToJSON();
    //    var data = JSON.stringify(obj);
    //    fs.writeFile("./" + path, data, "UTF-8", function (err) {
    //        if (err) {
    //            console.log("writeFile error");
    //            throw err;
    //        }
    //    });
    //};
    //private string totOpmlText(string text)
    //{
    //    return Regex.Replace(text, "\r\n", "\n");
    //}
    //public XmlElement ToOpml(XmlDocument doc, string name)
    //{
    //    XmlElement page = doc.CreateElement(name);
    //    page.SetAttribute("text", Title);
    //    page.SetAttribute("_note", totOpmlText(text));
    //    foreach(TLPage p in SubPages)
    //    {
    //        page.AppendChild(p.ToOpml(doc));
    //    }
    //    return page;
    //}
    //public XmlElement ToOpml(XmlDocument doc)
    //{
    //    return ToOpml(doc, "outline");
    //}
    //private string fromOpmlText(string title, string text)
    //{
    //    string s = Regex.Replace(text, "\n", "\r\n");
    //    if (s.StartsWith(title)) {
    //        return s;
    //    }
    //    else {
    //        return title + "\r\n" + s;
    //    }
    //}
    //public void FromOpml(XmlElement element)
    //{
    //    string title = element.GetAttribute("text");
    //    string text = element.GetAttribute("_note");
    //    Text = fromOpmlText(title, text);
    //    foreach(XmlNode child in element.ChildNodes)
    //    {
    //        if (child is XmlElement )
    //        {
    //            TLPage page = new TLPage("", root);
    //            page.FromOpml((XmlElement)child);
    //            SubPages.Add(page);
    //        }
    //    }
    //}
    ///// <summary>
    ///// Carbonfin Outliner形式のOPMLを読み込む
    ///// </summary>
    ///// <param name="path"></param>
    //public void LoadOPML(string path)
    //{
    //    XmlDocument doc = new XmlDocument();
    //    if (File.Exists(path)) {
    //        doc.Load(path);
    //        FromOpml(find_element(doc.DocumentElement, "body"));
    //    }
    //}
    ///// <summary>
    ///// Carbonfin Outliner形式のOPMLを保存
    ///// </summary>
    ///// <param name="path"></param>
    //public void SaveOPML(string path)
    //{
    //    XmlDocument doc = new XmlDocument();
    //    XmlElement root = doc.CreateElement("opml");
    //    root.SetAttribute("version", "1.0");
    //    doc.AppendChild(root);
    //    XmlElement head = doc.CreateElement("head");
    //    head.AppendChild(create_text(doc, "title", Title));
    //    root.AppendChild(head);
    //    XmlElement body = ToOpml(doc, "body");
    //    root.AppendChild(body);
    //    doc.Save(path);
    //}
    ///// <summary>
    ///// WZ形式のテキストに変換
    ///// </summary>
    ///// <param name="header"></param>
    ///// <returns></returns>
    //public string ToText(string header)
    //{
    //    string text = header + Text;
    //    if (!Regex.IsMatch(text, @"\r\n$") )
    //    {
    //        text += "\r\n";
    //    }
    //    foreach(TLPage page in SubPages)
    //    {
    //        text += page.ToText(header + ".");
    //    }
    //    return text;
    //}
    TLPage.prototype.StartsWith = function (str, header) {
        return str.length >= header.length && str.substr(0, header.length) == header;
    };
    TLPage.prototype.splitSections = function (sections, header) {
        var result = new Array();
        var chapter = null;
        for (var _i = 0; _i < sections.length; _i++) {
            var section = sections[_i];
            if (this.StartsWith(section, header)) {
                if (chapter == null) {
                    chapter = new Array();
                }
                chapter.push(section.substring(1));
            }
            else {
                if (chapter != null) {
                    result.push(chapter);
                }
                chapter = new Array();
                chapter.push(section);
            }
        }
        if (chapter != null) {
            result.push(chapter);
        }
        return result;
    };
    TLPage.prototype.FromText = function (sections, header) {
        if (sections.length > 0) {
            this.Text = sections[0];
            var sections2 = sections.slice(1);
            for (var _i = 0, _a = this.splitSections(sections2, header); _i < _a.length; _i++) {
                var chapter = _a[_i];
                var page = new TLPage("", "", this.root, this.Settings);
                page.FromText(chapter, header);
                this.SubPages.Add(page);
            }
        }
    };
    return TLPage;
})();
//module.exports = TLPage; // サーバー用
//# sourceMappingURL=TLPage.js.map