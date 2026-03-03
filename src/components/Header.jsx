import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Menu, X, Sparkles } from 'lucide-react'

const navLinks = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Destinations', href: '#destinations' },
]

export default function Header({ onOpenQuiz }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-glass-dark shadow-lg shadow-black/40' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => handleNav('#accueil')} className="flex items-center gap-2 group">
          <div className="relative">
            <Clock className="w-7 h-7 text-gold-400 group-hover:rotate-180 transition-transform duration-700" />
            <div className="absolute inset-0 rounded-full bg-gold-400/20 animate-pulse-gold" />
          </div>
          <span className="font-serif text-lg font-semibold text-gold-gradient leading-none">
            TimeTravel<br />
            <span className="text-xs font-normal tracking-[0.2em] text-gold-300/70">AGENCY</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-sm tracking-widest uppercase text-gray-300 hover:text-gold-400 transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-2 px-5 py-2 text-sm tracking-widest uppercase bg-gold-500/10 border border-gold-500/40 text-gold-400 rounded-sm hover:bg-gold-500/20 hover:border-gold-400 transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Quiz
          </button>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden text-gold-400 p-2"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-glass-dark border-t border-gold-500/20"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="text-left text-sm tracking-widest uppercase text-gray-300 hover:text-gold-400 transition-colors py-2 border-b border-white/5"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { setMenuOpen(false); onOpenQuiz() }}
                className="text-left text-sm tracking-widest uppercase text-gold-400 py-2 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
