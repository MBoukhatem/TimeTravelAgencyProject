import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'

export default function Hero({ onOpenQuiz }) {
  const scrollToDestinations = () => {
    document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80"
          alt="Space background"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/40 to-dark-900" />
      </div>

      {/* Animated orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-500/10 blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-[80px]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-glass rounded-full border border-gold-500/30 text-gold-400 text-xs tracking-[0.3em] uppercase mb-8"
        >
          <Sparkles className="w-3 h-3" />
          L'agence de voyage temporel de luxe
          <Sparkles className="w-3 h-3" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold mb-6 leading-tight"
        >
          <span className="block text-white text-shadow-gold">Voyagez à</span>
          <span className="block text-gold-gradient">travers le temps.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto mb-4"
        >
          Trois destinations. Trois époques. Une seule certitude :{' '}
          <em className="text-gold-300">vous ne serez plus jamais le même.</em>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-sm text-gray-500 tracking-[0.2em] uppercase mb-12"
        >
          Paris 1889 · Crétacé -66M · Florence 1504
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={scrollToDestinations}
            className="group relative px-8 py-4 bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold tracking-widest uppercase text-sm rounded-sm transition-all duration-300 glow-gold hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10">Choisir une époque</span>
            <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300 skew-x-12" />
          </button>
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 hover:border-gold-400/50 text-gray-300 hover:text-gold-400 font-light tracking-widest uppercase text-sm rounded-sm transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Trouver mon époque
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="flex justify-center gap-12 mt-16"
        >
          {[
            { value: '12 000+', label: 'Voyages réalisés' },
            { value: '15 ans', label: "D'expérience" },
            { value: '100%', label: 'Retours garantis' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-serif font-bold text-gold-400">{stat.value}</div>
              <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 cursor-pointer text-gray-500 hover:text-gold-400 transition-colors"
          onClick={scrollToDestinations}
        >
          <span className="text-xs tracking-[0.3em] uppercase">Explorer</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}
