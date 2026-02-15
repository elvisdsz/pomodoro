import { useState, useEffect, useRef } from 'react'

// Configuration for rain sounds - easily add new sounds here
// startTime (in seconds) can be:
//   - A number (e.g., 5) - always starts at 5 seconds into the audio
//   - An array (e.g., [0, 10, 20]) - randomly picks one position each time
//   - Omitted/null - defaults to 0 (beginning of audio)
const RAIN_SOUNDS = [
  {
    id: 'off',
    label: 'OFF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    )
  },
  {
    id: 'drizzle',
    label: 'DRIZZLE',
    filePath: '/sounds/soft-rain-loop.ogg',
    startTime: 0,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M8 4v3M16 4v3M12 14v7M8 16v5M16 16v5" />
        <circle cx="12" cy="10" r="3" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'pour',
    label: 'POUR',
    filePath: '/sounds/ambiance-heavy-rain-loop.wav',
    startTime: 0,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v5M8 3v5M16 3v5M12 14v8M8 15v7M16 15v7M4 16v6M20 16v6" />
        <ellipse cx="12" cy="9" rx="4" ry="2" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'storm',
    label: 'STORM',
    filePath: '/sounds/thunderstorm-with-rain-and-traffic-loop.wav',
    startTime: [6, 21, 58, 63, 114, 273],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M8 3v3M16 3v3M8 14v4M16 14v4" />
        <path d="M13 10h-2l-2 6h2l-2 6 5-8h-2l3-4z" fill="currentColor" />
        <ellipse cx="12" cy="8" rx="4" ry="2" fill="currentColor" />
      </svg>
    )
  }
]

function RainSoundToggle({ isPlaying }) {
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0)
  const audioRef = useRef(null)

  // Helper function to get a start time (handles both single value and array)
  const getStartTime = (startTime) => {
    if (startTime === undefined || startTime === null) {
      return 0
    }
    if (Array.isArray(startTime)) {
      // Pick a random start time from the array
      const randomIndex = Math.floor(Math.random() * startTime.length)
      return startTime[randomIndex]
    }
    return startTime
  }

  // Manage rain sound audio playback
  useEffect(() => {
    const currentSound = RAIN_SOUNDS[currentSoundIndex]
    const shouldPlaySound = isPlaying && currentSound.id !== 'off' && currentSound.filePath

    if (shouldPlaySound) {
      const soundPath = currentSound.filePath
      const startTime = getStartTime(currentSound.startTime) // Get random or single start time

      // Create or update audio
      if (!audioRef.current) {
        audioRef.current = new Audio(soundPath)
        audioRef.current.loop = true
        audioRef.current.volume = 0.5
        
        // Handle start time with error handling
        audioRef.current.addEventListener('loadedmetadata', () => {
          if (audioRef.current) {
            // Validate start time doesn't exceed duration
            const validStartTime = Math.min(startTime, audioRef.current.duration)
            audioRef.current.currentTime = validStartTime
          }
        })
        
        audioRef.current.play().catch(err => console.log('Audio play failed:', err))
      } else if (!audioRef.current.src.endsWith(soundPath)) {
        // Only change source if it's different
        audioRef.current.pause()
        audioRef.current.src = soundPath
        audioRef.current.load()
        
        // Set start time after loading
        audioRef.current.addEventListener('loadedmetadata', () => {
          if (audioRef.current) {
            const validStartTime = Math.min(startTime, audioRef.current.duration)
            audioRef.current.currentTime = validStartTime
          }
        }, { once: true })
        
        audioRef.current.play().catch(err => console.log('Audio play failed:', err))
      } else if (audioRef.current.paused) {
        // Resume if paused
        audioRef.current.play().catch(err => console.log('Audio play failed:', err))
      }
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }

    return () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [isPlaying, currentSoundIndex])

  const cycleSoundMode = () => {
    const nextIndex = (currentSoundIndex + 1) % RAIN_SOUNDS.length
    setCurrentSoundIndex(nextIndex)
  }

  const currentSound = RAIN_SOUNDS[currentSoundIndex]

  return (
    <div className="sound-toggle">
      <button
        className={`sound-btn ${currentSound.id !== 'off' && isPlaying ? 'playing' : ''}`}
        onClick={cycleSoundMode}
        title={`Rain sound: ${currentSound.label.toLowerCase()}`}
      >
        <span className="sound-icon">{currentSound.icon}</span>
        <span className="sound-label">{currentSound.label}</span>
      </button>
    </div>
  )
}

export default RainSoundToggle
