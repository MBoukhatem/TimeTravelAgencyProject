import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Trash2, Clock, Bot } from 'lucide-react'
import { useChat } from '../hooks/useChat'

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-gold-400" />
      </div>
      <div className="bg-dark-700 border border-white/5 rounded-sm rounded-bl-none px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gold-400" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gold-400" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gold-400" />
        </div>
      </div>
    </div>
  )
}

function Message({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <div className={`flex items-end gap-2 mb-4 chat-message-enter ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot ? (
        <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center flex-shrink-0">
          <Bot className="w-3.5 h-3.5 text-gold-400" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-300">
          V
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap rounded-sm ${
          isBot
            ? 'bg-dark-700 border border-white/5 text-gray-200 rounded-bl-none'
            : 'bg-gold-500/15 border border-gold-500/30 text-gold-100 rounded-br-none'
        }`}
        dangerouslySetInnerHTML={{
          __html: msg.text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-400">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
        }}
      />
    </div>
  )
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, isTyping, sendMessage, clearChat } = useChat()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    sendMessage(text)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        id="chat"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-400 shadow-lg shadow-gold-500/30 flex items-center justify-center transition-colors duration-300 animate-pulse-gold"
        aria-label="Ouvrir le chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6 text-dark-900" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6 text-dark-900" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Notification dot */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
            {messages.length > 1 ? messages.filter(m => m.role === 'bot').length : '!'}
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col bg-glass-dark rounded-sm shadow-2xl shadow-black/60 overflow-hidden"
            style={{ maxHeight: '70vh', height: '500px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gold-500/20 bg-dark-800/80">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gold-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-dark-800" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gold-400 text-sm">CHRONOS</div>
                <div className="text-xs text-gray-500">
                  {isTyping ? (
                    <span className="text-green-400">En train d'écrire...</span>
                  ) : (
                    'Assistant temporel · En ligne'
                  )}
                </div>
              </div>
              <button
                onClick={clearChat}
                className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                title="Effacer la conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {messages.map(msg => (
                <Message key={msg.id} msg={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {['Voir les prix', 'Paris 1889', 'Comment réserver ?'].map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-sm bg-gold-500/10 border border-gold-500/20 text-gold-400 hover:bg-gold-500/20 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-gold-500/20 bg-dark-800/60">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Posez-moi vos questions sur les voyages temporels..."
                className="flex-1 bg-dark-700 border border-white/10 rounded-sm px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gold-500/40 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed text-dark-900 rounded-sm transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
