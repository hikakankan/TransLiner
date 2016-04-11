using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerConverter
{
    class Conversions
    {
        private List<Conversion> conversions = new List<Conversion>();

        public void Add(string source, string destination)
        {
            conversions.Add(new Conversion(source, destination));
        }

        public void Convert()
        {
            foreach ( Conversion conv in conversions )
            {
                conv.Convert();
            }
        }
    }
}
