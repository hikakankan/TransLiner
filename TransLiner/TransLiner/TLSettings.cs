using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace TransLiner
{
    class TLSettings
    {
        private string settings_file_name; // 設定ファイル名

        public TLSettings(string settings_file)
        {
            settings_file_name = settings_file;
        }

        /// <summary>
        /// XMLのセクションの対応するエレメントを取得する
        /// </summary>
        /// <param name="section">設定のセクション</param>
        /// <param name="parent">エレメントを探す親のノード</param>
        /// <param name="doc">XMLのドキュメント</param>
        /// <param name="create">取得できなかったときは作成する</param>
        /// <returns>セクションに対応するノード</returns>
        private XmlElement get_section(string section, XmlNode parent, XmlDocument doc, bool create)
        {
            if ( parent.HasChildNodes )
            {
                foreach ( XmlNode node in parent.ChildNodes )
                {
                    if ( node.NodeType == XmlNodeType.Element && node.Name == section )
                    {
                        return (XmlElement)node;
                    }
                }
            }
            if ( create )
            {
                XmlElement child = doc.CreateElement(section);
                parent.AppendChild(child);
                return child;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 設定を読み込む
        /// </summary>
        /// <param name="section">設定のセクション</param>
        /// <param name="key">設定のキー</param>
        /// <param name="val">設定のデフォルトの値</param>
        /// <param name="doc">XMLのドキュメント</param>
        private void get_setting_string(string section, string key, ref string val, XmlDocument doc)
        {
            try
            {
                XmlElement conf = doc.DocumentElement;
                if ( conf != null )
                {
                    XmlElement sec = get_section(section, conf, doc, false);
                    if ( sec != null )
                    {
                        val = sec.GetAttribute(key);
                    }
                }
            }
            catch ( Exception )
            {
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
        private string get_setting_string(string section, string key, string val, XmlDocument doc)
        {
            try
            {
                string setting = val;
                get_setting_string(section, key, ref setting, doc);
                return setting;
            }
            catch ( Exception )
            {
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
        private int get_setting_integer(string section, string key, int val, XmlDocument doc)
        {
            try
            {
                string setting = "";
                get_setting_string(section, key, ref setting, doc);
                if ( setting != "" )
                {
                    return Convert.ToInt32(setting);
                }
                return val;
            }
            catch ( Exception )
            {
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
        private bool get_setting_bool(string section, string key, bool val, XmlDocument doc)
        {
            try
            {
                string setting = "";
                get_setting_string(section, key, ref setting, doc);
                if ( setting != "" )
                {
                    return setting != "f";
                }
                return val;
            }
            catch ( Exception )
            {
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
        private float get_setting_real(string section, string key, float val, XmlDocument doc)
        {
            try
            {
                string setting = "";
                get_setting_string(section, key, ref setting, doc);
                if ( setting != "" )
                {
                    return Convert.ToSingle(setting);
                }
                return val;
            }
            catch ( Exception )
            {
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
        private Encoding get_setting_encoding(string section, string key, Encoding val, XmlDocument doc)
        {
            try
            {
                string setting = "";
                get_setting_string(section, key, ref setting, doc);
                if ( setting != "" )
                {
                    if ( setting == "Default" )
                    {
                        return Encoding.Default;
                    }
                    else if ( setting == "Unicode" )
                    {
                        return Encoding.Unicode;
                    }
                    else if ( setting == "UTF7" )
                    {
                        return Encoding.UTF7;
                    }
                    else if ( setting == "UTF8" )
                    {
                        return Encoding.UTF8;
                    }
                    else if ( setting == "UTF32" )
                    {
                        return Encoding.UTF32;
                    }
                }
                return val;
            }
            catch ( Exception )
            {
                return val;
            }
        }

        /// <summary>
        /// 設定を書き込む
        /// </summary>
        /// <param name="section">設定のセクション</param>
        /// <param name="key">設定のキー</param>
        /// <param name="val">設定の値</param>
        /// <param name="doc">XMLのドキュメント</param>
        private void set_setting_string(string section, string key, string val, XmlDocument doc)
        {
            try
            {
                XmlElement conf = doc.DocumentElement;
                if ( conf == null )
                {
                    conf = doc.CreateElement("configuration");
                    doc.AppendChild(conf);
                }
                get_section(section, conf, doc, true).SetAttribute(key, val);
            }
            catch ( Exception )
            {
            }
        }

        /// <summary>
        /// 設定を書き込む
        /// </summary>
        /// <param name="section">設定のセクション</param>
        /// <param name="key">設定のキー</param>
        /// <param name="val">設定の値</param>
        /// <param name="doc">XMLのドキュメント</param>
        private void set_setting_integer(string section, string key, int val, XmlDocument doc)
        {
            try
            {
                set_setting_string(section, key, Convert.ToString(val), doc);
            }
            catch ( Exception )
            {
            }
        }

        /// <summary>
        /// 設定を書き込む
        /// </summary>
        /// <param name="section">設定のセクション</param>
        /// <param name="key">設定のキー</param>
        /// <param name="val">設定の値</param>
        /// <param name="doc">XMLのドキュメント</param>
        private void set_setting_bool(string section, string key, bool val, XmlDocument doc)
        {
            try
            {
                if ( val )
                {
                    set_setting_string(section, key, "t", doc);
                }
                else
                {
                    set_setting_string(section, key, "f", doc);
                }
            }
            catch ( Exception )
            {
            }
        }

        /// <summary>
        /// 設定を書き込む
        /// </summary>
        /// <param name="section">設定のセクション</param>
        /// <param name="key">設定のキー</param>
        /// <param name="val">設定の値</param>
        /// <param name="doc">XMLのドキュメント</param>
        private void set_setting_real(string section, string key, float val, XmlDocument doc)
        {
            try
            {
                set_setting_string(section, key, Convert.ToString(val), doc);
            }
            catch ( Exception )
            {
            }
        }

        /// <summary>
        /// 設定を書き込む
        /// </summary>
        /// <param name="section">設定のセクション</param>
        /// <param name="key">設定のキー</param>
        /// <param name="val">設定の値</param>
        /// <param name="doc">XMLのドキュメント</param>
        private void set_setting_encoding(string section, string key, Encoding val, XmlDocument doc)
        {
            try
            {
                string sEncoding = "Default";
                if ( val == Encoding.Default )
                {
                    sEncoding = "Default";
                }
                else if ( val == Encoding.Unicode )
                {
                    sEncoding = "Unicode";
                }
                else if ( val == Encoding.UTF7 )
                {
                    sEncoding = "UTF7";
                }
                else if ( val == Encoding.UTF8 )
                {
                    sEncoding = "UTF8";
                }
                else if ( val == Encoding.UTF32 )
                {
                    sEncoding = "UTF32";
                }
                set_setting_string(section, key, Convert.ToString(sEncoding), doc);
            }
            catch ( Exception )
            {
            }
        }

        /// <summary>
        /// 設定を読み込む
        /// </summary>
        /// <param name="path">設定ファイルのパス</param>
        public void load_settings(string path)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                XmlTextReader reader = new XmlTextReader(path);
                doc.Load(reader);
                reader.Close();

                Left = get_setting_integer("window", "left", Left, doc);
                Top = get_setting_integer("window", "top", Top, doc);
                Width = get_setting_integer("window", "width", Width, doc);
                Height = get_setting_integer("window", "height", Height, doc);
                VerticalSplitter = get_setting_integer("window", "verticalsplitter", VerticalSplitter, doc);

                XMLFileName = get_setting_string("file", "xml", XMLFileName, doc);
                OPMLFileName = get_setting_string("file", "opml", OPMLFileName, doc);
                TextFileName = get_setting_string("file", "text", TextFileName, doc);

                Encoding = get_setting_encoding("text", "encoding", Encoding, doc);
                LineEnd = get_setting_string("text", "lineend", LineEnd, doc);
                IndentHeader = get_setting_string("text", "indent", IndentHeader, doc);
                for ( int i = 0; i < MarkList.Count; i++ )
                {
                    MarkList[i] = get_setting_string("text", "h" + i.ToString(), MarkList[i], doc);
                }
                for ( int i = MarkList.Count; ; i++ )
                {
                    string h = get_setting_string("text", "h" + i.ToString(), "", doc);
                    if ( h == "" )
                    {
                        break;
                    }
                    MarkList.Add(h);
                }
            }
            catch ( Exception )
            {
            }
        }

        /// <summary>
        /// 設定を読み込む
        /// </summary>
        public void load_settings()
        {
            load_settings(settings_file_name);
        }

        //private string file_path;

        /// <summary>
        /// 設定を保存する
        /// </summary>
        /// <param name="path">設定ファイルのパス</param>
        public void save_settings(string path)
        {
            try
            {
                XmlDocument doc = new XmlDocument();

                set_setting_integer("window", "left", Left, doc);
                set_setting_integer("window", "top", Top, doc);
                set_setting_integer("window", "width", Width, doc);
                set_setting_integer("window", "height", Height, doc);
                set_setting_integer("window", "verticalsplitter", VerticalSplitter, doc);

                set_setting_string("file", "xml", XMLFileName, doc);
                set_setting_string("file", "opml", OPMLFileName, doc);
                set_setting_string("file", "text", TextFileName, doc);

                set_setting_encoding("text", "encoding", Encoding, doc);
                set_setting_string("text", "lineend", LineEnd, doc);
                set_setting_string("text", "indent", IndentHeader, doc);
                for ( int i = 0; i < MarkList.Count; i++ )
                {
                    set_setting_string("text", "h" + i.ToString(), MarkList[i], doc);
                }

                XmlTextWriter writer = new XmlTextWriter(path, null);
                writer.Formatting = Formatting.Indented;
                doc.Save(writer);
                writer.Close();
            }
            catch ( Exception )
            {
            }
        }

        /// <summary>
        /// 設定を保存する
        /// </summary>
        public void save_settings()
        {
            save_settings(settings_file_name);
        }

        /// <summary>
        /// ウィンドウの位置(左)
        /// </summary>
        public int Left { get; set; } = 80;

        /// <summary>
        /// ウィンドウの位置(上)
        /// </summary>
        public int Top { get; set; } = 80;

        /// <summary>
        /// ウィンドウの幅
        /// </summary>
        public int Width { get; set; } = 400;

        /// <summary>
        /// ウィンドウの高さ
        /// </summary>
        public int Height { get; set; } = 300;

        public int VerticalSplitter { get; set; } = 150;

        public string XMLFileName { get; set; } = "";
        public string OPMLFileName { get; set; } = "";
        public string TextFileName { get; set; } = "";

        public string IndentHeader { get; set; } = ".";
        public List<string> MarkList { get; set; } = new List<string>() { "+", "-", "*", "#", "$", "%" };
        public List<string> MarkListDefault { get; set; } = new List<string>() { "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳" };

        public Encoding Encoding { get; set; } = Encoding.UTF8;
        public string LineEnd { get; set; } = "\r\n";
    }
}
