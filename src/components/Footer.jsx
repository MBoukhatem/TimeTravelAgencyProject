import { motion } from 'framer-motion'
import { Clock, Github, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gold-400" />
              <span className="font-serif text-base font-semibold text-gold-gradient">TimeTravel Agency</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              L'agence de voyage temporel de luxe depuis 2010. Explorez l'histoire, vivez l'impossible.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase text-gold-400 mb-4">Navigation</h4>
            <ul className="space-y-2">
              {['Accueil', 'Destinations', 'À propos', 'Contact', 'Conditions'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-gold-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase text-gold-400 mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p>1 Allée des Chrononautes</p>
              <p>75001 Paris, France</p>
              <p className="text-gold-400/70">+33 1 23 45 67 89</p>
              <p className="text-gold-400/70">contact@timetravelagency.fr</p>
            </div>
            <div className="flex gap-3 mt-4">
              {[Github, Twitter, Instagram, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 border border-white/10 hover:border-gold-500/40 rounded-sm flex items-center justify-center text-gray-600 hover:text-gold-400 transition-all duration-300"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2025 TimeTravel Agency. Tous droits réservés.</p>
          <p className="tracking-widest uppercase">
            Technologie certifiée ISO-T9 · Voyages sécurisés
          </p>
        </div>
      </div>
    </footer>
  )
}
