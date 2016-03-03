using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.IO;
using Microsoft.Win32;
using System.Windows.Input;

namespace TransLiner
{
    class TLRootPage : TLPage
    {
        public TLRootPage(string text, TLSettings settings, Action closer, Action treeFocus, Action editorFocus) : base(text, null)
        {
            root = this;
            this.settings = settings;
            this.closer = closer;
            this.treeFocus = treeFocus;
            this.editorFocus = editorFocus;
            init_commands();
        }

        private TLSettings settings;
        private Action closer;
        private Action treeFocus;
        private Action editorFocus;

        public string SelectedText
        {
            get
            {
                TLPage selectedPage = SelectedPage;
                if ( selectedPage != null )
                {
                    return selectedPage.Text;
                }
                return "";
            }
            set
            {
                TLPage selectedPage = SelectedPage;
                if ( selectedPage != null )
                {
                    selectedPage.Text = value;
                    callPropertyChanged(nameof(SelectedText));
                }
            }
        }

        public void SelectedTextChanged()
        {
            callPropertyChanged(nameof(SelectedText));
        }

        public TLCommand MoveLeftUp { get; private set; }
        public TLCommand MoveLeftDown { get; private set; }
        public TLCommand MoveUpRightTop { get; private set; }
        public TLCommand MoveUpRightBottom { get; private set; }
        public TLCommand MoveDownRightTop { get; private set; }
        public TLCommand MoveDownRightBottom { get; private set; }
        public TLCommand MoveUp { get; private set; }
        public TLCommand MoveDown { get; private set; }
        public TLCommand CreateUp { get; private set; }
        public TLCommand CreateDown { get; private set; }
        public TLCommand CreateRightTop { get; private set; }
        public TLCommand CreateRightBottom { get; private set; }
        public TLCommand DuplicateUp { get; private set; }
        public TLCommand DuplicateDown { get; private set; }
        public TLCommand DuplicateRightTop { get; private set; }
        public TLCommand DuplicateRightBottom { get; private set; }
        public TLCommand SelectedUp { get; private set; }
        public TLCommand SelectedDown { get; private set; }
        public TLCommand Expand { get; private set; }
        public TLCommand Unexpand { get; private set; }
        public TLCommand DeleteCommand { get; private set; }
        public TLCommand LoadXMLCommand { get; private set; }
        public TLCommand SaveXMLCommand { get; private set; }
        public TLCommand LoadOPMLCommand { get; private set; }
        public TLCommand SaveOPMLCommand { get; private set; }
        public TLCommand LoadTextCommand { get; private set; }
        public TLCommand SaveTextCommand { get; private set; }
        public TLCommand LoadMarkUpTextCommand { get; private set; }
        public TLCommand SaveMarkUpTextCommand { get; private set; }
        public TLCommand LoadXMLSelectionCommand { get; private set; }
        public TLCommand SaveXMLSelectionCommand { get; private set; }
        public TLCommand LoadOPMLSelectionCommand { get; private set; }
        public TLCommand SaveOPMLSelectionCommand { get; private set; }
        public TLCommand LoadTextSelectionCommand { get; private set; }
        public TLCommand SaveTextSelectionCommand { get; private set; }
        public TLCommand LoadMarkUpTextSelectionCommand { get; private set; }
        public TLCommand SaveMarkUpTextSelectionCommand { get; private set; }
        public TLCommand HelpCommand { get; private set; }
        public TLCommand VersionCommand { get; private set; }
        public TLCommand CloseCommand { get; private set; }
        public TLCommand EditorFocus { get; private set; }
        public TLCommand TextSettingsCommand { get; private set; }

        private void init_commands()
        {
            MoveLeftUp = new TLCommand(makeCommand(MoveLeftUpX));
            MoveLeftDown = new TLCommand(makeCommand(MoveLeftDownX));
            MoveUpRightTop = new TLCommand(makeCommand(MoveUpRightTopX));
            MoveUpRightBottom = new TLCommand(makeCommand(MoveUpRightBottomX));
            MoveDownRightTop = new TLCommand(makeCommand(MoveDownRightTopX));
            MoveDownRightBottom = new TLCommand(makeCommand(MoveDownRightBottomX));
            MoveUp = new TLCommand(makeCommand(MoveUpX));
            MoveDown = new TLCommand(makeCommand(MoveDownX));
            CreateUp = new TLCommand(makeCommand(CreateUpX));
            CreateDown = new TLCommand(makeCommand(CreateDownX));
            CreateRightTop = new TLCommand(makeCommand(CreateRightTopX));
            CreateRightBottom = new TLCommand(makeCommand(CreateRightBottomX));
            DuplicateUp = new TLCommand(makeCommand(DuplicateUpX));
            DuplicateDown = new TLCommand(makeCommand(DuplicateDownX));
            DuplicateRightTop = new TLCommand(makeCommand(DuplicateRightTopX));
            DuplicateRightBottom = new TLCommand(makeCommand(DuplicateRightBottomX));
            SelectedUp = new TLCommand(makeCommand(SelectedUpX));
            SelectedDown = new TLCommand(makeCommand(SelectedDownX));
            Expand = new TLCommand(makeCommand(ExpandX));
            Unexpand = new TLCommand(makeCommand(UnexpandX));
            DeleteCommand = new TLCommand(makeCommand(DeleteX));
            LoadXMLCommand = new TLCommand(loadXMLAll);
            SaveXMLCommand = new TLCommand(saveXMLAll);
            LoadOPMLCommand = new TLCommand(loadOPMLAll);
            SaveOPMLCommand = new TLCommand(saveOPMLAll);
            LoadTextCommand = new TLCommand(loadTextAll);
            SaveTextCommand = new TLCommand(saveTextAll);
            LoadMarkUpTextCommand = new TLCommand(loadMarkUpTextAll);
            SaveMarkUpTextCommand = new TLCommand(saveMarkUpTextAll);
            LoadXMLSelectionCommand = new TLCommand(loadXMLSel);
            SaveXMLSelectionCommand = new TLCommand(saveXMLSel);
            LoadOPMLSelectionCommand = new TLCommand(loadOPMLSel);
            SaveOPMLSelectionCommand = new TLCommand(saveOPMLSel);
            LoadTextSelectionCommand = new TLCommand(loadTextSel);
            SaveTextSelectionCommand = new TLCommand(saveTextSel);
            LoadMarkUpTextSelectionCommand = new TLCommand(loadMarkUpTextSel);
            SaveMarkUpTextSelectionCommand = new TLCommand(saveMarkUpTextSel);
            HelpCommand = new TLCommand(help);
            VersionCommand = new TLCommand(version);
            CloseCommand = new TLCommand(closer);
            EditorFocus = new TLCommand(editorFocus);
            TextSettingsCommand = new TLCommand(textSettings);
        }

        private Action makeCommand(Func<bool> pred)
        {
            return delegate ()
            {
                if ( pred() )
                {
                    treeFocus();
                }
            };
        }

        private bool MoveLeftUpX()
        {
            return MoveLeft(null, -1, null, -1, 0);
        }

        private bool MoveLeftDownX()
        {
            return MoveLeft(null, -1, null, -1, 1);
        }

        private bool MoveUpRightTopX()
        {
            return MoveRight(null, -1, -1, -1, true);
        }

        private bool MoveUpRightBottomX()
        {
            return MoveRight(null, -1, -1, -1, false);
        }

        private bool MoveDownRightTopX()
        {
            return MoveRight(null, -1, 1, 0, true);
        }

        private bool MoveDownRightBottomX()
        {
            return MoveRight(null, -1, 1, 0, false);
        }

        private bool MoveUpX()
        {
            System.Diagnostics.Debug.WriteLine("MoveUpX");
            return Move(null, -1, -1) || MoveLeftUpX();
        }

        private bool MoveDownX()
        {
            System.Diagnostics.Debug.WriteLine("MoveDownX");
            return Move(null, -1, 1) || MoveLeftDownX();
        }

        private bool CreateUpX()
        {
            System.Diagnostics.Debug.WriteLine("CreateUpX");
            return Create(null, -1, 0);
        }

        private bool CreateDownX()
        {
            System.Diagnostics.Debug.WriteLine("CreateDownX");
            return Create(null, -1, 1);
        }

        private bool CreateRightTopX()
        {
            return CreateRight(null, -1, true);
        }

        private bool CreateRightBottomX()
        {
            return CreateRight(null, -1, false);
        }

        private bool DuplicateUpX()
        {
            return Duplicate(null, -1, 0);
        }

        private bool DuplicateDownX()
        {
            return Duplicate(null, -1, 1);
        }

        private bool DuplicateRightTopX()
        {
            return DuplicateRight(null, -1, true);
        }

        private bool DuplicateRightBottomX()
        {
            return DuplicateRight(null, -1, false);
        }

        private bool SelectedUpX()
        {
            return SelectedMove(null, -1, -1);
        }

        private bool SelectedDownX()
        {
            return SelectedMove(null, -1, 1);
        }

        private bool ExpandX()
        {
            return ExpandedChange(null, -1, true);
        }

        private bool UnexpandX()
        {
            return ExpandedChange(null, -1, false);
        }

        private bool DeleteX()
        {
            if ( System.Windows.MessageBox.Show("削除しますか？", "削除", System.Windows.MessageBoxButton.OKCancel) == System.Windows.MessageBoxResult.OK )
            {
                return Delete(null, -1);
            }
            return false;
        }

        private void load(string path, Action<string> setPath, Action<string> loader, string filter)
        {
            try
            {
                OpenFileDialog openFileDialog1 = new OpenFileDialog();
                openFileDialog1.Filter = filter;
                openFileDialog1.FilterIndex = 1;
                if ( path == "" )
                {
                    openFileDialog1.FileName = "";
                    openFileDialog1.InitialDirectory = Environment.CurrentDirectory;
                }
                else
                {
                    openFileDialog1.FileName = Path.GetFileName(path);
                    openFileDialog1.InitialDirectory = Path.GetDirectoryName(path);
                }
                openFileDialog1.RestoreDirectory = true;
                if ( openFileDialog1.ShowDialog() == true )
                {
                    path = openFileDialog1.FileName;
                    setPath(path);
                    loader(path);
                }
            }
            catch ( Exception )
            {
                System.Windows.MessageBox.Show("読み込めませんでした");
            }
        }

        private void loadSel(string path, Action<string> setPath, Action<TLPage, string> loader, string filter)
        {
            Action<string> loader_ = delegate (string path_)
            {
                TLPage page = new TLPage("", this);
                loader(page, path_);
                SelectedPage.SubPages.Add(page);
            };
            load(path, setPath, loader_, filter);
        }

        private void loadAll(string path, Action<string> setPath, Action<string> loader, string filter)
        {
            Action<string> loader_ = delegate (string path_)
            {
                SubPages.Clear();
                loader(path_);
            };
            load(path, setPath, loader_, filter);
        }

        private void loadXMLSel()
        {
            string filter = "XMLファイル (*.xml)|*.xml|すべてのファイル (*.*)|*.*";
            loadSel(settings.XMLFileName, path => settings.XMLFileName = path, (page, path) => page.Load(path), filter);
        }

        private void loadXMLAll()
        {
            string filter = "XMLファイル (*.xml)|*.xml|すべてのファイル (*.*)|*.*";
            loadAll(settings.XMLFileName, path => settings.XMLFileName = path, path => Load(path), filter);
        }

        private void loadOPMLSel()
        {
            string filter = "OPMLファイル (*.opml)|*.opml|すべてのファイル (*.*)|*.*";
            loadSel(settings.OPMLFileName, path => settings.OPMLFileName = path, (page, path) => page.LoadOPML(path), filter);
        }

        private void loadOPMLAll()
        {
            string filter = "OPMLファイル (*.opml)|*.opml|すべてのファイル (*.*)|*.*";
            loadAll(settings.OPMLFileName, path => settings.OPMLFileName = path, path => LoadOPML(path), filter);
        }

        private void loadTextSel()
        {
            Action<TLPage, string> readText = delegate (TLPage page, string path)
            {
                StreamReader sr = new StreamReader(path, settings.Encoding);
                string text = sr.ReadToEnd();
                sr.Close();
                page.FromText(text, settings.IndentHeader, path);
            };
            string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
            loadSel(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
        }

        private void loadTextAll()
        {
            Action<string> readText = delegate (string path)
            {
                StreamReader sr = new StreamReader(path, settings.Encoding);
                string text = sr.ReadToEnd();
                sr.Close();
                FromText(text, settings.IndentHeader, path);
            };
            string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
            loadAll(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
        }

        private void loadMarkUpTextSel()
        {
            Action<TLPage, string> readText = delegate (TLPage page, string path)
            {
                StreamReader sr = new StreamReader(path, settings.Encoding);
                string text = sr.ReadToEnd();
                sr.Close();
                page.FromText(text, settings.MarkList);
            };
            string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
            loadSel(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
        }

        private void loadMarkUpTextAll()
        {
            Action<string> readText = delegate (string path)
            {
                StreamReader sr = new StreamReader(path, settings.Encoding);
                string text = sr.ReadToEnd();
                sr.Close();
                FromText(text, settings.MarkList);
            };
            string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
            loadAll(settings.TextFileName, path => settings.TextFileName = path, readText, filter);
        }

        private void save(string path, Action<string> setPath, Action<string> saver, string filter, string ext)
        {
            try
            {
                SaveFileDialog saveFileDialog1 = new SaveFileDialog();
                saveFileDialog1.AddExtension = true;
                saveFileDialog1.DefaultExt = ext;
                saveFileDialog1.OverwritePrompt = true;
                saveFileDialog1.Filter = filter;
                saveFileDialog1.FilterIndex = 1;
                if ( path == "" )
                {
                    saveFileDialog1.FileName = Title;
                    saveFileDialog1.InitialDirectory = Environment.CurrentDirectory;
                }
                else
                {
                    if ( Title == "" )
                    {
                        saveFileDialog1.FileName = Path.GetFileName(path);
                    }
                    else
                    {
                        saveFileDialog1.FileName = Title;
                    }
                    saveFileDialog1.InitialDirectory = Path.GetDirectoryName(path);
                }
                saveFileDialog1.CheckPathExists = true;
                saveFileDialog1.RestoreDirectory = true;
                if ( saveFileDialog1.ShowDialog() == true )
                {
                    path = saveFileDialog1.FileName;
                    setPath(path);
                    saver(path);
                }
            }
            catch ( Exception )
            {
                System.Windows.MessageBox.Show("保存できませんでした");
            }
        }

        private void saveSel(string path, Action<string> setPath, Action<TLPage, string> saver, string filter, string ext)
        {
            Action<string> saver_ = delegate (string path_)
            {
                TLPage page = SelectedPage;
                saver(page, path_);
            };
            save(path, setPath, saver_, filter, ext);
        }

        private void saveAll(string path, Action<string> setPath, Action<string> saver, string filter, string ext)
        {
            Action<string> saver_ = delegate (string path_)
            {
                saver(path_);
            };
            save(path, setPath, saver_, filter, ext);
        }

        private void saveXMLSel()
        {
            string filter = "XMLファイル (*.xml)|*.xml|すべてのファイル (*.*)|*.*";
            string ext = ".xml";
            saveSel(settings.XMLFileName, path => settings.XMLFileName = path, (page, path) => page.Save(path), filter, ext);
        }

        private void saveXMLAll()
        {
            string filter = "XMLファイル (*.xml)|*.xml|すべてのファイル (*.*)|*.*";
            string ext = ".xml";
            saveAll(settings.XMLFileName, path => settings.XMLFileName = path, path => Save(path), filter, ext);
        }

        private void saveOPMLSel()
        {
            string filter = "OPMLファイル (*.opml)|*.opml|すべてのファイル (*.*)|*.*";
            string ext = ".opml";
            saveSel(settings.OPMLFileName, path => settings.OPMLFileName = path, (page, path) => page.SaveOPML(path), filter, ext);
        }

        private void saveOPMLAll()
        {
            string filter = "OPMLファイル (*.opml)|*.opml|すべてのファイル (*.*)|*.*";
            string ext = ".opml";
            saveAll(settings.OPMLFileName, path => settings.OPMLFileName = path, path => SaveOPML(path), filter, ext);
        }

        private void saveTextSel()
        {
            Action<TLPage, string> writeText = delegate (TLPage page, string path)
            {
                string text = page.ToText(settings.IndentHeader);
                StreamWriter sw = new StreamWriter(path, false, settings.Encoding);
                sw.Write(text);
                sw.Close();
            };
            string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
            string ext = ".txt";
            saveSel(settings.TextFileName, path => settings.TextFileName = path, writeText, filter, ext);
        }

        private void saveTextAll()
        {
            Action<string> writeText = delegate (string path)
            {
                string text = ToText(settings.IndentHeader);
                StreamWriter sw = new StreamWriter(path, false, settings.Encoding);
                sw.Write(text);
                sw.Close();
            };
            string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
            string ext = ".txt";
            saveAll(settings.TextFileName, path => settings.TextFileName = path, writeText, filter, ext);
        }

        private void saveMarkUpTextSel()
        {
            Action<TLPage, string> writeText = delegate (TLPage page, string path)
            {
                string text = page.ToText(settings.MarkList, settings.MarkListDefault);
                StreamWriter sw = new StreamWriter(path, false, settings.Encoding);
                sw.Write(text);
                sw.Close();
            };
            string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
            string ext = ".txt";
            saveSel(settings.TextFileName, path => settings.TextFileName = path, writeText, filter, ext);
        }

        private void saveMarkUpTextAll()
        {
            Action<string> writeText = delegate (string path)
            {
                string text = ToText(settings.MarkList, settings.MarkListDefault);
                StreamWriter sw = new StreamWriter(path, false, settings.Encoding);
                sw.Write(text);
                sw.Close();
            };
            string filter = "テキストファイル (*.txt)|*.txt|すべてのファイル (*.*)|*.*";
            string ext = ".txt";
            saveAll(settings.TextFileName, path => settings.TextFileName = path, writeText, filter, ext);
        }

        private void textSettings()
        {
        }

        private void help()
        {
            try
            {
                //System.Diagnostics.Process.Start(@"http://www2.biglobe.ne.jp/~optimist/software/expcalc21/help/main.html");
                //System.Diagnostics.Process.Start(Path.Combine(Environment.CurrentDirectory, help_file));
            }
            catch ( Exception )
            {
            }
        }

        private void version()
        {
            //DialogAbout dlg = new DialogAbout();
            //if ( dlg.ShowDialog() == true )
            //{
            //}
        }

        public bool EncodingDefault
        {
            get
            {
                return settings.Encoding == Encoding.Default;
            }
            set
            {
                if ( value )
                {
                    settings.Encoding = Encoding.Default;
                }
            }
        }

        public bool EncodingUnicode
        {
            get
            {
                return settings.Encoding == Encoding.Unicode;
            }
            set
            {
                if ( value )
                {
                    settings.Encoding = Encoding.Unicode;
                }
            }
        }

        public bool EncodingUTF7
        {
            get
            {
                return settings.Encoding == Encoding.UTF7;
            }
            set
            {
                if ( value )
                {
                    settings.Encoding = Encoding.UTF7;
                }
            }
        }

        public bool EncodingUTF8
        {
            get
            {
                return settings.Encoding == Encoding.UTF8;
            }
            set
            {
                if ( value )
                {
                    settings.Encoding = Encoding.UTF8;
                }
            }
        }

        public bool EncodingUTF32
        {
            get
            {
                return settings.Encoding == Encoding.UTF32;
            }
            set
            {
                if ( value )
                {
                    settings.Encoding = Encoding.UTF32;
                }
            }
        }

        public bool LineEndCR
        {
            get
            {
                return settings.LineEnd == "\r";
            }
            set
            {
                if ( value )
                {
                    settings.LineEnd = "\r";
                }
            }
        }

        public bool LineEndLF
        {
            get
            {
                return settings.LineEnd == "\n";
            }
            set
            {
                if ( value )
                {
                    settings.LineEnd = "\n";
                }
            }
        }

        public bool LineEndCRLF
        {
            get
            {
                return settings.LineEnd == "\r\n";
            }
            set
            {
                if ( value )
                {
                    settings.LineEnd = "\r\n";
                }
            }
        }
    }
}
