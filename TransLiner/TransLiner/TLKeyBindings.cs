using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace TransLiner
{
    class TLKeyBindings
    {
        //private List<KeyBinding> keyBindings = new List<KeyBinding>();
        public InputBindingCollection KeyBindings { get; set; } = new InputBindingCollection();

        public void Add(ICommand command, Key key, ModifierKeys modifiers)
        {
            KeyBindings.Add(new KeyBinding(command, key, modifiers));
        }

        public bool Execute(Key key)
        {
            foreach ( KeyBinding keyBinding in KeyBindings )
            {
                //System.Diagnostics.Debug.WriteLine("key=" + key.ToString() + " keyBinding.Key=" + keyBinding.Key.ToString() + " modifiers=" + modifiers.ToString() + " keyBinding.Modifiers=" + keyBinding.Modifiers.ToString());
                if ( key == keyBinding.Key && Keyboard.Modifiers == keyBinding.Modifiers )
                {
                    keyBinding.Command.Execute(null);
                    return true;
                }
            }
            return false;
        }
    }
}
