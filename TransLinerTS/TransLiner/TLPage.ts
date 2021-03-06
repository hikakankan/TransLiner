﻿class TLPageCollection {
    public Collection: Array<TLPage>;
    public constructor() {
        this.Collection = new Array<TLPage>();
    }
    public get Count(): number {
        return this.Collection.length;
    }
    public Last(): TLPage {
        return this.Collection[this.Collection.length - 1];
    }
    public RemoveAt(index: number): void {
        this.Collection.splice(index, 1);
    }
    public Insert(index: number, page: TLPage): void {
        this.Collection.splice(index, 0, page);
    }
    public Add(page: TLPage): void {
        this.Collection.push(page);
    }
    public Clear(): void {
        this.Collection = new Array<TLPage>();
    }
}

class TLPage {
    public constructor(title: string, text: string, root: TLRootPage, private NoTitle: boolean) {
        this.title = title;
        this.text = text;
        this.root = root;
        this.SubPages = new TLPageCollection();
    }

    protected root: TLRootPage;

    public SubPages: TLPageCollection;

    public UnselectAll(): void {
        this.IsSelected = false;
        for (var i: number = 0; i < this.SubPages.Count; i++) {
            this.SubPages.Collection[i].UnselectAll();
        }
    }

    private title_length = 40;

    private getLine(text: string): string {
        var r: number = text.indexOf('\r');
        var n: number = text.indexOf('\n');
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
    }

    private title = "";

    private getTitle(text: string): string {
        if (this.NoTitle) {
            var line: string = this.getLine(text);
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
    }

    public get Title(): string {
        var title: string = this.getTitle(this.text);
        if (title == "") {
            return "タイトルなし";
        }
        else {
            return title;
        }
    }

    public set Title(title: string) {
        if (!this.NoTitle) {
            this.title = title;
        }
    }

    private text: string = "";

    public get Text(): string {
        return this.text;
    }

    public set Text(value: string) {
        this.text = value;
    }

    private isSelected: boolean = false;
    private isExpanded: boolean = false;

    public get IsSelected(): boolean {
        return this.isSelected;
    }

    public set IsSelected(value: boolean) {
        this.isSelected = value;
    }

    public get IsExpanded(): boolean {
        return this.isExpanded;
    }

    public set IsExpanded(value: boolean) {
        this.isExpanded = value;
    }

    public get SelectedPage(): TLPage {
        if (this.IsSelected) {
            return this;
        }
        else {
            for (var page of this.SubPages.Collection) {
                var selectedPage: TLPage = page.SelectedPage;
                if (selectedPage != null) {
                    return selectedPage;
                }
            }
        }
        return null;
    }

    private validIndex(index: number, count: number): boolean;
    private validIndex(index: number): boolean;

    private validIndex(index: number, count?: number): boolean {
        if (count != null) {
            return index >= 0 && index < count;
        }
        else {
            return index >= 0;
        }
    }

    public MoveLeft(parent: TLPage, myIndex: number, parentparent: TLPage, parentIndex: number, dest: number): boolean {
        if (this.IsSelected) {
            if (this.validIndex(myIndex) && this.validIndex(parentIndex)) {
                parent.SubPages.RemoveAt(myIndex);
                parentparent.SubPages.Insert(parentIndex + dest, this);
                return true;
            }
        }
        else {
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.MoveLeft(this, i, parent, myIndex, dest)) {
                    return true;
                }
            }
        }
        return false;
    }

    public MoveRight(parent: TLPage, myIndex: number, destBefore: number, destAfter: number, destTop: boolean): boolean {
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
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.MoveRight(this, i, destBefore, destAfter, destTop)) {
                    return true;
                }
            }
        }
        return false;
    }

    public Move(parent: TLPage, myIndex: number, dest: number): boolean {
        if (this.IsSelected) {
            if (this.validIndex(myIndex) && this.validIndex(myIndex + dest, parent.SubPages.Count)) {
                parent.SubPages.RemoveAt(myIndex);
                parent.SubPages.Insert(myIndex + dest, this);
                return true;
            }
        }
        else {
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.Move(this, i, dest)) {
                    return true;
                }
            }
        }
        return false;
    }

    public SelectedMove(parent: TLPage, myIndex: number, dest: number): boolean {
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
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.SelectedMove(this, i, dest)) {
                    return true;
                }
            }
        }
        return false;
    }

    public SelectLastExpandedItem(): void {
        if (this.IsExpanded && this.SubPages.Count > 0) {
            this.SubPages.Last().SelectLastExpandedItem();
        }
        else {
            this.IsSelected = true;
        }
    }

    public SelectedDownOver(parent: TLPage, myIndex: number): boolean {
        var dest: number = 1;
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
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.SelectedDownOver(this, i)) {
                    return true;
                }
            }
        }
        return false;
    }

    public ExpandedChange(parent: TLPage, myIndex: number, expanded: boolean): boolean {
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
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.ExpandedChange(this, i, expanded)) {
                    return true;
                }
            }
        }
        return false;
    }

    public Create(parent: TLPage, myIndex: number, dest: number): boolean {
        if (this.IsSelected) {
            if (this.validIndex(myIndex)) {
                var page: TLPage = new TLPage("", "", this.root, this.NoTitle);
                parent.SubPages.Insert(myIndex + dest, page);
                page.IsSelected = true;
                return true;
            }
        }
        else {
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.Create(this, i, dest)) {
                    return true;
                }
            }
        }
        return false;
    }

    public CreateRight(parent: TLPage, myIndex: number, destTop: boolean): boolean {
        if (this.IsSelected) {
            if (this.validIndex(myIndex)) {
                var page: TLPage = new TLPage("", "", this.root, this.NoTitle);
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
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.CreateRight(this, i, destTop)) {
                    return true;
                }
            }
        }
        return false;
    }

    public Delete(parent: TLPage, myIndex: number): boolean {
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
                        //parent.IsSelected = true;
                    }
                }
                return true;
            }
        }
        else {
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.Delete(this, i)) {
                    return true;
                }
            }
        }
        return false;
    }

    public Clone(): TLPage {
        var page: TLPage = new TLPage(this.Title, this.Text, this.root, this.NoTitle);
        for (var i: number = 0; i < this.SubPages.Count; i++) {
            var subpage: TLPage = this.SubPages.Collection[i].Clone();
            page.SubPages.Add(subpage);
        }
        return page;
    }

    public Duplicate(parent: TLPage, myIndex: number, dest: number): boolean {
        if (this.IsSelected) {
            if (this.validIndex(myIndex)) {
                var page: TLPage = this.Clone();
                parent.SubPages.Insert(myIndex + dest, page);
                page.IsSelected = true;
                return true;
            }
        }
        else {
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.Duplicate(this, i, dest)) {
                    return true;
                }
            }
        }
        return false;
    }

    public DuplicateRight(parent: TLPage, myIndex: number, destTop: boolean): boolean {
        if (this.IsSelected) {
            if (this.validIndex(myIndex)) {
                var page: TLPage = this.Clone();
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
            for (var i: number = 0; i < this.SubPages.Count; i++) {
                var subpage: TLPage = this.SubPages.Collection[i];
                if (subpage.DuplicateRight(this, i, destTop)) {
                    return true;
                }
            }
        }
        return false;
    }

    //private XmlElement create_text(XmlDocument doc, string name, string text)
    //{
    //    XmlElement element = doc.CreateElement(name);
    //    XmlText content = doc.CreateTextNode(text);
    //    element.AppendChild(content);
    //    return element;
    //}

    //public XmlElement ToXml(XmlDocument doc)
    //{
    //    XmlElement page = doc.CreateElement("page");
    //    page.AppendChild(create_text(doc, "title", Title));
    //    page.AppendChild(create_text(doc, "text", text));
    //    XmlElement subpages = doc.CreateElement("subpages");
    //    page.AppendChild(subpages);
    //    foreach(TLPage p in SubPages)
    //    {
    //        subpages.AppendChild(p.ToXml(doc));
    //    }
    //    return page;
    //}

    private find_element(parent: Element, name: string): Element {
        if (parent.hasChildNodes) {
            var children: NodeListOf<Element> = parent.getElementsByTagName(name);
            if (children.length > 0) {
                return children[0];
            }
        }
        return null;
    }

    private get_text(parent: Element, name: string): string {
        var element = this.find_element(parent, name);
        return element.textContent;
    }

    public FromXml(element: Element): void {
        this.Text = this.get_text(element, "text");
        var subpages: Element = this.find_element(element, "subpages");
        for (var i = 0; i < subpages.childNodes.length; i++) {
            var child: Node = subpages.childNodes[i];
            if (child.nodeType == Node.ELEMENT_NODE) {
                var page: TLPage = new TLPage("", "", this.root, this.NoTitle);
                page.FromXml(<Element>child);
                this.SubPages.Add(page);
            }
        }
    }

    //public void Load(string path)
    //{
    //    XmlDocument doc = new XmlDocument();
    //    if (File.Exists(path)) {
    //        doc.Load(path);
    //        FromXml((XmlElement)doc.FirstChild);
    //    }
    //}

    //public void Save(string path)
    //{
    //    XmlDocument doc = new XmlDocument();
    //    XmlElement element = ToXml(doc);
    //    doc.AppendChild(element);
    //    doc.Save(path);
    //}

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

    protected StartsWith(str: string, header: string): boolean {
        return str.length >= header.length && str.substr(0, header.length) == header;
    }

    private splitSections(sections: string[], header: string): string[][] {
        var result: Array<string[]> = new Array<string[]>();
        var chapter: string[] = null;
        for (var section of sections) {
            if (this.StartsWith(section, header)) {
                if (chapter == null) {
                    chapter = new Array<string>();
                }
                chapter.push(section.substring(1));
            }
            else {
                if (chapter != null) {
                    result.push(chapter);
                }
                chapter = new Array<string>();
                chapter.push(section);
            }
        }
        if (chapter != null) {
            result.push(chapter);
        }
        return result;
    }

    public FromText(sections: string[], header: string): void {
        if (sections.length > 0) {
            this.Text = sections[0];
            var sections2 = sections.slice();
            sections2.shift();
            for (var chapter of this.splitSections(sections2, header)) {
                var page: TLPage = new TLPage("", "", this.root, this.NoTitle);
                page.FromText(chapter, header);
                this.SubPages.Add(page);
            }
        }
    }

    ///// <summary>
    ///// MIFES形式のテキストに変換
    ///// </summary>
    ///// <param name="headers"></param>
    ///// <returns></returns>
    //public string ToText(IEnumerable < string > headers, IEnumerable < string > defaultHeaders)
    //{
    //    if (headers.Count() == 0) {
    //        headers = defaultHeaders;
    //    }
    //    string text = headers.ElementAt(0) + Text;
    //    if (!Regex.IsMatch(text, @"\r\n$") )
    //    {
    //        text += "\r\n";
    //    }
    //    foreach(TLPage page in SubPages)
    //    {
    //        text += page.ToText(headers.Skip(1), defaultHeaders);
    //    }
    //    return text;
    //}

    ///// <summary>
    ///// MIFES形式のテキストを読み込む
    ///// </summary>
    ///// <param name="text"></param>
    ///// <param name="headers"></param>
    //public void FromText(string text, IEnumerable < string > headers)
    //{
    //    if (headers.Count() == 0) {
    //        Text = text;
    //    }
    //    else {
    //        string[] sections = text.Split(new string[] { "\r\n" + headers.ElementAt(0) }, StringSplitOptions.None);
    //        if (sections.Count() > 0) {
    //            Text = sections[0];
    //            foreach(string section in sections.Skip(1))
    //            {
    //                TLPage page = new TLPage("", root);
    //                page.FromText(section, headers.Skip(1));
    //            }
    //        }
    //    }
    //}
}
