using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Text.RegularExpressions;

namespace ServerConverter
{
    class Conversion
    {
        public Conversion(string sourcefile, string destinationFile)
        {
            SourceFile = sourcefile;
            DestinationFile = destinationFile;
        }

        private string SourceFile { get; set; }
        private string DestinationFile { get; set; }

        public void Convert()
        {
            //StreamReader sr = new StreamReader(SourceFile, Encoding.GetEncoding("Shift_JIS"));
            //string[] lines = File.ReadAllLines(SourceFile, System.Text.Encoding.GetEncoding("Shift_JIS"));
            try
            {
                string[] srcLines = File.ReadAllLines(SourceFile);
                List<string> destLines = new List<string>();
                for ( int i = 0; i < srcLines.Count(); i++ )
                {
                    string line = srcLines[i];
                    if ( Regex.IsMatch(line, @"^\s*\/\/\<browser\/begin\>") )
                    {
                        for ( i++; i < srcLines.Count(); i++ )
                        {
                            line = srcLines[i];
                            if ( Regex.IsMatch(line, @"^\s*\/\/\<browser\/end\>") )
                            {
                                break;
                            }
                        }
                    }
                    //else if ( Regex.IsMatch(line, @"^\s*\/\/\<server\/browser\>") )
                    //{
                    //    Match m = Regex.Match(line, @"^(\s*)\/\/\<server\/browser\>(.*)$");
                    //    destLines.Add(m.Groups[1].Value + m.Groups[2].Value);
                    //    i++;
                    //}
                    else if ( Regex.IsMatch(line, @"^\s*\/\/\<server\>") )
                    {
                        Match m = Regex.Match(line, @"^(\s*)\/\/\<server\>(.*)$");
                        destLines.Add(m.Groups[1].Value + m.Groups[2].Value);
                    }
                    else if ( Regex.IsMatch(line, @"\/\/\<browser\>") )
                    {
                    }
                    else
                    {
                        destLines.Add(line);
                    }
                }
                File.WriteAllLines(DestinationFile, destLines);
            }
            catch ( Exception e )
            {
                System.Windows.MessageBox.Show(e.Message);
            }
        }
    }
}
