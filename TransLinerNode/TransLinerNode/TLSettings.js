var TLSettings = (function () {
    function TLSettings(settings_file) {
        /// <summary>
        /// ウィンドウの位置(左)
        /// </summary>
        this.Left = 80;
        /// <summary>
        /// ウィンドウの位置(上)
        /// </summary>
        this.Top = 80;
        /// <summary>
        /// ウィンドウの幅
        /// </summary>
        this.Width = 400;
        /// <summary>
        /// ウィンドウの高さ
        /// </summary>
        this.Height = 300;
        this.VerticalSplitter = 150;
        this.XMLFileName = "";
        this.OPMLFileName = "";
        this.TextFileName = "";
        this.IndentHeader = ".";
        this.MarkList = ["+", "-", "*", "#", "$", "%"];
        this.MarkListDefault = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳"];
        //public Encoding: Encoding = Encoding.UTF8;
        this.LineEnd = "\r\n";
        this.settings_file_name = settings_file;
    }
    /// <summary>
    /// XMLのセクションの対応するエレメントを取得する
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="parent">エレメントを探す親のノード</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <param name="create">取得できなかったときは作成する</param>
    /// <returns>セクションに対応するノード</returns>
    TLSettings.prototype.get_section = function (section, parent, doc, create) {
        if (parent.hasChildNodes) {
            for (var i = 0; i < parent.childNodes.length; i++) {
                var node = parent.childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE && node.nodeName == section) {
                    return node;
                }
            }
        }
        if (create) {
            var child = doc.createElement(section);
            parent.appendChild(child);
            return child;
        }
        else {
            return null;
        }
    };
    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">TypeScript版ではこの引数はなし：設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    TLSettings.prototype.get_setting_string_ = function (section, key, doc) {
        try {
            var conf = doc.documentElement;
            if (conf != null) {
                var sec = this.get_section(section, conf, doc, false);
                if (sec != null) {
                    var val = sec.getAttribute(key);
                    return val;
                }
            }
        }
        catch (Exception) {
        }
        return null;
    };
    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <returns>設定の値</returns>
    TLSettings.prototype.get_setting_string = function (section, key, val, doc) {
        try {
            var setting = this.get_setting_string_(section, key, doc);
            if (setting != null) {
                return setting;
            }
            return val;
        }
        catch (Exception) {
            return val;
        }
    };
    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <returns>設定の値</returns>
    TLSettings.prototype.get_setting_integer = function (section, key, val, doc) {
        try {
            var setting = this.get_setting_string_(section, key, doc);
            if (setting != null) {
                return Number(setting);
            }
            return val;
        }
        catch (Exception) {
            return val;
        }
    };
    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <returns>設定の値</returns>
    TLSettings.prototype.get_setting_bool = function (section, key, val, doc) {
        try {
            var setting = this.get_setting_string_(section, key, doc);
            if (setting != null) {
                return setting != "f";
            }
            return val;
        }
        catch (Exception) {
            return val;
        }
    };
    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <returns>設定の値</returns>
    TLSettings.prototype.get_setting_real = function (section, key, val, doc) {
        try {
            var setting = this.get_setting_string_(section, key, doc);
            if (setting != null) {
                return Number(setting);
            }
            return val;
        }
        catch (Exception) {
            return val;
        }
    };
    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <returns>設定の値</returns>
    //private get_setting_encoding(section: string, key: string, val: Encoding, doc: Document): Encoding {
    //    try {
    //        var setting: string = this.get_setting_string_(section, key, doc);
    //        if (setting != null) {
    //            if (setting == "Default") {
    //                return Encoding.Default;
    //            }
    //            else if (setting == "Unicode") {
    //                return Encoding.Unicode;
    //            }
    //            else if (setting == "UTF7") {
    //                return Encoding.UTF7;
    //            }
    //            else if (setting == "UTF8") {
    //                return Encoding.UTF8;
    //            }
    //            else if (setting == "UTF32") {
    //                return Encoding.UTF32;
    //            }
    //        }
    //        return val;
    //    }
    //    catch (Exception) {
    //        return val;
    //    }
    //}
    /// <summary>
    /// 設定を書き込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定の値</param>
    /// <param name="doc">XMLのドキュメント</param>
    TLSettings.prototype.set_setting_string = function (section, key, val, doc) {
        try {
            var conf = doc.documentElement;
            if (conf == null) {
                conf = doc.createElement("configuration");
                doc.appendChild(conf);
            }
            this.get_section(section, conf, doc, true).setAttribute(key, val);
        }
        catch (Exception) {
        }
    };
    /// <summary>
    /// 設定を書き込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定の値</param>
    /// <param name="doc">XMLのドキュメント</param>
    TLSettings.prototype.set_setting_integer = function (section, key, val, doc) {
        try {
            this.set_setting_string(section, key, String(val), doc);
        }
        catch (Exception) {
        }
    };
    /// <summary>
    /// 設定を書き込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定の値</param>
    /// <param name="doc">XMLのドキュメント</param>
    TLSettings.prototype.set_setting_bool = function (section, key, val, doc) {
        try {
            if (val) {
                this.set_setting_string(section, key, "t", doc);
            }
            else {
                this.set_setting_string(section, key, "f", doc);
            }
        }
        catch (Exception) {
        }
    };
    /// <summary>
    /// 設定を書き込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定の値</param>
    /// <param name="doc">XMLのドキュメント</param>
    TLSettings.prototype.set_setting_real = function (section, key, val, doc) {
        try {
            this.set_setting_string(section, key, String(val), doc);
        }
        catch (Exception) {
        }
    };
    /// <summary>
    /// 設定を書き込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定の値</param>
    /// <param name="doc">XMLのドキュメント</param>
    //private set_setting_encoding(section: string, key: string, val: Encoding, doc: Document): void {
    //    try {
    //        var sEncoding: string = "Default";
    //        if (val == Encoding.Default) {
    //            sEncoding = "Default";
    //        }
    //        else if (val == Encoding.Unicode) {
    //            sEncoding = "Unicode";
    //        }
    //        else if (val == Encoding.UTF7) {
    //            sEncoding = "UTF7";
    //        }
    //        else if (val == Encoding.UTF8) {
    //            sEncoding = "UTF8";
    //        }
    //        else if (val == Encoding.UTF32) {
    //            sEncoding = "UTF32";
    //        }
    //        this.set_setting_string(section, key, sEncoding, doc);
    //    }
    //    catch (Exception) {
    //    }
    //}
    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="path">設定ファイルのパス</param>
    TLSettings.prototype.load_settings_ = function (path) {
        try {
            // ブラウザ側で使う
            var request = new XMLHttpRequest();
            request.open("GET", path, false);
            request.send(null);
            var doc = request.responseXML.documentElement;
            this.Left = this.get_setting_integer("window", "left", this.Left, doc);
            this.Top = this.get_setting_integer("window", "top", this.Top, doc);
            this.Width = this.get_setting_integer("window", "width", this.Width, doc);
            this.Height = this.get_setting_integer("window", "height", this.Height, doc);
            this.VerticalSplitter = this.get_setting_integer("window", "verticalsplitter", this.VerticalSplitter, doc);
            this.XMLFileName = this.get_setting_string("file", "xml", this.XMLFileName, doc);
            this.OPMLFileName = this.get_setting_string("file", "opml", this.OPMLFileName, doc);
            this.TextFileName = this.get_setting_string("file", "text", this.TextFileName, doc);
            //this.Encoding = this.get_setting_encoding("text", "encoding", this.Encoding, doc);
            this.LineEnd = this.get_setting_string("text", "lineend", this.LineEnd, doc);
            this.IndentHeader = this.get_setting_string("text", "indent", this.IndentHeader, doc);
            for (var i = 0; i < this.MarkList.length; i++) {
                this.MarkList[i] = this.get_setting_string("text", "h" + String(i), this.MarkList[i], doc);
            }
            for (var i = this.MarkList.length;; i++) {
                var h = this.get_setting_string("text", "h" + String(i), "", doc);
                if (h == "") {
                    break;
                }
                this.MarkList.push(h);
            }
        }
        catch (Exception) {
        }
    };
    /// <summary>
    /// 設定を読み込む
    /// </summary>
    TLSettings.prototype.load_settings = function () {
        this.load_settings_(this.settings_file_name);
    };
    //private string file_path;
    /// <summary>
    /// 設定を保存する
    /// </summary>
    /// <param name="path">設定ファイルのパス</param>
    TLSettings.prototype.save_settings_ = function (path) {
        try {
            var doc = new Document();
            this.set_setting_integer("window", "left", this.Left, doc);
            this.set_setting_integer("window", "top", this.Top, doc);
            this.set_setting_integer("window", "width", this.Width, doc);
            this.set_setting_integer("window", "height", this.Height, doc);
            this.set_setting_integer("window", "verticalsplitter", this.VerticalSplitter, doc);
            this.set_setting_string("file", "xml", this.XMLFileName, doc);
            this.set_setting_string("file", "opml", this.OPMLFileName, doc);
            this.set_setting_string("file", "text", this.TextFileName, doc);
            //this.set_setting_encoding("text", "encoding", this.Encoding, doc);
            this.set_setting_string("text", "lineend", this.LineEnd, doc);
            this.set_setting_string("text", "indent", this.IndentHeader, doc);
            for (var i = 0; i < this.MarkList.length; i++) {
                this.set_setting_string("text", "h" + String(i), this.MarkList[i], doc);
            }
        }
        catch (Exception) {
        }
    };
    /// <summary>
    /// 設定を保存する
    /// </summary>
    TLSettings.prototype.save_settings = function () {
        this.save_settings_(this.settings_file_name);
    };
    return TLSettings;
}());
//# sourceMappingURL=TLSettings.js.map