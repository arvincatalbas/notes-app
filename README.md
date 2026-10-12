# Notes App

A lightweight note-taking application built with Expo, React Native, and TypeScript. The app helps users create, view, edit, pin, search, and organize notes in a clean mobile-first interface. Notes are stored locally on the device using AsyncStorage, so data persists between sessions without a backend service.

## Project description

Notes App is designed for quick personal note management. Users can:

- Create notes with a title, content, and category
- Edit or delete existing notes
- Pin important notes to the top of the list
- Search notes by title
- Filter and manage multiple selected notes in batch
- Switch between system, light, and dark themes
- Keep all note data saved locally in the app

This project is a good example of a modern Expo Router app using local state management, context providers, and persistent storage.

## Project folder structure

```bash
notes-app/
├─ .expo/                  # Expo generated cache and build files
├─ assets/                 # App icons, splash, and static assets
├─ scripts/                # Project scripts
├─ src/
│  ├─ app/                 # Expo Router pages and route files
│  │  ├─ _layout.tsx       # Root layout, providers, and stack navigation
│  │  ├─ index.tsx         # Home screen
│  │  ├─ search.tsx        # Search notes screen
│  │  ├─ pinned.tsx        # Pinned notes screen
│  │  ├─ settings.tsx      # Settings screen
│  │  └─ note/
│  │     ├─ create.tsx     # Create note screen
│  │     ├─ [id].tsx       # View note details screen
│  │     └─ edit/[id].tsx  # Edit note screen
│  ├─ components/          # Reusable UI components (cards, inputs, search bar, etc.)
│  ├─ context/             # App-wide state providers: NotesContext, ThemeContext
│  ├─ constants/           # Shared color definitions
│  ├─ data/                # Static data (categories)
│  ├─ hooks/               # Custom hooks like useNotes and use-theme
│  ├─ services/            # Storage layer for AsyncStorage persistence
│  ├─ types/               # TypeScript models (for example Note)
│  ├─ utils/               # Utility helpers like date formatting
│  ├─ global.css           # Global styles for web rendering
│  ├─ declarations.d.ts    # Type declarations
│  └─ ...
├─ .gitignore
├─ AGENTS.md
├─ app.json                # Expo app metadata and configuration
├─ eslint.config.js       # ESLint configuration
├─ LICENSE
├─ package.json            # Dependencies and scripts
├─ tsconfig.json           # TypeScript configuration
├─ README.md               # Project documentation
└─ package-lock.json       # Installed dependency lock file
```

## Installation

Requirements:

- Node.js 18+
- npm or yarn
- Expo CLI (optional; can be used via npx)
- Android emulator, iOS simulator, or a physical device

Install dependencies:

```bash
npm install
```

## Running the project

Start the Expo development server:

```bash
npm start
```

Or use the platform-specific commands:

```bash
npm run android
npm run ios
npm run web
```

To run linting:

```bash
npm run lint
```

## Routing

This project uses Expo Router with file-based routing. The main routes are defined under the `src/app` directory.

### Routes

| Route | Purpose |
|---|---|
| `/` | Home screen showing recent notes and quick actions |
| `/search` | Search notes by title |
| `/pinned` | View pinned notes |
| `/settings` | Theme settings and storage management |
| `/note/create` | Create a new note |
| `/note/[id]` | View a single note |
| `/note/edit/[id]` | Edit an existing note |
| `/+not-found` | Fallback screen for missing routes |

Navigation is configured in `src/app/_layout.tsx`, where the app wraps screens in `ThemeProvider` and `NotesProvider` and customizes stack headers.

## Project architecture

The application follows a simple layered architecture:

### 1. Screen layer
The screens live in `src/app` and are responsible for UI rendering and user interactions. They call custom hooks to access app state and trigger actions.

### 2. State management layer
The app uses React context to manage global state:

- `NotesContext` holds the note list and exposes CRUD operations such as add, update, delete, pin, and batch actions.
- `ThemeContext` manages theme mode and exposes colors used throughout the app.

These providers are mounted in `src/app/_layout.tsx`, making the state available to all screens.

### 3. Data access layer
The persistence logic lives in `src/services/storage.ts` and uses `@react-native-async-storage/async-storage` to save note data under a storage key. This makes the app fully local and offline-friendly.

### 4. Domain model layer
The `Note` type in `src/types/note.ts` defines the structure of each note:

- `id`
- `title`
- `content`
- `category`
- `pinned`
- `createdAt`
- `updatedAt`

### 5. UI components and hooks
Reusable components such as `NoteCard`, `NoteInput`, `SearchBar`, and `CategoryChip` are stored in `src/components`. Custom hooks such as `useNotes` and `use-theme` simplify access to provider logic and common app behavior.

## Tech stack

- Expo
- React Native
- TypeScript
- Expo Router
- AsyncStorage
- React Context

## Notes

This project intentionally keeps the architecture lightweight and easy to extend. If you want to add features like tags, categories filtering, note export, or cloud sync, the current structure provides a clear place to add new screens, hooks, and services.


## Production

https://expo.dev/accounts/arvincatalbas09/projects/notes-app/builds/d3a2c1e6-6689-4465-9508-593fa720dd2f