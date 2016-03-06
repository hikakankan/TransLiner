class TLSettings {
    private settings_file_name: string; // 設定ファイル名

    public constructor(settings_file: string ) {
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
    private get_section(section: string, parent: Node, doc: Document, create: boolean): Element {
        if (parent.hasChildNodes) {
            for (var i = 0; i < parent.childNodes.length; i++) {
                var node = parent.childNodes[i];
                if (node.nodeType == Node.ELEMENT_NODE && node.nodeName == section) {
                    return <Element>node;
                }
            }
        }
        if (create) {
            var child: Element = doc.createElement(section);
            parent.appendChild(child);
            return child;
        }
        else {
            return null;
        }
    }

    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">TypeScript版ではこの引数はなし：設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    private get_setting_string_(section: string, key: string, doc: Document): string {
        try {
            var conf: Element = doc.documentElement;
            if (conf != null) {
                var sec: Element = this.get_section(section, conf, doc, false);
                if (sec != null) {
                    var val: string = sec.getAttribute(key);
                    return val;
                }
            }
        }
        catch (Exception) {
        }
        return null;
    }

    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <returns>設定の値</returns>
    private get_setting_string(section: string, key: string, val: string, doc: Document): string {
        try {
            var setting: string = this.get_setting_string_(section, key, doc);
            if (setting != null) {
                return setting;
            }
            return val;
        }
        catch (Exception) {
            return val;
        }
    }

    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <returns>設定の値</returns>
    private get_setting_integer(section: string, key: string, val: number, doc: Document): number {
        try {
            var setting: string = this.get_setting_string_(section, key, doc);
            if (setting != null) {
                return Number(setting);
            }
            return val;
        }
        catch (Exception) {
            return val;
        }
    }

    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <returns>設定の値</returns>
    private get_setting_bool(section: string, key: string, val: boolean, doc: Document): boolean {
        try {
            var setting: string = this.get_setting_string_(section, key, doc);
            if (setting != null) {
                return setting != "f";
            }
            return val;
        }
        catch (Exception) {
            return val;
        }
    }

    /// <summary>
    /// 設定を読み込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定のデフォルトの値</param>
    /// <param name="doc">XMLのドキュメント</param>
    /// <returns>設定の値</returns>
    private get_setting_real(section: string, key: string, val: number, doc: Document): number {
        try {
            var setting: string = this.get_setting_string_(section, key, doc);
            if (setting != null) {
                return Number(setting);
            }
            return val;
        }
        catch (Exception) {
            return val;
        }
    }

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
    private set_setting_string(section: string, key: string, val: string, doc: Document): void {
        try {
            var conf: Element = doc.documentElement;
            if (conf == null) {
                conf = doc.createElement("configuration");
                doc.appendChild(conf);
            }
            this.get_section(section, conf, doc, true).setAttribute(key, val);
        }
        catch (Exception) {
        }
    }

    /// <summary>
    /// 設定を書き込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定の値</param>
    /// <param name="doc">XMLのドキュメント</param>
    private set_setting_integer(section: string, key: string, val: number, doc: Document): void {
        try {
            this.set_setting_string(section, key, String(val), doc);
        }
        catch (Exception) {
        }
    }

    /// <summary>
    /// 設定を書き込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定の値</param>
    /// <param name="doc">XMLのドキュメント</param>
    private set_setting_bool(section: string, key: string, val: boolean, doc: Document): void {
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
    }

    /// <summary>
    /// 設定を書き込む
    /// </summary>
    /// <param name="section">設定のセクション</param>
    /// <param name="key">設定のキー</param>
    /// <param name="val">設定の値</param>
    /// <param name="doc">XMLのドキュメント</param>
    private set_setting_real(section: string, key: string, val: number, doc: Document): void {
        try {
            this.set_setting_string(section, key, String(val), doc);
        }
        catch (Exception) {
        }
    }

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
    public load_settings_(path: string): void {
        try {
            // ブラウザ側で使う
            var request = new XMLHttpRequest();
            request.open("GET", path, false);
            request.send(null);
            var doc: Document = request.responseXML.documentElement;

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
            for (var i = this.MarkList.length; ; i++) {
                var h = this.get_setting_string("text", "h" + String(i), "", doc);
                if (h == "") {
                    break;
                }
                this.MarkList.push(h);
            }
        }
        catch (Exception) {
        }
    }

    /// <summary>
    /// 設定を読み込む
    /// </summary>
    public load_settings(): void {
        this.load_settings_(this.settings_file_name);
    }

        //private string file_path;

    /// <summary>
    /// 設定を保存する
    /// </summary>
    /// <param name="path">設定ファイルのパス</param>
    public save_settings_(path: string): void {
        try {
            var doc: Document = new Document();

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
            for (var i = 0; i < this.MarkList.length; i++ )
            {
                this.set_setting_string("text", "h" + String(i), this.MarkList[i], doc);
            }

            // ブラウザ側では処理できないので処理はなし
        }
        catch (Exception) {
        }
    }

    /// <summary>
    /// 設定を保存する
    /// </summary>
    public save_settings(): void {
        this.save_settings_(this.settings_file_name);
    }

    /// <summary>
    /// ウィンドウの位置(左)
    /// </summary>
    public Left: number = 80;

    /// <summary>
    /// ウィンドウの位置(上)
    /// </summary>
    public Top: number = 80;

    /// <summary>
    /// ウィンドウの幅
    /// </summary>
    public Width: number = 400;

    /// <summary>
    /// ウィンドウの高さ
    /// </summary>
    public Height: number = 300;

    public VerticalSplitter: number = 150;

    public XMLFileName: string = "";
    public OPMLFileName: string = "";
    public TextFileName: string = "";

    public IndentHeader: string = ".";
    public MarkList: string[] = ["+", "-", "*", "#", "$", "%"];
    public MarkListDefault: string[] = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳"];

    //public Encoding: Encoding = Encoding.UTF8;
    public LineEnd: string = "\r\n";
    }
