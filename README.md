# Pomodoro Timer

A minimal, modern Pomodoro timer web app built with React. Runs completely client-side in the browser.

## Features

- 25-minute work sessions
- 5-minute short breaks
- 15-minute long breaks (after every 4 work sessions)
- Beautiful gradient UI with smooth transitions
- Sound and browser notifications when timer completes
- Session counter
- Fully responsive design
- Runs completely offline after initial load

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

The built files will be in the `dist` folder and can be served from any static file server.

## How to Use

1. Click "Start" to begin a focus session
2. Work for 25 minutes
3. Take a 5-minute break when the timer completes
4. After 4 work sessions, take a 15-minute long break
5. Switch between modes using the top buttons
6. Reset the timer anytime with the "Reset" button

The app will request notification permissions on first use to alert you when sessions complete.
