import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Utensils, Zap, ShoppingBag, Loader2, ChefHat, Send, User, Bot, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>(['rice', 'eggs', 'onions', 'tomatoes', 'chicken']);
  const [newIngredient, setNewIngredient] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Yo bro! I'm PantryPal. Tell me what's in your kitchen and let's whip up something epic. I see you've got some basics already!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const ingredientColors: Record<string, string> = {
    rice: 'bg-orange-50 border-orange-100 text-orange-900',
    eggs: 'bg-yellow-50 border-yellow-100 text-yellow-900',
    tomatoes: 'bg-red-50 border-red-100 text-red-900',
    onions: 'bg-purple-50 border-purple-100 text-purple-900',
    chicken: 'bg-emerald-50 border-emerald-100 text-emerald-900',
    default: 'bg-indigo-50 border-indigo-100 text-indigo-900'
  };

  const getIngredientColor = (name: string) => {
    return ingredientColors[name.toLowerCase()] || ingredientColors.default;
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, newIngredient.trim().toLowerCase()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (name: string) => {
    setIngredients(ingredients.filter(i => i !== name));
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const text = customText || chatInput;
    if (!text.trim() || loading) return;

    if (!customText) setChatInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, ingredients }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: 'model', text: data.text }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kitchen issues, bro.');
    } finally {
      setLoading(false);
    }
  };

  const suggestRecipes = () => {
    handleSendMessage(undefined, "Bro, what can I cook with the ingredients in my pantry right now?");
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-900 font-sans selection:bg-orange-200 flex flex-col">
      {/* Header */}
      <nav className="h-20 bg-white border-b-4 border-orange-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-20 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <ChefHat className="text-white w-6 h-6 md:w-7 md:h-7" />
          </div>
          <span className="text-xl md:text-2xl font-black text-orange-900 tracking-tight">PANTRY PAL</span>
        </div>
        <div className="flex gap-4 md:gap-6">
          <div className="hidden sm:flex items-center px-6 py-2 bg-orange-100 text-orange-700 rounded-full font-bold text-xs uppercase tracking-wider gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Bachelor Mode
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row overflow-hidden">
        
        {/* Sidebar: Your Ingredients */}
        <aside className="w-full lg:w-80 bg-white p-6 md:p-8 flex flex-col border-r-2 border-orange-100 shadow-xl lg:overflow-y-auto flex-shrink-0">
          <h2 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-6">Available Items</h2>
          
          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Added something?"
              className="flex-1 bg-orange-50 border-2 border-orange-100 rounded-xl px-4 py-2 text-sm focus:border-orange-500 outline-none transition-all placeholder:text-orange-200"
            />
            <button 
              onClick={addIngredient}
              className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-all shadow-md active:scale-95"
              id="add-ingredient-btn"
            >
              <Plus className="w-5 h-5 font-bold" />
            </button>
          </div>

          <div className="space-y-3 flex flex-col">
            <AnimatePresence>
              {ingredients.map((item) => (
                <motion.div 
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border group transition-all hover:shadow-md ${getIngredientColor(item)}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold capitalize">{item}</span>
                  </div>
                  <button 
                    onClick={() => removeIngredient(item)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-8">
            <button 
              onClick={suggestRecipes}
              disabled={loading || ingredients.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-4 rounded-[24px] flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-sm"
              id="suggest-recipes-btn"
            >
              <Zap className="w-5 h-5 fill-current" />
              Cook it up, bro
            </button>
          </div>

          <div className="mt-auto hidden lg:block p-6 bg-orange-500 rounded-3xl text-white shadow-xl shadow-orange-100">
            <p className="text-[10px] font-black uppercase opacity-80 mb-2 tracking-widest">Pro Tip</p>
            <p className="text-sm leading-relaxed font-bold italic">"Onions and tomatoes are the foundation of civilizaion, bro. Trust."</p>
          </div>
        </aside>

        {/* Content Area: Chat */}
        <main className="flex-1 flex flex-col bg-orange-50 h-[calc(100vh-5rem)]">
          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 scroll-smooth"
          >
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] md:max-w-[75%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-5 rounded-3xl shadow-sm border-2 ${
                      msg.role === 'user' 
                        ? 'bg-indigo-50 border-indigo-100 text-indigo-950 rounded-tr-none' 
                        : 'bg-white border-orange-100 text-gray-800 rounded-tl-none'
                    }`}>
                      <div className="prose prose-sm prose-indigo max-w-none prose-p:leading-relaxed prose-li:my-1">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex justify-start"
                >
                  <div className="flex gap-3 items-center bg-white border-2 border-orange-100 p-4 rounded-3xl rounded-tl-none shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-orange-500">PantryPal is cooking...</span>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex justify-center"
                >
                  <div className="bg-red-100 border-2 border-red-200 text-red-900 px-6 py-3 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-bold text-sm">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Input */}
          <div className="p-6 md:p-8 bg-white border-t-2 border-orange-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <form 
              onSubmit={handleSendMessage}
              className="relative max-w-4xl mx-auto flex gap-3"
            >
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything... 'How do I cook the chicken?'"
                className="flex-1 bg-orange-50 border-2 border-orange-100 rounded-[28px] px-6 py-4 outline-none focus:border-orange-500 transition-all font-medium pr-16"
              />
              <button 
                type="submit"
                disabled={loading || !chatInput.trim()}
                className="absolute right-2 top-2 bottom-2 bg-orange-500 text-white w-12 rounded-full flex items-center justify-center hover:bg-orange-600 disabled:bg-gray-200 transition-all shadow-lg shadow-orange-100 active:scale-95"
              >
                <Send className="w-5 h-5 fill-current" />
              </button>
            </form>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mt-4">
              Your pantry, your rules. Just talk to me bro.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
