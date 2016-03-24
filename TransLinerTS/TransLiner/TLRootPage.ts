//<server>var TLPage = require("./TLPageServer.js"); // サーバー用

class TLRootPage extends TLPage {
    public constructor(title: string, text: string, settings: TLPageSettings) {
        super(title, text, null, settings);
        this.root = this;
    }

    public get SelectedPage(): TLPage {
        return this.SelectedPage_;
    }

    public set SelectedPage(page: TLPage) {
        this.UnselectAll();
        page.IsSelected = true;
    }

    public get SelectedText(): string {
        var selectedPage: TLPage = this.SelectedPage;
        if (selectedPage != null) {
            return selectedPage.Text;
        }
        return "";
    }

    public set SelectedText(value: string) {
        var selectedPage: TLPage = this.SelectedPage;
        if (selectedPage != null) {
            selectedPage.Text = value;
        }
    }

    private serverSide = false; // ブラウザ側で実行する //<browser> ブラウザ用
    //<server>var serverSide = true; // サーバー側で実行する

    private execCommand(command: string, actual_proc: () => boolean): boolean {
        if (this.Settings.NoServer || this.serverSide) {
            // サーバーを使わないか、サーバー側のときは実際に動作する処理を行う
            return actual_proc();
        } else {
            // サーバーを使うときのブラウザ側の処理 コマンドを送信
            this.setPath("0");
            var path: string = this.SelectedPage.getPagePath();
            var request = new XMLHttpRequest();
            request.open("GET", "tlcom.command?name=" + command + "&path=" + path, false);
            request.send(null);
            return request.responseText == "true" && actual_proc(); // ブラウザ側のツリーも更新
        }
    }

    private receiveCommand(command: string): boolean {
        // コマンドを受け取ったサーバー側の処理
        if (command == "MoveLeftUp") {
            return this.MoveLeftUp_();
        } else if (command == "MoveLeftDown") {
            return this.MoveLeftDown_();
        } else if (command == "MoveUpRightTop") {
            return this.MoveUpRightTop_();
        } else if (command == "MoveUpRightBottom") {
            return this.MoveUpRightBottom_();
        } else if (command == "MoveDownRightTop") {
            return this.MoveDownRightTop_();
        } else if (command == "MoveDownRightBottom") {
            return this.MoveDownRightBottom_();
        } else if (command == "MoveUp") {
            return this.MoveUp_();
        } else if (command == "MoveDown") {
            return this.MoveDown_();
        } else if (command == "CreateUp") {
            return this.CreateUp_();
        } else if (command == "CreateDown") {
            return this.CreateDown_();
        } else if (command == "CreateRightTop") {
            return this.CreateRightTop_();
        } else if (command == "CreateRightBottom") {
            return this.CreateRightBottom_();
        } else if (command == "DuplicateUp") {
            return this.DuplicateUp_();
        } else if (command == "DuplicateDown") {
            return this.DuplicateDown_();
        } else if (command == "DuplicateRightTop") {
            return this.DuplicateRightTop_();
        } else if (command == "DuplicateRightBottom") {
            return this.DuplicateRightBottom_();
        } else if (command == "DeleteSelectedItem") {
            return this.DeleteSelectedItem_();
        } else if (command == "Expand") {
            return this.Expand_();
        } else if (command == "Unexpand") {
            return this.Unexpand_();
        }
        return false;
    }

    public MoveLeftUp_(): boolean {
        return this.MoveLeft(null, -1, null, -1, 0);
    }

    public MoveLeftUp(): boolean {
        return this.execCommand("MoveLeftUp", () => this.MoveLeftUp_());
    }

    public MoveLeftDown_(): boolean {
        return this.MoveLeft(null, -1, null, -1, 1);
    }

    public MoveLeftDown(): boolean {
        return this.execCommand("MoveLeftDown", () => this.MoveLeftDown_());
    }

    private MoveUpRightTop_(): boolean {
        return this.MoveRight(null, -1, -1, -1, true);
    }

    private MoveUpRightTop(): boolean {
        return this.execCommand("MoveUpRightTop", () => this.MoveUpRightTop_());
    }

    public MoveUpRightBottom_(): boolean {
        return this.MoveRight(null, -1, -1, -1, false);
    }

    public MoveUpRightBottom(): boolean {
        return this.execCommand("MoveUpRightBottom", () => this.MoveUpRightBottom_());
    }

    public MoveDownRightTop_(): boolean {
        return this.MoveRight(null, -1, 1, 0, true);
    }

    public MoveDownRightTop(): boolean {
        return this.execCommand("MoveDownRightTop", () => this.MoveDownRightTop_());
    }

    private MoveDownRightBottom_(): boolean {
        return this.MoveRight(null, -1, 1, 0, false);
    }

    private MoveDownRightBottom(): boolean {
        return this.execCommand("MoveDownRightBottom", () => this.MoveDownRightBottom_());
    }

    public MoveUp_(): boolean {
        return this.Move(null, -1, -1) || this.MoveLeftUp_();
    }

    public MoveUp(): boolean {
        return this.execCommand("MoveUp", () => this.MoveUp_());
    }

    public MoveDown_(): boolean {
        return this.Move(null, -1, 1) || this.MoveLeftDown_();
    }

    public MoveDown(): boolean {
        return this.execCommand("MoveDown", () => this.MoveDown_());
    }

    public CreateUp_(): boolean {
        return this.Create(null, -1, 0);
    }

    public CreateUp(): boolean {
        return this.execCommand("CreateUp", () => this.CreateUp_());
    }

    public CreateDown_(): boolean {
        return this.Create(null, -1, 1);
    }

    public CreateDown(): boolean {
        return this.execCommand("CreateDown", () => this.CreateDown_());
    }

    public CreateRightTop_(): boolean {
        return this.CreateRight(null, -1, true);
    }

    public CreateRightTop(): boolean {
        return this.execCommand("CreateRightTop", () => this.CreateRightTop_());
    }

    public CreateRightBottom_(): boolean {
        return this.CreateRight(null, -1, false);
    }

    public CreateRightBottom(): boolean {
        return this.execCommand("CreateRightBottom", () => this.CreateRightBottom_());
    }

    public DuplicateUp_(): boolean {
        return this.Duplicate(null, -1, 0);
    }

    public DuplicateUp(): boolean {
        return this.execCommand("DuplicateUp", () => this.DuplicateUp_());
    }

    public DuplicateDown_(): boolean {
        return this.Duplicate(null, -1, 1);
    }

    public DuplicateDown(): boolean {
        return this.execCommand("DuplicateDown", () => this.DuplicateDown_());
    }

    private DuplicateRightTop_(): boolean {
        return this.DuplicateRight(null, -1, true);
    }

    private DuplicateRightTop(): boolean {
        return this.execCommand("DuplicateRightTop", () => this.DuplicateRightTop_());
    }

    private DuplicateRightBottom_(): boolean {
        return this.DuplicateRight(null, -1, false);
    }

    private DuplicateRightBottom(): boolean {
        return this.execCommand("DuplicateRightBottom", () => this.DuplicateRightBottom_());
    }

    public DeleteSelectedItem_(): boolean {
        return this.Delete(null, -1);
    }

    public DeleteSelectedItem(): boolean {
        return this.execCommand("DeleteSelectedItem", () => this.DeleteSelectedItem_());
    }

    private SelectedUp(): boolean {
        return this.SelectedMove(null, -1, -1);
    }

    private SelectedDown(): boolean {
        return this.SelectedMove(null, -1, 1);
    }

    public Expand_(): boolean {
        return this.ExpandedChange(null, -1, true);
    }

    public Expand(): boolean {
        //return this.execCommand("Expand", this.Expand_);
        return this.Expand_();
    }

    public Unexpand_(): boolean {
        return this.ExpandedChange(null, -1, false);
    }

    public Unexpand(): boolean {
        //return this.execCommand("Unexpand", this.Unexpand_);
        return this.Unexpand_();
    }

    public loadXML(xml: Element): void {
        this.IsExpanded = false;
        this.SubPages.Clear();
        this.FromXml(xml);
    }

    public loadJSON(obj: any): void {
        this.IsExpanded = false;
        this.SubPages.Clear();
        this.FromJSON(obj);
    }

    public loadText(text: string, path: string): void {
        this.IsExpanded = false;
        this.SubPages.Clear();
        this.FromText2(text, ".", path);
    }

    private GetFileNameWithoutExtension(path: string): string {
        var index_sep = path.lastIndexOf("\\");
        if (index_sep >= 0) {
            path = path.substring(index_sep + 1);
        }
        var index_ext = path.lastIndexOf(".");
        if (index_ext >= 0) {
            path = path.substring(0, index_ext);
        }
        return path;
    }

    private makeSections(text: string, header: string, path: string): string[] {
        var result: string[] = new Array<string>();
        var sections: string[] = text.split("\r\n" + header);
        var first: boolean = true;
        for (var section of sections) {
            if (first && section.length > 0) {
                if (this.StartsWith(section, header)) {
                    result.push(this.GetFileNameWithoutExtension(path));
                    result.push(section.substring(1));
                }
                else {
                    result.push(section);
                }
            }
            else {
                result.push(section);
            }
            first = false;
        }
        return result;
    }

    /// <summary>
    /// WZ形式のテキストを読み込む
    /// </summary>
    /// <param name="text"></param>
    /// <param name="header"></param>
    /// <param name="path">ファイルのパス。ルートのテキストがないときファイル名をテキストにする。</param>
    public FromText2(text: string, header: string, path: string): void {
        this.FromText(this.makeSections(text, header, path), header);
    }

    //private void load(string path, Action < string > setPath, Action < string > loader, string filter)
    //{
    //    try {
    //        OpenFileDialog openFileDialog1 = new OpenFileDialog();
    //        openFileDialog1.Filter = filter;
    //        openFileDialog1.FilterIndex = 1;
    //        if (path == "") {
    //            openFileDialog1.FileName = "";
    //            openFileDialog1.InitialDirectory = Environment.CurrentDirectory;
    //        }
    //        else {
    //            openFileDialog1.FileName = Path.GetFileName(path);
    //            openFileDialog1.InitialDirectory = Path.GetDirectoryName(path);
    //        }
    //        openFileDialog1.RestoreDirectory = true;
    //        if (openFileDialog1.ShowDialog() == true) {
    //            path = openFileDialog1.FileName;
    //            setPath(path);
    //            loader(path);
    //        }
    //    }
    //    catch (Exception) {
    //        System.Windows.MessageBox.Show("読み込めませんでした");
    //    }
    //}

    //private void loadSel(string path, Action < string > setPath, Action < TLPage, string > loader, string filter)
    //{
    //    Action < string > loader_ = delegate(string path_)
    //    {
    //        TLPage page = new TLPage("", this);
    //        loader(page, path_);
    //        SelectedPage.SubPages.Add(page);
    //    };
    //    load(path, setPath, loader_, filter);
    //}

    //private void loadAll(string path, Action < string > setPath, Action < string > loader, string filter)
    //{
    //    Action < string > loader_ = delegate(string path_)
    //    {
    //        SubPages.Clear();
    //        loader(path_);
    //    };
    //    load(path, setPath, loader_, filter);
    //}

    //private void loadXMLSel()
    //{
    //    string filter = "XMLファイル (*.xml)|*.xml|すべてのファイル (*.*)|*.*";
    //    loadSel(settings.XMLFileName, path => settings.XMLFileName = path, (page, path) => page.Load(path), filter);
    //}

    //private void loadXMLAll()
    //{
    //    string filter = "XMLファイル (*.xml)|*.xml|すべてのファイル (*.*)|*.*";
    //    loadAll(settings.XMLFileName, path => settings.XMLFileName = path, path => Load(path), filter);
    //}

    //private void loadOPMLSel()
    //{
    //    string filter = "OPMLファイル (*.opml)|*.opml|すべてのファイル (*.*)|*.*";
    //    loadSel(settings.OPMLFileName, path => settings.OPMLFileName = path, (page, path) => page.LoadOPML(path), filter);
    //}

    //private void loadOPMLAll()
    //{
    //    string filter = "OPMLファイル (*.opml)|*.opml|すべてのファイル (*.*)|*.*";
    //    loadAll(settings.OPMLFileName, path => settings.OPMLFileName = path, path => LoadOPML(path), filter);
    //}

    //private void loadTextSel()
    //{
    //    Action < TLPage, string > readText = delegate(TLPage page, string path)
    //    {
    //        StreamReader sr = new StreamReader(path);
    //        string text = sr.ReadToEnd();
    //        sr.Close();
    //        page.FromText(text, settings.IndentHeader);
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    loadSel(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
    //}

    //private void loadTextAll()
    //{
    //    Action < string > readText = delegate(string path)
    //    {
    //        StreamReader sr = new StreamReader(path);
    //        string text = sr.ReadToEnd();
    //        sr.Close();
    //        FromText(text, settings.IndentHeader);
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    loadAll(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
    //}

    //private void loadTextSel(Encoding encoding)
    //{
    //    Action < TLPage, string > readText = delegate(TLPage page, string path)
    //    {
    //        StreamReader sr = new StreamReader(path, encoding);
    //        string text = sr.ReadToEnd();
    //        sr.Close();
    //        page.FromText(text, settings.IndentHeader);
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    loadSel(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
    //}

    //private void loadTextAll(Encoding encoding)
    //{
    //    Action < string > readText = delegate(string path)
    //    {
    //        StreamReader sr = new StreamReader(path, encoding);
    //        string text = sr.ReadToEnd();
    //        sr.Close();
    //        FromText(text, settings.IndentHeader);
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    loadAll(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
    //}

    //private void loadMarkUpTextSel()
    //{
    //    Action < TLPage, string > readText = delegate(TLPage page, string path)
    //    {
    //        StreamReader sr = new StreamReader(path);
    //        string text = sr.ReadToEnd();
    //        sr.Close();
    //        page.FromText(text, settings.MarkList);
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    loadSel(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
    //}

    //private void loadMarkUpTextAll()
    //{
    //    Action < string > readText = delegate(string path)
    //    {
    //        StreamReader sr = new StreamReader(path);
    //        string text = sr.ReadToEnd();
    //        sr.Close();
    //        FromText(text, settings.MarkList);
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    loadAll(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
    //}

    //private void save(string path, Action < string > setPath, Action < string > saver, string filter, string ext)
    //{
    //    try {
    //        SaveFileDialog saveFileDialog1 = new SaveFileDialog();
    //        saveFileDialog1.AddExtension = true;
    //        saveFileDialog1.DefaultExt = ext;
    //        saveFileDialog1.OverwritePrompt = true;
    //        saveFileDialog1.Filter = filter;
    //        saveFileDialog1.FilterIndex = 1;
    //        if (path == "") {
    //            saveFileDialog1.FileName = Title;
    //            saveFileDialog1.InitialDirectory = Environment.CurrentDirectory;
    //        }
    //        else {
    //            if (Title == "") {
    //                saveFileDialog1.FileName = Path.GetFileName(path);
    //            }
    //            else {
    //                saveFileDialog1.FileName = Title;
    //            }
    //            saveFileDialog1.InitialDirectory = Path.GetDirectoryName(path);
    //        }
    //        saveFileDialog1.CheckPathExists = true;
    //        saveFileDialog1.RestoreDirectory = true;
    //        if (saveFileDialog1.ShowDialog() == true) {
    //            path = saveFileDialog1.FileName;
    //            setPath(path);
    //            saver(path);
    //        }
    //    }
    //    catch (Exception) {
    //        System.Windows.MessageBox.Show("保存できませんでした");
    //    }
    //}

    //private void saveSel(string path, Action < string > setPath, Action < TLPage, string > saver, string filter, string ext)
    //{
    //    Action < string > saver_ = delegate(string path_)
    //    {
    //        TLPage page = SelectedPage;
    //        saver(page, path_);
    //    };
    //    save(path, setPath, saver_, filter, ext);
    //}

    //private void saveAll(string path, Action < string > setPath, Action < string > saver, string filter, string ext)
    //{
    //    Action < string > saver_ = delegate(string path_)
    //    {
    //        saver(path_);
    //    };
    //    save(path, setPath, saver_, filter, ext);
    //}

    //private void saveXMLSel()
    //{
    //    string filter = "XMLファイル (*.xml)|*.xml|すべてのファイル (*.*)|*.*";
    //    string ext = ".xml";
    //    saveSel(settings.XMLFileName, path => settings.XMLFileName = path, (page, path) => page.Save(path), filter, ext);
    //}

    //private void saveXMLAll()
    //{
    //    string filter = "XMLファイル (*.xml)|*.xml|すべてのファイル (*.*)|*.*";
    //    string ext = ".xml";
    //    saveAll(settings.XMLFileName, path => settings.XMLFileName = path, path => Save(path), filter, ext);
    //}

    //private void saveOPMLSel()
    //{
    //    string filter = "OPMLファイル (*.opml)|*.opml|すべてのファイル (*.*)|*.*";
    //    string ext = ".opml";
    //    saveSel(settings.OPMLFileName, path => settings.OPMLFileName = path, (page, path) => page.SaveOPML(path), filter, ext);
    //}

    //private void saveOPMLAll()
    //{
    //    string filter = "OPMLファイル (*.opml)|*.opml|すべてのファイル (*.*)|*.*";
    //    string ext = ".opml";
    //    saveAll(settings.OPMLFileName, path => settings.OPMLFileName = path, path => SaveOPML(path), filter, ext);
    //}

    //private void saveTextSel()
    //{
    //    Action < TLPage, string > writeText = delegate(TLPage page, string path)
    //    {
    //        string text = page.ToText(settings.IndentHeader);
    //        StreamWriter sw = new StreamWriter(path);
    //        sw.Write(text);
    //        sw.Close();
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    string ext = ".txt";
    //    saveSel(settings.TextFileName, path => settings.TextFileName = path, writeText, filter, ext);
    //}

    //private void saveTextAll()
    //{
    //    Action < string > writeText = delegate(string path)
    //    {
    //        string text = ToText(settings.IndentHeader);
    //        StreamWriter sw = new StreamWriter(path);
    //        sw.Write(text);
    //        sw.Close();
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    string ext = ".txt";
    //    saveAll(settings.TextFileName, path => settings.TextFileName = path, writeText, filter, ext);
    //}

    //private void saveMarkUpTextSel()
    //{
    //    Action < TLPage, string > writeText = delegate(TLPage page, string path)
    //    {
    //        string text = page.ToText(settings.MarkList, settings.MarkListDefault);
    //        StreamWriter sw = new StreamWriter(path);
    //        sw.Write(text);
    //        sw.Close();
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    string ext = ".txt";
    //    saveSel(settings.TextFileName, path => settings.TextFileName = path, writeText, filter, ext);
    //}

    //private void saveMarkUpTextAll()
    //{
    //    Action < string > writeText = delegate(string path)
    //    {
    //        string text = ToText(settings.MarkList, settings.MarkListDefault);
    //        StreamWriter sw = new StreamWriter(path);
    //        sw.Write(text);
    //        sw.Close();
    //    };
    //    string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
    //    string ext = ".txt";
    //    saveAll(settings.TextFileName, path => settings.TextFileName = path, writeText, filter, ext);
    //}

    //private void textSettings()
    //{
    //}

    //private void help()
    //{
    //    try {
    //        //System.Diagnostics.Process.Start(@"http://www2.biglobe.ne.jp/~optimist/software/expcalc21/help/main.html");
    //        //System.Diagnostics.Process.Start(Path.Combine(Environment.CurrentDirectory, help_file));
    //    }
    //    catch (Exception) {
    //    }
    //}

    //private void version()
    //{
    //    //DialogAbout dlg = new DialogAbout();
    //    //if ( dlg.ShowDialog() == true )
    //    //{
    //    //}
    //}

    //public bool EncodingDefault
    //{
    //    get
    //    {
    //        return settings.Encoding == Encoding.Default;
    //    }
    //    set
    //    {
    //        if (value) {
    //            settings.Encoding = Encoding.Default;
    //        }
    //    }
    //}

    //public bool EncodingUnicode
    //{
    //    get
    //    {
    //        return settings.Encoding == Encoding.Unicode;
    //    }
    //    set
    //    {
    //        if (value) {
    //            settings.Encoding = Encoding.Unicode;
    //        }
    //    }
    //}

    //public bool EncodingUTF7
    //{
    //    get
    //    {
    //        return settings.Encoding == Encoding.UTF7;
    //    }
    //    set
    //    {
    //        if (value) {
    //            settings.Encoding = Encoding.UTF7;
    //        }
    //    }
    //}

    //public bool EncodingUTF8
    //{
    //    get
    //    {
    //        return settings.Encoding == Encoding.UTF8;
    //    }
    //    set
    //    {
    //        if (value) {
    //            settings.Encoding = Encoding.UTF8;
    //        }
    //    }
    //}

    //public bool EncodingUTF32
    //{
    //    get
    //    {
    //        return settings.Encoding == Encoding.UTF32;
    //    }
    //    set
    //    {
    //        if (value) {
    //            settings.Encoding = Encoding.UTF32;
    //        }
    //    }
    //}

    //public bool LineEndCR
    //{
    //    get
    //    {
    //        return settings.LineEnd == "\r";
    //    }
    //    set
    //    {
    //        if (value) {
    //            settings.LineEnd = "\r";
    //        }
    //    }
    //}

    //public bool LineEndLF
    //{
    //    get
    //    {
    //        return settings.LineEnd == "\n";
    //    }
    //    set
    //    {
    //        if (value) {
    //            settings.LineEnd = "\n";
    //        }
    //    }
    //}

    //public bool LineEndCRLF
    //{
    //    get
    //    {
    //        return settings.LineEnd == "\r\n";
    //    }
    //    set
    //    {
    //        if (value) {
    //            settings.LineEnd = "\r\n";
    //        }
    //    }
    //}
}

//<server>module.exports = TLRootPage; // サーバー用

