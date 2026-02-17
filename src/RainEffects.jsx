// Deterministic rain drops for background animation
const RAINDROPS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  style: {
    left: `${((i * 37 + 13) % 97) + 1}%`,
    animationDuration: `${0.5 + ((i * 13 + 7) % 50) / 100}s`,
    animationDelay: `${-((i * 17 + 3) % 200) / 100}s`,
    opacity: 0.15 + ((i * 7 + 11) % 25) / 100,
    height: `${12 + ((i * 11 + 5) % 18)}px`,
  },
}))

// Slower, larger drops that drip down the timer "window"
const WINDOW_DROPS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  style: {
    left: `${((i * 29 + 11) % 85) + 5}%`,
    animationDuration: `${3 + ((i * 17 + 7) % 50) / 10}s`,
    animationDelay: `${-((i * 23 + 3) % 80) / 10}s`,
  },
}))

export function BackgroundRain({ active }) {
  return (
    <div className={`rain-container${active ? ' active' : ''}`} aria-hidden="true">
      {RAINDROPS.map(drop => (
        <span key={drop.id} className="raindrop" style={drop.style} />
      ))}
    </div>
  )
}

export function WindowRain({ active }) {
  return (
    <div className={`window-drops${active ? ' active' : ''}`} aria-hidden="true">
      {WINDOW_DROPS.map(drop => (
        <span key={drop.id} className="window-drop" style={drop.style} />
      ))}
    </div>
  )
}
