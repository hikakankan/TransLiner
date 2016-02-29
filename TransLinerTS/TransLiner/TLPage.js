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
    return TLPageCollection;
})();
var TLPage = (function () {
    function TLPage(title, text, root, NoTitle) {
        this.NoTitle = NoTitle;
        this.title_length = 40;
        this.title = "";
        this.text = "";
        this.isSelected = false;
        this.isExpanded = false;
        this.title = title;
        this.text = text;
        this.root = root;
        this.SubPages = new TLPageCollection();
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
        if (this.NoTitle) {
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
                return "タイトルなし";
            }
            else {
                return title;
            }
        },
        set: function (title) {
            if (!this.NoTitle) {
                this.title = title;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TLPage.prototype, "Text", {
        get: function () {
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
            this.isExpanded = value;
        },
        enumerable: true,
        configurable: true
    });
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
                var page = new TLPage("", "", this.root, this.NoTitle);
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
                var page = new TLPage("", "", this.root, this.NoTitle);
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
        var page = new TLPage(this.Title, this.Text, this.root, this.NoTitle);
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
    return TLPage;
})();
//# sourceMappingURL=TLPage.js.map