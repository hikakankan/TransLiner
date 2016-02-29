class TLRootPage extends TLPage {
    public constructor(title: string, text: string, NoTitle: boolean) {
        super(title, text, null, NoTitle);
        this.root = this;
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

    public MoveLeftUp(): boolean {
        return this.MoveLeft(null, -1, null, -1, 0);
    }

    public MoveLeftDown(): boolean {
        return this.MoveLeft(null, -1, null, -1, 1);
    }

    private MoveUpRightTop(): boolean {
        return this.MoveRight(null, -1, -1, -1, true);
    }

    public MoveUpRightBottom(): boolean {
        return this.MoveRight(null, -1, -1, -1, false);
    }

    public MoveDownRightTop(): boolean {
        return this.MoveRight(null, -1, 1, 0, true);
    }

    private MoveDownRightBottom(): boolean {
        return this.MoveRight(null, -1, 1, 0, false);
    }

    public MoveUp(): boolean {
        return this.Move(null, -1, -1) || this.MoveLeftUp();
    }

    public MoveDown(): boolean {
        return this.Move(null, -1, 1) || this.MoveLeftDown();
    }

    public CreateUp(): boolean {
        return this.Create(null, -1, 0);
    }

    public CreateDown(): boolean {
        return this.Create(null, -1, 1);
    }

    public CreateRightTop(): boolean {
        return this.CreateRight(null, -1, true);
    }

    public CreateRightBottom(): boolean {
        return this.CreateRight(null, -1, false);
    }

    public DuplicateUp(): boolean {
        return this.Duplicate(null, -1, 0);
    }

    public DuplicateDown(): boolean {
        return this.Duplicate(null, -1, 1);
    }

    private DuplicateRightTop(): boolean {
        return this.DuplicateRight(null, -1, true);
    }

    private DuplicateRightBottom(): boolean {
        return this.DuplicateRight(null, -1, false);
    }

    public DeleteSelectedItem(): boolean {
        return this.Delete(null, -1);
    }

    private SelectedUp(): boolean {
        return this.SelectedMove(null, -1, -1);
    }

    private SelectedDown(): boolean {
        return this.SelectedMove(null, -1, 1);
    }

    public Expand(): boolean {
        return this.ExpandedChange(null, -1, true);
    }

    public Unexpand(): boolean {
        return this.ExpandedChange(null, -1, false);
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
