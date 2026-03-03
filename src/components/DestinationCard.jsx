import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Tag, Clock, ChevronRight, Play } from 'lucide-react'

export default function DestinationCard({ destination, index, onReserve }) {
  const { title, era, description, tags, price, currency, image, video, color, gradient, icon } = destination
  const videoRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Load the video only on first hover (lazy loading)
  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    if (!videoLoaded && videoRef.current) {
      videoRef.current.load()
      setVideoLoaded(true)
    }
    videoRef.current?.play().catch(() => {})
  }, [videoLoaded])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [])

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, y: -6 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-sm overflow-hidden cursor-pointer bg-dark-800 border border-white/5 hover:border-gold-500/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Media container */}
      <div className="relative h-56 overflow-hidden">

        {/* Static image — always visible, fades out when video is ready */}
        <img
          src={image}
          alt={era}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            hovered && videoReady ? 'opacity-0' : 'opacity-100'
          } group-hover:scale-110`}
          style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}
        />

        {/* Video — lazy loaded on first hover, crossfades over image */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            hovered && videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>

        {/* Gradients overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient} to-transparent pointer-events-none`} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent pointer-events-none" />

        {/* Era badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-white/10 z-10">
          <Clock className="w-3 h-3" style={{ color }} />
          <span className="text-xs tracking-wider" style={{ color }}>{era}</span>
        </div>

        {/* Icon + play hint */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {hovered && videoReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-sm border border-white/10"
            >
              <Play className="w-2.5 h-2.5 text-white/70" />
              <span className="text-[10px] text-white/60 tracking-wider">LIVE</span>
            </motion.div>
          )}
          <span className="text-2xl">{icon}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="font-serif text-xl font-semibold mb-2"
          style={{ color: `color-mix(in srgb, ${color} 60%, white 40%)` }}
        >
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 font-light">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-gray-400"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <div className="text-xs text-gray-600 tracking-widest uppercase mb-1">À partir de</div>
            <div className="text-2xl font-serif font-bold" style={{ color }}>
              {price.toLocaleString('fr-FR')}
              <span className="text-sm font-normal text-gray-400 ml-1">{currency}</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.stopPropagation(); onReserve(destination) }}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wider uppercase rounded-sm transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${color}22, ${color}11)`,
              border: `1px solid ${color}44`,
              color,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${color}33`
              e.currentTarget.style.borderColor = color
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${color}22, ${color}11)`
              e.currentTarget.style.borderColor = `${color}44`
            }}
          >
            Réserver
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{ boxShadow: `inset 0 0 40px ${color}10` }}
      />
    </motion.article>
  )
}
