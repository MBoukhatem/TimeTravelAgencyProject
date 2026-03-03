import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'
import { destinations } from '../data/destinations'
import DestinationCard from './DestinationCard'

export default function Destinations({ onReserve }) {
  return (
    <section id="destinations" className="relative py-28 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-gold-500/30" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-gold-400 text-xs tracking-[0.35em] uppercase mb-4"
          >
            <Compass className="w-3.5 h-3.5" />
            Nos destinations
            <Compass className="w-3.5 h-3.5" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-serif font-bold mb-4"
          >
            <span className="text-white">Trois époques,</span>
            <br />
            <span className="text-gold-gradient">trois vies à vivre.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed font-light"
          >
            Chaque voyage est une expérience sur mesure, encadrée par nos chrononautes certifiés.
            Choisissez votre époque et laissez l'histoire vous transformer.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              index={i}
              onReserve={onReserve}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 text-xs tracking-[0.25em] uppercase">
            Toutes les expériences incluent transport aller-retour · Hébergement · Guide personnel
          </p>
        </motion.div>
      </div>
    </section>
  )
}
