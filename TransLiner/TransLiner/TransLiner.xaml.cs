using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace TransLiner
{
    /// <summary>
    /// MainWindow.xaml の相互作用ロジック
    /// </summary>
    public partial class TransLinerWindow : Window
    {
        private const string settings_file_name = "TransLiner.tli"; // 設定ファイル名
        private TLSettings settings;

        private const string data_file_name = "TransLiner.tld"; // データファイル名
        private TLRootPage page; // データ
        private TLKeyBindings keyBindings = new TLKeyBindings();

        public TransLinerWindow()
        {
            InitializeComponent();

            settings = new TLSettings(settings_file_name);
            settings.load_settings();

            page = new TLRootPage("", settings, () => Close(), () => treeView.Focus(), () => textBox.Focus());
            page.Load(data_file_name);
            this.DataContext = page;

            checkEncodingAll();
            checkLineEndAll();

            initKeyBindings();

            //setKeyBindings();
        }

        private void initKeyBindings()
        {
            keyBindings.Add(page.MoveUp, Key.Up, ModifierKeys.Shift);
            keyBindings.Add(page.MoveDown, Key.Down, ModifierKeys.Shift);
            keyBindings.Add(page.MoveLeftUp, Key.Left, ModifierKeys.Shift);
            keyBindings.Add(page.MoveDownRightTop, Key.Right, ModifierKeys.Shift);
            keyBindings.Add(page.CreateUp, Key.Up, ModifierKeys.Control);
            keyBindings.Add(page.CreateDown, Key.Down, ModifierKeys.Control);
            keyBindings.Add(page.CreateRightBottom, Key.Right, ModifierKeys.Control);
            keyBindings.Add(page.DuplicateUp, Key.Up, ModifierKeys.Control | ModifierKeys.Shift);
            keyBindings.Add(page.DuplicateDown, Key.Down, ModifierKeys.Control | ModifierKeys.Shift);
            keyBindings.Add(page.DuplicateRightBottom, Key.Right, ModifierKeys.Control | ModifierKeys.Shift);
            keyBindings.Add(page.SelectedUp, Key.NumPad8, ModifierKeys.None);
            keyBindings.Add(page.SelectedDown, Key.NumPad2, ModifierKeys.None);
            keyBindings.Add(page.Unexpand, Key.NumPad4, ModifierKeys.None);
            keyBindings.Add(page.Expand, Key.NumPad6, ModifierKeys.None);
            keyBindings.Add(page.DeleteCommand, Key.Delete, ModifierKeys.Shift);
            keyBindings.Add(page.EditorFocus, Key.E, ModifierKeys.Control);
        }

        private void setKeyBindings()
        {
            foreach ( KeyBinding keyBinding in keyBindings.KeyBindings )
            {
                InputBindings.Add(keyBinding);
            }
        }

        private void Window_PreviewKeyDown(object sender, KeyEventArgs e)
        {
            if ( keyBindings.Execute(e.Key) )
            {
                e.Handled = true;
            }
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            Left = settings.Left;
            Top = settings.Top;
            Width = settings.Width;
            Height = settings.Height;
            mainGrid.ColumnDefinitions[0].Width = new GridLength(settings.VerticalSplitter);
        }

        private void Window_Closed(object sender, EventArgs e)
        {
            page.Save(data_file_name);
            settings.Left = (int)Left;
            settings.Top = (int)Top;
            settings.Width = (int)Width;
            settings.Height = (int)Height;
            settings.VerticalSplitter = (int)mainGrid.ColumnDefinitions[0].Width.Value;
            settings.save_settings();
        }

        private void checkEncodingAll()
        {
            menuEncodingDefault.IsChecked = page.EncodingDefault;
            menuEncodingUnicode.IsChecked = page.EncodingUnicode;
            menuEncodingUTF7.IsChecked = page.EncodingUTF7;
            menuEncodingUTF8.IsChecked = page.EncodingUTF8;
            menuEncodingUTF32.IsChecked = page.EncodingUTF32;
        }

        private void checkLineEndAll()
        {
            menuLineCR.IsChecked = page.LineEndCR;
            menuLineLF.IsChecked = page.LineEndLF;
            menuLineCRLF.IsChecked = page.LineEndCRLF;
        }

        private void menuEncodingDefault_Click(object sender, RoutedEventArgs e)
        {
            page.EncodingDefault = true;
            checkEncodingAll();
        }

        private void menuEncodingUnicode_Click(object sender, RoutedEventArgs e)
        {
            page.EncodingUnicode = true;
            checkEncodingAll();
        }

        private void menuEncodingUTF7_Click(object sender, RoutedEventArgs e)
        {
            page.EncodingUTF7 = true;
            checkEncodingAll();
        }

        private void menuEncodingUTF8_Click(object sender, RoutedEventArgs e)
        {
            page.EncodingUTF8 = true;
            checkEncodingAll();
        }

        private void menuEncodingUTF32_Click(object sender, RoutedEventArgs e)
        {
            page.EncodingUTF32 = true;
            checkEncodingAll();
        }

        private void menuLineCR_Click(object sender, RoutedEventArgs e)
        {
            page.LineEndCR = true;
            checkLineEndAll();
        }

        private void menuLineLF_Click(object sender, RoutedEventArgs e)
        {
            page.LineEndLF = true;
            checkLineEndAll();
        }

        private void menuLineCRLF_Click(object sender, RoutedEventArgs e)
        {
            page.LineEndCRLF = true;
            checkLineEndAll();
        }
    }
}
