# TypeMUD Client

Desktop client for TypeMUD — a multiplayer roguelike game platform.

![Status](https://img.shields.io/badge/status-development%20paused-yellow)
![Angular](https://img.shields.io/badge/Angular-15-red)
![Electron](https://img.shields.io/badge/Electron-desktop-blue)

## Overview

TypeMUD Client is an Angular + Electron application that provides a graphical interface for the TypeMUD game server. It features real-time WebSocket communication, an interactive map system, and a modular UI with character management, inventory, and chat.

> ⚠️ **Status:** Development paused. The client is functional but incomplete. Core features work: authentication, character selection, map navigation, and chat.

## Features

- **Interactive Map** — Procedurally rendered minimap with zoom, drag, and room navigation
- **Real-time Communication** — WebSocket connection with automatic reconnection
- **Character System** — Stats, experience, inventory management
- **Chat** — In-game messaging system
- **Russian Morphology** — Proper noun declension using Az (Azazel) library
- **Hotkeys** — Alt+M (map), Alt+C (chat), Alt+P (character), Alt+F (friends)
- **Cross-platform** — Runs on Windows, macOS, Linux via Electron

## Tech Stack

- **Framework:** Angular 15
- **Desktop:** Electron
- **State Management:** RxJS BehaviorSubjects
- **Communication:** WebSocket
- **UI Components:** PrimeNG

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── char-select/     # Character selection screen
│   │   ├── character-info/  # Character stats panel
│   │   ├── chat/            # Chat window
│   │   ├── friends/         # Friends list
│   │   ├── game/            # Main game container
│   │   ├── login/           # Authentication
│   │   ├── map/             # Interactive minimap
│   │   └── progress-bar/    # XP/health bars
│   ├── services/
│   │   ├── state.service.ts      # Application state
│   │   ├── websocket.service.ts  # Server communication
│   │   ├── character.service.ts  # Character operations
│   │   └── location.service.ts   # Map/room operations
│   └── types/               # TypeScript interfaces
├── assets/
│   ├── i18n/               # Translations
│   └── icons/              # App icons
└── Az/                     # Russian morphology library
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run in development mode (browser + electron)
npm start

# Run web only
npm run ng:serve

# Build for production
npm run electron:build
```

### Configuration

Create `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  wsUrl: 'ws://localhost:8080'
};
```

## Related Projects

- [TypeMUD-Instance](https://github.com/Codevanger/TypeMUD-Instance) — Game server (Deno)
- [TypeMUD-WebAPI](https://github.com/Codevanger/TypeMUD-WebAPI) — REST API (NestJS)

## License

MIT
