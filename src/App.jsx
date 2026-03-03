import { useState } from 'react'
import StarField from './components/StarField'
import Header from './components/Header'
import Hero from './components/Hero'
import Destinations from './components/Destinations'
import ChatBot from './components/ChatBot'
import ReservationModal from './components/ReservationModal'
import QuizModal from './components/QuizModal'
import Footer from './components/Footer'

export default function App() {
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [quizOpen, setQuizOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-dark-900 text-gray-100">
      <StarField />
      <div className="relative z-10">
        <Header onOpenQuiz={() => setQuizOpen(true)} />
        <main>
          <Hero onOpenQuiz={() => setQuizOpen(true)} />
          <Destinations onReserve={setSelectedDestination} />
        </main>
        <Footer />
        <ChatBot />
      </div>
      {selectedDestination && (
        <ReservationModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />
      )}
      {quizOpen && (
        <QuizModal
          onClose={() => setQuizOpen(false)}
          onReserve={(dest) => { setQuizOpen(false); setSelectedDestination(dest) }}
        />
      )}
    </div>
  )
}
