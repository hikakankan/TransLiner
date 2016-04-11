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

namespace ServerConverter
{
    /// <summary>
    /// MainWindow.xaml の相互作用ロジック
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void buttonConvert_Click(object sender, RoutedEventArgs e)
        {
            Conversions conversions = new Conversions();
            string dir = @"..\..\..\..\TransLinerNode\TransLinerNode\";
            conversions.Add(dir + "TLPage.ts", dir + "TLPageServer.ts");
            conversions.Add(dir + "TLRootPage.ts", dir + "TLRootPageServer.ts");
            conversions.Add(dir + "TLPageSettings.ts", dir + "TLPageSettingsServer.ts");
            conversions.Add(@"C:\furuta\repository\TransLiner\TransLinerTS\TransLiner\TLPageSettings.js", @"C:\furuta\repository\TransLiner\TransLinerTS\TransLiner\TLPageSettingsServer.js");
            conversions.Convert();
            System.Windows.MessageBox.Show("終了");
        }
    }
}
