import { useState, useEffect, useRef } from 'react'
import WhiteNoiseToggle from './WhiteNoiseToggle'

const WORK_TIME = 25 * 60
const SHORT_BREAK = 5 * 60
const LONG_BREAK = 15 * 60

function App() {
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    playNotificationSound()
    showNotification()

    if (mode === 'work') {
      const newSessions = sessions + 1
      setSessions(newSessions)

      if (newSessions % 4 === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('work')
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setHasStarted(false)
    switch (newMode) {
      case 'work':
        setTimeLeft(WORK_TIME)
        break
      case 'shortBreak':
        setTimeLeft(SHORT_BREAK)
        break
      case 'longBreak':
        setTimeLeft(LONG_BREAK)
        break
    }
  }

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = mode === 'work' ? 'Work session complete!' : 'Break complete!'
      const body = mode === 'work'
        ? 'Time for a break!'
        : 'Ready to get back to work?'

      new Notification(title, { body, icon: '⏰' })
    }
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const toggleTimer = () => {
    if (!isRunning) {
      requestNotificationPermission()
      setHasStarted(true)
    }
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setHasStarted(false)
    setTimeLeft(mode === 'work' ? WORK_TIME : mode === 'shortBreak' ? SHORT_BREAK : LONG_BREAK)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return 'WORK'
      case 'shortBreak':
        return 'SHORT BREAK'
      case 'longBreak':
        return 'LONG BREAK'
    }
  }

  return (
    <div className={`app ${mode} ${isDarkMode ? 'dark' : ''}`}>
      <WhiteNoiseToggle isPlaying={isRunning && mode === 'work'} />
      <div className="dark-mode-toggle">
        <button
          className={`theme-btn ${!isDarkMode ? 'active' : ''}`}
          onClick={() => setIsDarkMode(false)}
        >
          Light
        </button>
        <button
          className={`theme-btn ${isDarkMode ? 'active' : ''}`}
          onClick={() => setIsDarkMode(true)}
        >
          Dark
        </button>
      </div>
      <div className="container">
        <div className="header">
          <h1 className="title">POMODORO</h1>
        </div>

        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
            onClick={() => { setIsRunning(false); switchMode('work') }}
          >
            Focus
          </button>
          <button
            className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
            onClick={() => { setIsRunning(false); switchMode('shortBreak') }}
          >
            Short Break
          </button>
          <button
            className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
            onClick={() => { setIsRunning(false); switchMode('longBreak') }}
          >
            Long Break
          </button>
        </div>

        <div className="timer-display">
          <div className="mode-label">{getModeLabel()}</div>
          <div className="time">{formatTime(timeLeft)}</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(timeLeft / (mode === 'work' ? WORK_TIME : mode === 'shortBreak' ? SHORT_BREAK : LONG_BREAK)) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="controls">
          <button className={`control-btn primary${isRunning ? ' pressed' : ''}`} onClick={toggleTimer}>
            {isRunning ? 'Pause' : (hasStarted ? 'Resume' : 'Start')}
          </button>
          <button className="control-btn secondary" onClick={resetTimer}>
            Reset
          </button>
        </div>

        <div className="sessions">
          <div className="sessions-count">Sessions completed: {sessions}</div>
        </div>
      </div>
    </div>
  )
}

export default App
