using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace TransLiner
{
    class TLCommand : ICommand
    {
        private Action executeHandler;

        public TLCommand(Action action)
        {
            executeHandler = action;
        }

        public bool CanExecute(object parameter)
        {
            return true;
        }

        public void Execute(object parameter)
        {
            if ( executeHandler != null )
            {
                executeHandler();
            }
        }

        public event EventHandler CanExecuteChanged;
    }
}
