# Project Structure

This document describes the organization of the Mario game project.

## Directory Structure

```
src/
├── assets/              # Game assets (images, sounds, sprites)
│   ├── images/          # Static images and backgrounds
│   ├── sounds/          # Sound effects and music
│   └── sprites/         # Character and object sprites
├── components/          # React components
│   ├── game/            # Game-specific components
│   └── ui/              # UI components (shadcn/ui)
├── constants/           # Game configuration and constants
│   ├── game.ts          # Game settings, physics constants
│   └── index.ts         # Barrel export
├── features/            # Feature-based organization
│   ├── characters/      # Character logic (Mario, Luigi, etc.)
│   │   ├── Player.ts    # Player character implementation
│   │   └── index.ts
│   ├── game-engine/     # Core game engine
│   │   ├── GameEngine.tsx  # Main game loop and canvas
│   │   └── index.ts
│   ├── levels/          # Level definitions and management
│   │   ├── level1.ts    # First level configuration
│   │   └── index.ts
│   └── powerups/        # Power-up logic (mushrooms, stars, etc.)
│       ├── powerupEffects.ts  # Power-up application logic
│       └── index.ts
├── hooks/               # Custom React hooks
│   ├── useGameControls.ts  # Keyboard input handling
│   ├── useGameLoop.ts      # Game loop management
│   └── index.ts
├── lib/                 # Third-party library setup
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Utility functions
├── types/               # TypeScript type definitions
│   ├── game.ts          # Game entity interfaces
│   └── index.ts
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Key Files

### Types (`src/types/game.ts`)
Defines TypeScript interfaces for all game entities:
- `Character`: Player and NPC characters
- `PowerUp`: Power-up items (mushroom, fire flower, star)
- `Enemy`: Enemy types (Goomba, Koopa Troopa, etc.)
- `Platform`: Ground and platforms
- `Level`: Level configuration
- `GameState`: Overall game state
- `Controls`: Player input controls

### Constants (`src/constants/game.ts`)
Game configuration values:
- Canvas dimensions
- Physics constants (gravity, speeds)
- Player configuration
- Power-up durations
- Keyboard controls

### Features

#### Game Engine (`src/features/game-engine/`)
Core game loop implementation using HTML5 Canvas and requestAnimationFrame.

#### Characters (`src/features/characters/`)
Player character creation and update logic.

#### Levels (`src/features/levels/`)
Level definitions including platforms, enemies, and power-ups.

#### Power-ups (`src/features/powerups/`)
Logic for applying and removing power-up effects.

### Hooks

#### `useGameControls`
Manages keyboard input and returns current control state.

#### `useGameLoop`
Manages the game loop with configurable FPS and pause functionality.

### Components

#### `GameCanvas` (`src/components/game/`)
Main game canvas component that integrates the game engine.

## Adding New Features

### Adding a New Character
1. Define character type in `src/types/game.ts`
2. Create character file in `src/features/characters/`
3. Export from `src/features/characters/index.ts`

### Adding a New Level
1. Create level file in `src/features/levels/`
2. Define platforms, enemies, and power-ups
3. Export from `src/features/levels/index.ts`

### Adding a New Power-up
1. Add power-up type to `PowerUpType` enum in `src/types/game.ts`
2. Add effect logic in `src/features/powerups/powerupEffects.ts`
3. Add duration constant in `src/constants/game.ts`

## Next Steps

1. Implement collision detection system
2. Add physics engine for movement and gravity
3. Create sprite rendering system
4. Build level loader and camera system
5. Add enemy AI behaviors
6. Implement score and lives tracking
7. Add sound effects and music
8. Create menu and UI screens
