using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Xml;
using System.IO;
using System.Text.RegularExpressions;

namespace TransLiner
{
    class TLPage : INotifyPropertyChanged
    {
        public TLPage(string text, TLRootPage root)
        {
            this.text = text;
            this.root = root;
            SubPages = new ObservableCollection<TLPage>();
        }

        protected TLRootPage root;

        public event PropertyChangedEventHandler PropertyChanged;

        protected void callPropertyChanged(string name)
        {
            if ( PropertyChanged != null )
            {
                PropertyChanged(this, new PropertyChangedEventArgs(name));
            }
        }

        public ObservableCollection<TLPage> SubPages { get; set; }

        private const int title_length = 40;

        private string getLine(string text)
        {
            int r = text.IndexOf('\r');
            int n = text.IndexOf('\n');
            if ( r >= 0 )
            {
                if ( n >= 0 )
                {
                    return text.Substring(0, Math.Min(r, n));
                }
                else
                {
                    return text.Substring(0, r);
                }
            }
            else
            {
                if ( n >= 0 )
                {
                    return text.Substring(0, n);
                }
                else
                {
                    return text;
                }
            }
        }

        private string getTitle(string text)
        {
            string line = getLine(text);
            if ( line.Length <= title_length )
            {
                return line;
            }
            else
            {
                return line.Substring(0, title_length);
            }
        }

        public string Title
        {
            get
            {
                string title = getTitle(text);
                if ( title == "" )
                {
                    return "タイトルなし";
                }
                else
                {
                    return title;
                }
            }
        }

        private string text = "";

        public string Text
        {
            get
            {
                return text;
            }
            set
            {
                text = value;
                callPropertyChanged(nameof(Text));
                callPropertyChanged(nameof(Title));
            }
        }

        private bool isSelected = false;
        private bool isExpanded = false;

        public bool IsSelected
        {
            get
            {
                return isSelected;
            }
            set
            {
                isSelected = value;
                //System.Diagnostics.Debug.WriteLine("IsSelected Set " + isSelected.ToString());
                callPropertyChanged(nameof(IsSelected));
                callPropertyChanged(nameof(Title));
                root.SelectedTextChanged();
            }
        }

        public bool IsExpanded
        {
            get
            {
                return isExpanded;
            }
            set
            {
                isExpanded = value;
                //System.Diagnostics.Debug.WriteLine("IsExpanded Set " + isExpanded.ToString());
                callPropertyChanged(nameof(IsExpanded));
            }
        }

        public TLPage SelectedPage
        {
            get
            {
                if ( IsSelected )
                {
                    return this;
                }
                else
                {
                    foreach ( TLPage page in SubPages )
                    {
                        TLPage selectedPage = page.SelectedPage;
                        if ( selectedPage != null )
                        {
                            return selectedPage;
                        }
                    }
                }
                return null;
            }
        }

        private bool validIndex(int index, int count)
        {
            return index >= 0 && index < count;
        }

        private bool validIndex(int index)
        {
            return index >= 0;
        }

        public bool MoveLeft(TLPage parent, int myIndex, TLPage parentparent, int parentIndex, int dest)
        {
            if ( IsSelected )
            {
                if ( validIndex(myIndex) && validIndex(parentIndex) )
                {
                    parent.SubPages.RemoveAt(myIndex);
                    parentparent.SubPages.Insert(parentIndex + dest, this);
                    return true;
                }
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.MoveLeft(this, i, parent, myIndex, dest) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool MoveRight(TLPage parent, int myIndex, int destBefore, int destAfter, bool destTop)
        {
            if ( IsSelected )
            {
                if ( validIndex(myIndex) && validIndex(myIndex + destBefore, parent.SubPages.Count) )
                {
                    parent.SubPages.RemoveAt(myIndex);
                    if ( destTop )
                    {
                        parent.SubPages[myIndex + destAfter].SubPages.Insert(0, this);
                    }
                    else
                    {
                        parent.SubPages[myIndex + destAfter].SubPages.Add(this);
                    }
                    if ( !parent.SubPages[myIndex + destAfter].IsExpanded )
                    {
                        parent.SubPages[myIndex + destAfter].IsExpanded = true;
                    }
                    return true;
                }
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.MoveRight(this, i, destBefore, destAfter, destTop) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool Move(TLPage parent, int myIndex, int dest)
        {
            if ( IsSelected )
            {
                if ( validIndex(myIndex) && validIndex(myIndex + dest, parent.SubPages.Count) )
                {
                    parent.SubPages.RemoveAt(myIndex);
                    parent.SubPages.Insert(myIndex + dest, this);
                    return true;
                }
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.Move(this, i, dest) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool SelectedMove(TLPage parent, int myIndex, int dest)
        {
            if ( IsSelected )
            {
                if ( validIndex(myIndex) && myIndex + dest == -1 )
                {
                    // 先頭の項目が選択されている状態でさらに上に移動すると上位に移動
                    parent.IsSelected = true;
                }
                else if ( validIndex(myIndex) && myIndex + dest == parent.SubPages.Count )
                {
                    // 最後尾の項目が選択されている状態でさらに下に移動すると上位の下の項目に移動
                    parent.IsSelected = true;
                    root.SelectedDownOver(null, -1);
                }
                else if ( IsExpanded && dest == 1 )
                {
                    // 項目が開いている状態で下に移動すると下位の先頭に移動
                    if ( SubPages.Count > 0 )
                    {
                        SubPages[0].IsSelected = true;
                    }
                }
                else if ( validIndex(myIndex) && validIndex(myIndex + dest, parent.SubPages.Count) )
                {
                    if ( dest == -1 )
                    {
                        parent.SubPages[myIndex + dest].SelectLastExpandedItem();
                    }
                    else
                    {
                        parent.SubPages[myIndex + dest].IsSelected = true;
                    }
                }
                return true;
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.SelectedMove(this, i, dest) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public void SelectLastExpandedItem()
        {
            if ( IsExpanded && SubPages.Count > 0 )
            {
                SubPages.Last().SelectLastExpandedItem();
            }
            else
            {
                IsSelected = true;
            }
        }

        public bool SelectedDownOver(TLPage parent, int myIndex)
        {
            int dest = 1;
            if ( IsSelected )
            {
                if ( validIndex(myIndex) && myIndex + dest == parent.SubPages.Count )
                {
                    // 最後尾の項目が選択されている状態でさらに下に移動すると上位の下の項目に移動
                    parent.IsSelected = true;
                    root.SelectedDownOver(null, -1);
                }
                else if ( validIndex(myIndex) && validIndex(myIndex + dest, parent.SubPages.Count) )
                {
                    parent.SubPages[myIndex + dest].IsSelected = true;
                }
                return true;
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.SelectedDownOver(this, i) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool ExpandedChange(TLPage parent, int myIndex, bool expanded)
        {
            if ( IsSelected )
            {
                if ( !IsExpanded )
                {
                    if ( !expanded )
                    {
                        // 項目が閉じている状態でさらに閉じようとすると上位に移動
                        if ( validIndex(myIndex) )
                        {
                            parent.IsSelected = true;
                        }
                    }
                    else
                    {
                        IsExpanded = expanded;
                    }
                }
                else
                {
                    if ( !expanded )
                    {
                        IsExpanded = expanded;
                    }
                    else
                    {
                        // 項目が開いている状態でさらに開こうとすると下位の先頭に移動
                        if ( SubPages.Count > 0 )
                        {
                            SubPages[0].IsSelected = true;
                        }
                    }
                }
                return true;
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.ExpandedChange(this, i, expanded) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool Create(TLPage parent, int myIndex, int dest)
        {
            if ( IsSelected )
            {
                if ( validIndex(myIndex) )
                {
                    TLPage page = new TLPage("", root);
                    parent.SubPages.Insert(myIndex + dest, page);
                    page.IsSelected = true;
                    return true;
                }
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.Create(this, i, dest) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool CreateRight(TLPage parent, int myIndex, bool destTop)
        {
            if ( IsSelected )
            {
                if ( validIndex(myIndex) )
                {
                    TLPage page = new TLPage("", root);
                    if ( destTop )
                    {
                        SubPages.Insert(0, page);
                    }
                    else
                    {
                        SubPages.Add(page);
                    }
                    IsExpanded = true;
                    page.IsSelected = true;
                    return true;
                }
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.CreateRight(this, i, destTop) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool Delete(TLPage parent, int myIndex)
        {
            if ( IsSelected )
            {
                if ( validIndex(myIndex) )
                {
                    parent.SubPages.RemoveAt(myIndex);
                    if ( validIndex(myIndex, SubPages.Count) )
                    {
                        parent.SubPages[myIndex].IsSelected = true;
                    }
                    else
                    {
                        if ( validIndex(myIndex - 1) )
                        {
                            parent.SubPages[myIndex - 1].IsSelected = true;
                        }
                        else
                        {
                            //parent.IsSelected = true;
                        }
                    }
                    return true;
                }
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.Delete(this, i) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public TLPage Clone()
        {
            TLPage page = new TLPage(Text, root);
            for ( int i = 0; i < SubPages.Count; i++ )
            {
                TLPage subpage = SubPages[i].Clone();
                page.SubPages.Add(subpage);
            }
            return page;
        }

        public bool Duplicate(TLPage parent, int myIndex, int dest)
        {
            if ( IsSelected )
            {
                if ( validIndex(myIndex) )
                {
                    TLPage page = Clone();
                    parent.SubPages.Insert(myIndex + dest, page);
                    page.IsSelected = true;
                    return true;
                }
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.Duplicate(this, i, dest) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool DuplicateRight(TLPage parent, int myIndex, bool destTop)
        {
            if ( IsSelected )
            {
                if ( validIndex(myIndex) )
                {
                    TLPage page = Clone();
                    if ( destTop )
                    {
                        SubPages.Insert(0, page);
                    }
                    else
                    {
                        SubPages.Add(page);
                    }
                    IsExpanded = true;
                    page.IsSelected = true;
                    return true;
                }
            }
            else
            {
                for ( int i = 0; i < SubPages.Count; i++ )
                {
                    TLPage subpage = SubPages[i];
                    if ( subpage.DuplicateRight(this, i, destTop) )
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        private XmlElement create_text(XmlDocument doc, string name, string text)
        {
            XmlElement element = doc.CreateElement(name);
            XmlText content = doc.CreateTextNode(text);
            element.AppendChild(content);
            return element;
        }

        public XmlElement ToXml(XmlDocument doc)
        {
            XmlElement page = doc.CreateElement("page");
            page.AppendChild(create_text(doc, "title", Title));
            page.AppendChild(create_text(doc, "text", text));
            XmlElement subpages = doc.CreateElement("subpages");
            page.AppendChild(subpages);
            foreach ( TLPage p in SubPages )
            {
                subpages.AppendChild(p.ToXml(doc));
            }
            return page;
        }

        private XmlElement find_element(XmlElement parent, string name)
        {
            if ( parent.HasChildNodes )
            {
                foreach ( XmlNode child in parent.ChildNodes )
                {
                    if ( child is XmlElement && child.Name == name )
                    {
                        return (XmlElement)child;
                    }
                }
            }
            return null;
        }

        private string get_text(XmlElement parent, string name)
        {
            XmlElement element = find_element(parent, name);
            if ( element.HasChildNodes )
            {
                foreach ( XmlNode child in element.ChildNodes )
                {
                    if ( child is XmlText )
                    {
                        return child.InnerText;
                    }
                }
            }
            return "";
        }

        public void FromXml(XmlElement element)
        {
            //Title = get_text(element, "title");
            Text = get_text(element, "text");
            XmlElement subpages = find_element(element, "subpages");
            foreach ( XmlNode child in subpages.ChildNodes )
            {
                if ( child is XmlElement )
                {
                    TLPage page = new TLPage("", root);
                    page.FromXml((XmlElement)child);
                    SubPages.Add(page);
                }
            }
        }

        public void Load(string path)
        {
            XmlDocument doc = new XmlDocument();
            if ( File.Exists(path) )
            {
                doc.Load(path);
                FromXml((XmlElement)doc.FirstChild);
            }
        }

        public void Save(string path)
        {
            XmlDocument doc = new XmlDocument();
            XmlElement element = ToXml(doc);
            doc.AppendChild(element);
            doc.Save(path);
        }

        private string totOpmlText(string text)
        {
            return Regex.Replace(text, "\r\n", "\n");
        }

        public XmlElement ToOpml(XmlDocument doc, string name)
        {
            XmlElement page = doc.CreateElement(name);
            page.SetAttribute("text", Title);
            page.SetAttribute("_note", totOpmlText(text));
            foreach ( TLPage p in SubPages )
            {
                page.AppendChild(p.ToOpml(doc));
            }
            return page;
        }

        public XmlElement ToOpml(XmlDocument doc)
        {
            return ToOpml(doc, "outline");
        }

        private string fromOpmlText(string title, string text)
        {
            string s = Regex.Replace(text, "\n", "\r\n");
            if ( s.StartsWith(title))
            {
                return s;
            }
            else
            {
                return title + "\r\n" + s;
            }
        }

        public void FromOpml(XmlElement element)
        {
            string title = element.GetAttribute("text");
            string text = element.GetAttribute("_note");
            Text = fromOpmlText(title, text);
            foreach ( XmlNode child in element.ChildNodes )
            {
                if ( child is XmlElement )
                {
                    TLPage page = new TLPage("", root);
                    page.FromOpml((XmlElement)child);
                    SubPages.Add(page);
                }
            }
        }

        /// <summary>
        /// Carbonfin Outliner形式のOPMLを読み込む
        /// </summary>
        /// <param name="path"></param>
        public void LoadOPML(string path)
        {
            XmlDocument doc = new XmlDocument();
            if ( File.Exists(path) )
            {
                doc.Load(path);
                FromOpml(find_element(doc.DocumentElement, "body"));
            }
        }

        /// <summary>
        /// Carbonfin Outliner形式のOPMLを保存
        /// </summary>
        /// <param name="path"></param>
        public void SaveOPML(string path)
        {
            XmlDocument doc = new XmlDocument();
            XmlElement root = doc.CreateElement("opml");
            root.SetAttribute("version", "1.0");
            doc.AppendChild(root);
            XmlElement head = doc.CreateElement("head");
            head.AppendChild(create_text(doc, "title", Title));
            root.AppendChild(head);
            XmlElement body = ToOpml(doc, "body");
            root.AppendChild(body);
            doc.Save(path);
        }

        /// <summary>
        /// WZ形式のテキストに変換
        /// </summary>
        /// <param name="header"></param>
        /// <returns></returns>
        public string ToText(string header)
        {
            string text = header + Text;
            if ( !Regex.IsMatch(text, @"\r\n$") )
            {
                text += "\r\n";
            }
            foreach ( TLPage page in SubPages )
            {
                text += page.ToText(header + ".");
            }
            return text;
        }

        private IEnumerable<List<string>> splitSections(IEnumerable<string> sections, string header)
        {
            List<string> chapter = null;
            foreach ( string section in sections )
            {
                if ( section.StartsWith(header) )
                {
                    if ( chapter == null )
                    {
                        chapter = new List<string>();
                    }
                    chapter.Add(section.Substring(1));
                }
                else
                {
                    if ( chapter != null )
                    {
                        yield return chapter;
                    }
                    chapter = new List<string>();
                    chapter.Add(section);
                }
            }
            if ( chapter != null )
            {
                yield return chapter;
            }
        }

        public void FromText(IEnumerable<string> sections, string header)
        {
            if ( sections.Count() > 0 )
            {
                Text = sections.ElementAt(0);
                foreach ( List<string> chapter in splitSections(sections.Skip(1), header) )
                {
                    TLPage page = new TLPage("", root);
                    page.FromText(chapter, header);
                    SubPages.Add(page);
                }
            }
        }

        private IEnumerable<string> makeSections(string text, string header)
        {
            string[] sections = text.Split(new string[] { "\r\n" + header }, StringSplitOptions.None);
            bool first = true;
            foreach ( string section in sections )
            {
                if ( first && section.Length > 0 )
                {
                    yield return section.Substring(1);
                }
                else
                {
                    yield return section;
                }
                first = false;
            }
        }

        /// <summary>
        /// WZ形式のテキストを読み込む
        /// </summary>
        /// <param name="text"></param>
        /// <param name="header"></param>
        public void FromText(string text, string header)
        {
            FromText(makeSections(text, header), header);
        }

        /// <summary>
        /// MIFES形式のテキストに変換
        /// </summary>
        /// <param name="headers"></param>
        /// <returns></returns>
        public string ToText(IEnumerable<string> headers, IEnumerable<string> defaultHeaders)
        {
            if ( headers.Count() == 0 )
            {
                headers = defaultHeaders;
            }
            string text = headers.ElementAt(0) + Text;
            if ( !Regex.IsMatch(text, @"\r\n$") )
            {
                text += "\r\n";
            }
            foreach ( TLPage page in SubPages )
            {
                text += page.ToText(headers.Skip(1), defaultHeaders);
            }
            return text;
        }

        /// <summary>
        /// MIFES形式のテキストを読み込む
        /// </summary>
        /// <param name="text"></param>
        /// <param name="headers"></param>
        public void FromText(string text, IEnumerable<string> headers)
        {
            if ( headers.Count() == 0 )
            {
                Text = text;
            }
            else
            {
                string[] sections = text.Split(new string[] { "\r\n" + headers.ElementAt(0) }, StringSplitOptions.None);
                if ( sections.Count() > 0 )
                {
                    Text = sections[0];
                    foreach ( string section in sections.Skip(1) )
                    {
                        TLPage page = new TLPage("", root);
                        page.FromText(section, headers.Skip(1));
                    }
                }
            }
        }
    }
}
