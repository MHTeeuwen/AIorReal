import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

// Image data: mix of AI-generated and lesser-known human artwork
// AI images generated to mimic the style of each human painting
const ALL_IMAGES = [
  // === AI (DALL-E, in de stijl van echte schilderijen) ===
  {
    url: '/images/ai_storm.png',
    isAI: true,
    title: 'Geliefden op de vlucht',
    funFact: 'Gemaakt door DALL-E in de stijl van 19e-eeuws Academisch Realisme. AI kan tegenwoordig de dramatische stofplooien en emotie nabootsen waar klassieke schilders jaren over deden.',
  },
  {
    url: '/images/ai_north_cape.png',
    isAI: true,
    title: 'Arctische kliffen bij maanlicht',
    funFact: 'AI-gegenereerd als een 19e-eeuws Scandinavisch landschap. De subtiele maanlichtreflecties op het water zijn een veelvoorkomende uitdaging: AI krijgt de fysica vaak net niet helemaal goed.',
  },
  {
    url: '/images/ai_forest_floor.png',
    isAI: true,
    title: 'Bosgrond met insecten',
    funFact: 'Gemaakt door DALL-E in de stijl van donkere Gouden Eeuw-stillevens. AI heeft moeite met kleine details zoals insectenpootjes en planttexturen. Kijk goed!',
  },
  {
    url: '/images/ai_vanitas.png',
    isAI: true,
    title: 'Vanitas met schedel',
    funFact: 'AI-gegenereerd vanitas-stilleven. De schedel, tulp en zeepbellen zijn klassieke vanitassymbolen, maar de AI moest deze symbolische tradities leren uit trainingsdata.',
  },
  {
    url: '/images/ai_seascape.png',
    isAI: true,
    title: 'Storm op zee',
    funFact: 'Gegenereerd als een dramatisch 19e-eeuws zeegezicht. AI is goed in woelige luchten, maar maakt golven die niet helemaal kloppen qua vloeistofdynamica.',
  },
  {
    url: '/images/ai_winter.png',
    isAI: true,
    title: 'Hollands wintergezicht',
    funFact: 'AI-gegenereerd Hollands winterlandschap. De ijzige sfeer en schaatsende figuurtjes zijn overtuigend, maar het perspectief in de architectuur klopt vaak net niet.',
  },
  {
    url: '/images/ai_harbor.png',
    isAI: true,
    title: 'Haven bij maanlicht',
    funFact: 'Gegenereerd als een Scandinavisch nachtgezicht. AI doet dramatische belichting goed, maar het scheepstuig en de silhouetten kunnen subtiele fouten bevatten.',
  },
  {
    url: '/images/ai_portrait.png',
    isAI: true,
    title: 'Vrouw met hondje',
    funFact: 'AI-portret in 18e-eeuwse Italiaanse stijl. Portretten zijn een van de sterkste kanten van AI. Het zachte licht en de warme tinten maken het bijna niet te onderscheiden van mensenwerk.',
  },
  {
    url: '/images/ai_sunset.png',
    isAI: true,
    title: 'Rode zonsondergang',
    funFact: 'Gegenereerd in de stijl van proto-modern Russisch landschapswerk. De vereenvoudigde vormen en felle kleuren zijn bedrieglijk makkelijk voor AI om na te maken.',
  },
  {
    url: '/images/ai_still_life.png',
    isAI: true,
    title: 'Stilleven met brood en wijn',
    funFact: 'AI-gegenereerd Nederlands/Duits stilleven. De hypergedetailleerde texturen van brood, kaas en glas zijn indrukwekkend, maar let op subtiele belichtingsverschillen tussen objecten.',
  },

  // === ECHT (minder bekende schilderijen uit het Met Museum) ===
  {
    url: '/images/the_storm.jpg',
    isAI: false,
    title: 'De Storm',
    funFact: 'Pierre-Auguste Cot, 1880. Dit dramatische schilderij van twee geliefden die een storm ontvluchten was enorm populair. De vloeiende stof en geïdealiseerde figuren zien er bijna te perfect uit om echt te zijn.',
  },
  {
    url: '/images/north_cape.jpg',
    isAI: false,
    title: 'De Noordkaap bij maanlicht',
    funFact: 'Peder Balke, 1848. Deze Noorse romanticus legde arctische landschappen vast met een bijna abstracte eenvoud die verrassend modern aanvoelt. Best AI-achtig, toch?',
  },
  {
    url: '/images/poppy_insects.jpg',
    isAI: false,
    title: 'Stilleven met klaproos en insecten',
    funFact: 'Otto Marseus van Schrieck, ca. 1670. Deze "bosgrond"-specialist schilderde in bijna totale duisternis om nachtdieren te observeren. De hypergedetailleerde insecten lijken bijna digitaal.',
  },
  {
    url: '/images/vanitas.jpg',
    isAI: false,
    title: 'Vanitas-stilleven',
    funFact: 'Jacques de Gheyn II, 1603. Een van de vroegste vanitasschilderijen. De schedel, tulp en zeepbel staan voor de vergankelijkheid van het leven. Het detail doet niet onder voor moderne digitale kunst.',
  },
  {
    url: '/images/normandy_storm.jpg',
    isAI: false,
    title: 'Storm voor de kust van Normandië',
    funFact: 'Eugene Isabey, jaren 1850. Dit dramatische zeegezicht vangt de kracht van de oceaan met losse, energieke penseelstreken die je makkelijk voor AI-gegenereerde turbulentie kunt aanzien.',
  },
  {
    url: '/images/winter_holland.jpg',
    isAI: false,
    title: 'Winterlandschap, Holland',
    funFact: 'Barend Cornelis Koekkoek, 1833. Bekend als de "Prins van het Landschap." Zijn nauwkeurige detail in elke bevroren tak en schaatsend figuurtje is verbazingwekkend fotorealistisch.',
  },
  {
    url: '/images/copenhagen_harbor.jpg',
    isAI: false,
    title: 'Haven van Kopenhagen bij maanlicht',
    funFact: 'Johan Christian Dahl, 1846. Deze Noorse romantische meester schilderde maanverlichte scènes met zo\'n atmosferische precisie dat de zilveren lichteffecten bijna computermatig perfect lijken.',
  },
  {
    url: '/images/woman_dog.jpg',
    isAI: false,
    title: 'Vrouw met hond',
    funFact: 'Giacomo Ceruti, jaren 1740. Bekend als "Il Pitocchetto" (de kleine bedelaar). Ceruti schilderde gewone mensen met buitengewone waardigheid. Het warme, zachte licht voelt tijdloos.',
  },
  {
    url: '/images/red_sunset.jpg',
    isAI: false,
    title: 'Rode zonsondergang',
    funFact: 'Arkhyp Kuindzhi, 1905-8. Deze Oekraïens-Russische schilder was beroemd om lichteffecten die zo intens waren dat het publiek dacht dat hij verborgen lampen achter zijn doeken gebruikte.',
  },
  {
    url: '/images/flegel_still_life.jpg',
    isAI: false,
    title: 'Stilleven',
    funFact: 'Georg Flegel, ca. 1625-30. Een van de eerste Duitse schilders die zich specialiseerde in stillevens. Zijn obsessieve aandacht voor elke noot, kruimel en reflectie kan tippen aan elke moderne render engine.',
  },
]

const TOTAL_ROUNDS = 10

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Image component with automatic retry on failure
function RetryImage({ src, alt, className, onLoad, onError, maxRetries = 3 }) {
  const [retries, setRetries] = useState(0)
  const [currentSrc, setCurrentSrc] = useState(src)
  const timerRef = useRef(null)

  useEffect(() => {
    setRetries(0)
    setCurrentSrc(src)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [src])

  const handleError = () => {
    if (retries < maxRetries) {
      timerRef.current = setTimeout(() => {
        setRetries(r => r + 1)
        setCurrentSrc(src + (src.includes('?') ? '&' : '?') + '_r=' + (retries + 1))
      }, 1000 * (retries + 1))
    } else {
      onError?.()
    }
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onLoad={onLoad}
      onError={handleError}
      referrerPolicy="no-referrer"
    />
  )
}

// Progress bar
function ProgressBar({ current, total }) {
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex justify-between text-xs text-stone-400 mb-1.5">
        <span className="font-medium">Ronde {current}/{total}</span>
        <span>{current} van {total}</span>
      </div>
      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

// Start screen
function StartScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center animate-fade-in">
      <div className="text-6xl mb-6 animate-pop-in">
        🎭
      </div>
      <h1
        className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-3 animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        AI of echt?
      </h1>
      <p
        className="text-stone-500 text-lg mb-8 max-w-sm animate-fade-in-up"
        style={{ animationDelay: '0.4s' }}
      >
        Zie jij het verschil tussen AI-kunst en echte meesterwerken?
      </p>
      <button
        onClick={onStart}
        className="btn-press px-8 py-4 bg-amber-500 hover:bg-amber-600 rounded-2xl text-white font-semibold text-lg shadow-md shadow-amber-500/20 cursor-pointer transition-colors duration-200 animate-fade-in-up"
        style={{ animationDelay: '0.6s' }}
      >
        Start
      </button>

    </div>
  )
}

// Game screen
function GameScreen({ images, onFinish }) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [guess, setGuess] = useState(null) // 'correct' | 'wrong' | null
  const [showFact, setShowFact] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [answers, setAnswers] = useState([])
  const [cardKey, setCardKey] = useState(0)
  const timeoutRef = useRef(null)

  const currentImage = images[round]

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleGuess = useCallback(
    (guessedAI) => {
      if (guess !== null) return

      const isCorrect = guessedAI === currentImage.isAI
      const result = isCorrect ? 'correct' : 'wrong'
      setGuess(result)
      setShowFact(true)

      if (isCorrect) {
        setScore((s) => s + 1)
        setStreak((s) => s + 1)
      } else {
        setStreak(0)
      }

      setAnswers((prev) => [
        ...prev,
        { image: currentImage, guessedAI, isCorrect },
      ])
    },
    [guess, currentImage]
  )

  const handleNext = useCallback(() => {
    if (round + 1 >= TOTAL_ROUNDS) {
      onFinish({
        score,
        answers,
        totalRounds: TOTAL_ROUNDS,
      })
      return
    }

    setGuess(null)
    setShowFact(false)
    setImageLoaded(false)
    setImageError(false)
    setRound((r) => r + 1)
    setCardKey((k) => k + 1)
  }, [round, score, answers, guess, onFinish])

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl px-3 py-1.5 border border-stone-200 shadow-sm">
            <span className="text-xs text-stone-400">Punten</span>
            <span className="ml-2 font-bold text-stone-900">{score}</span>
          </div>
          {streak > 1 && (
            <div className="bg-amber-50 rounded-xl px-3 py-1.5 border border-amber-200 animate-gentle-bounce">
              <span className="text-xs font-medium text-amber-600">🔥 {streak} streak</span>
            </div>
          )}
        </div>
      </div>

      <ProgressBar current={round + 1} total={TOTAL_ROUNDS} />

      {/* Image Card */}
      <div
        key={cardKey}
        className={`relative bg-white rounded-2xl overflow-hidden border shadow-lg shadow-stone-900/5 animate-fade-in-up transition-all duration-300 ${
          guess === 'correct'
            ? 'border-emerald-300 ring-2 ring-emerald-200'
            : guess === 'wrong'
            ? 'border-rose-300 ring-2 ring-rose-200'
            : 'border-stone-200'
        }`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin-slow" />
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 text-stone-400">
              <span className="text-4xl mb-2">🖼️</span>
              <span className="text-sm">Afbeelding kon niet laden</span>
              <span className="text-xs text-stone-400 mt-1">{currentImage.title}</span>
            </div>
          )}
          <RetryImage
            src={currentImage.url}
            alt={currentImage.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => { setImageError(true); setImageLoaded(true) }}
          />

          {/* Answer overlay */}
          {guess && (
            <div className="absolute top-4 right-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-md animate-gentle-bounce ${
                  guess === 'correct'
                    ? 'bg-emerald-500'
                    : 'bg-rose-500'
                }`}
              >
                {guess === 'correct' ? '✓' : '✗'}
              </div>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="p-5">
          {!showFact ? (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-stone-900 mb-1">
                Wat denk jij?
              </h2>
              <p className="text-stone-500 text-sm mb-5">
                Is dit gemaakt door AI of door een mens?
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleGuess(true)}
                  className="btn-press flex items-center justify-center gap-2 py-4 px-4 bg-stone-50 hover:bg-amber-50 border-2 border-stone-200 hover:border-amber-300 rounded-2xl font-semibold text-stone-700 transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-xl">🤖</span>
                  <span>AI</span>
                </button>
                <button
                  onClick={() => handleGuess(false)}
                  className="btn-press flex items-center justify-center gap-2 py-4 px-4 bg-stone-50 hover:bg-amber-50 border-2 border-stone-200 hover:border-amber-300 rounded-2xl font-semibold text-stone-700 transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-xl">🎨</span>
                  <span>Echt</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-stone-100 text-stone-600 border border-stone-200">
                  {currentImage.isAI ? '🤖 AI' : '🎨 Echt'}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    guess === 'correct' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {guess === 'correct' ? 'Goed!' : 'Fout!'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-stone-900 mb-1">
                {currentImage.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                {currentImage.funFact}
              </p>

              <button
                onClick={handleNext}
                className="btn-press w-full py-3.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-white font-semibold shadow-md shadow-amber-500/15 cursor-pointer transition-colors duration-200"
              >
                {round + 1 >= TOTAL_ROUNDS ? 'Bekijk resultaat' : 'Volgende'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Results screen
function ResultsScreen({ results, onPlayAgain }) {
  const { score, answers, totalRounds } = results
  const percentage = Math.round((score / totalRounds) * 100)

  const circumference = 2 * Math.PI * 52
  const dashTarget = circumference * (1 - score / totalRounds)

  const getTitle = () => {
    if (percentage >= 90) return { emoji: '🧠', text: 'Wow, knap!' }
    if (percentage >= 70) return { emoji: '🔍', text: 'Lekker bezig!' }
    if (percentage >= 50) return { emoji: '🤔', text: 'Kan beter!' }
    if (percentage >= 30) return { emoji: '😅', text: 'Oefening baart kunst!' }
    return { emoji: '🤖', text: 'Erin getrapt!' }
  }

  const title = getTitle()

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 max-w-lg mx-auto animate-fade-in">
      {/* Score reveal */}
      <div className="text-center mb-8 animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
        <div className="text-5xl mb-3 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
          {title.emoji}
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-1">{title.text}</h2>
      </div>

      {/* Score circle */}
      <div
        className="relative w-40 h-40 mb-8 animate-pop-in"
        style={{ animationDelay: '0.3s' }}
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#e7e5e3"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className="animate-score-circle"
            style={{
              '--dash-full': circumference,
              '--dash-target': dashTarget,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold text-stone-900 animate-fade-in"
            style={{ animationDelay: '1s' }}
          >
            {score}/{totalRounds}
          </span>
          <span className="text-xs text-stone-400">goed</span>
        </div>
      </div>

      {/* Answer grid */}
      <div
        className="w-full mb-8 animate-fade-in-up"
        style={{ animationDelay: '0.8s' }}
      >
        <div className="grid grid-cols-5 gap-2">
          {answers.map((answer, i) => (
            <div
              key={i}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 animate-pop-in ${
                answer.isCorrect
                  ? 'border-emerald-400'
                  : 'border-rose-400'
              }`}
              style={{ animationDelay: `${0.9 + i * 0.05}s` }}
            >
              <img
                src={answer.image.url}
                alt={answer.image.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div
                className={`absolute inset-0 flex items-center justify-center text-lg font-bold text-white ${
                  answer.isCorrect
                    ? 'bg-emerald-500/30'
                    : 'bg-rose-500/30'
                }`}
              >
                {answer.isCorrect ? '✓' : '✗'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div
        className="w-full animate-fade-in-up"
        style={{ animationDelay: '1.2s' }}
      >
        <button
          onClick={onPlayAgain}
          className="btn-press w-full py-3.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-white font-semibold shadow-md shadow-amber-500/15 cursor-pointer transition-colors duration-200"
        >
          Opnieuw spelen
        </button>
      </div>
    </div>
  )
}

// Main App
export default function App() {
  const [screen, setScreen] = useState('start') // 'start' | 'game' | 'results'
  const [gameImages, setGameImages] = useState([])
  const [results, setResults] = useState(null)

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(ALL_IMAGES)
    setGameImages(shuffled.slice(0, TOTAL_ROUNDS))
    setScreen('game')
  }, [])

  const finishGame = useCallback((gameResults) => {
    setResults(gameResults)
    setScreen('results')
  }, [])

  const playAgain = useCallback(() => {
    setResults(null)
    startGame()
  }, [startGame])

  return (
    <div className="min-h-screen bg-stone-50">
      {screen === 'start' && <StartScreen onStart={startGame} />}
      {screen === 'game' && <GameScreen images={gameImages} onFinish={finishGame} />}
      {screen === 'results' && <ResultsScreen results={results} onPlayAgain={playAgain} />}
    </div>
  )
}
