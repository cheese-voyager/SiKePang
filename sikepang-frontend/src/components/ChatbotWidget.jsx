import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, Loader } from "lucide-react";
import { sendChatMessage } from "../services/chatbotService";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Halo! Saya adalah **Asisten AI SiKePang**. Ada yang bisa saya bantu terkait ketahanan pangan, pertanian, pencegahan hama, manajemen stok pangan, atau rekomendasi pupuk?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsgText = input.trim();
    setInput("");
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Tambah pesan user ke list
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsgText, time: currentTime }
    ]);
    setIsLoading(true);

    try {
      const aiReply = await sendChatMessage(userMsgText);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Maaf, terjadi kesalahan saat menghubungi server kecerdasan buatan. Silakan coba kembali beberapa saat lagi.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageText = (text) => {
    return text.split('\n').map((line, idx) => {
      let content = line;
      // Handle bold formatting **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-bold text-emerald-950 dark:text-emerald-900">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // Check if line is a list item
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        const cleanLine = line.replace(/^[-*]\s*/, '');
        return (
          <li key={idx} className="ml-4 list-disc mb-1 leading-relaxed text-sm">
            {parts.length > 0 ? parts : cleanLine}
          </li>
        );
      }

      return (
        <p key={idx} className="mb-2 last:mb-0 leading-relaxed text-sm">
          {parts.length > 0 ? parts : content}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-plantation-600 to-leaf-600 rounded-full flex items-center justify-center text-white shadow-glow hover:shadow-glow-lg focus:outline-none transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-20 right-0 origin-bottom-right w-[360px] md:w-[400px] h-[500px] max-h-[80vh] bg-white/90 backdrop-blur-md rounded-2xl shadow-glass border border-plantation-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-plantation-gradient text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative border border-white/20">
                  <Bot className="w-5 h-5 text-emerald-300" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    Asisten AI SiKePang
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  </h4>
                  <p className="text-xs text-plantation-200">Konsultan Ketahanan Pangan</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body - Scrollable Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-plantation-50/30 to-leaf-50/10">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-plantation-100 flex items-center justify-center self-end border border-plantation-200 shrink-0">
                        <Bot className="w-4.5 h-4.5 text-plantation-700" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div
                        className={`p-3 rounded-2xl shadow-sm ${
                          msg.sender === "user"
                            ? "bg-plantation-600 text-white rounded-br-none"
                            : msg.isError
                            ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-none"
                            : "bg-white text-gray-800 border border-plantation-100 rounded-bl-none"
                        }`}
                      >
                        {msg.sender === "user" ? (
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        ) : (
                          renderMessageText(msg.text)
                        )}
                      </div>
                      <span
                        className={`text-[10px] text-gray-400 mt-1 ${
                          msg.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[80%] items-center">
                    <div className="w-8 h-8 rounded-full bg-plantation-100 flex items-center justify-center border border-plantation-200 shrink-0">
                      <Bot className="w-4.5 h-4.5 text-plantation-700" />
                    </div>
                    <div className="p-3 bg-white border border-plantation-100 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                      <Loader className="w-4 h-4 text-plantation-600 animate-spin" />
                      <span className="text-xs text-gray-500 font-medium">AI sedang berpikir...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Footer - Input Area */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-plantation-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan penanganan hama, pupuk..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-plantation-50/50 border border-plantation-100 focus:border-plantation-500 focus:outline-none rounded-xl text-sm transition-colors text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-plantation-600 hover:bg-plantation-700 disabled:bg-plantation-200 text-white transition-all disabled:scale-100 active:scale-95 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
