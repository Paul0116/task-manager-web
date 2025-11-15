# Task Manager Frontend - Quick Start Guide

## Installation Steps

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env if needed (default values should work)

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

## Project Features

✅ **Full CRUD Operations** for tasks
📅 **Calendar View** with monthly navigation
🔍 **Advanced Filtering**: Sort by priority, due date, category, or created date
🎨 **Material-UI Design**: Clean, responsive interface
🔄 **Retry Logic**: Automatic error recovery with exponential backoff
💾 **State Persistence**: Filters saved between sessions
⚡ **React Query**: Optimized caching and mutations
🛡️ **Type Safety**: Full TypeScript + Zod validation

## Architecture Layers

1. **Domain Layer** (`src/domain/`)
   - Entities and business logic
   - Zod schemas for validation
   - Repository interfaces

2. **Data Layer** (`src/data/`)
   - HTTP client with retry logic
   - Repository implementations
   - API configuration

3. **Presentation Layer** (`src/presentation/`)
   - React components
   - Pages and routing
   - Zustand store
   - React Query hooks

## Key Technologies

- React 18 + TypeScript
- Vite (build tool)
- Material-UI v5
- React Query v5
- Zustand (state management)
- React Router v6
- Zod (validation)
- React Hook Form
- Axios (HTTP client)
- date-fns (date utilities)

## API Endpoints

All endpoints use the base URL: `http://localhost:8080/api/tasks`

- `GET /api/tasks` - List tasks (with filters)
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_USER_ID=Argaop01
```

## Folder Structure

```
src/
├── domain/
│   ├── entities/Task.ts         # Task model + Zod schemas
│   └── repositories/            # Repository interfaces
├── data/
│   ├── api/httpClient.ts        # Axios client with retry
│   ├── config/config.ts         # Configuration
│   └── repositories/            # Repository implementations
├── presentation/
│   ├── components/              # Reusable components
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskDrawer.tsx
│   │   ├── TaskFilters.tsx
│   │   ├── TaskCalendar.tsx
│   │   └── ErrorBoundary.tsx
│   ├── pages/                   # Page components
│   │   ├── TasksPage.tsx
│   │   └── CalendarPage.tsx
│   ├── hooks/useTasks.ts        # React Query hooks
│   ├── store/appStore.ts        # Zustand store
│   ├── theme/theme.ts           # MUI theme
│   └── utils/helpers.ts         # Utility functions
├── App.tsx                      # Main app component
└── main.tsx                     # Entry point
```

## Common Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run linter
```

## Troubleshooting

**Issue**: API connection failed
**Fix**: Ensure backend is running on port 8080

**Issue**: TypeScript errors
**Fix**: Run `npm install` to install all dependencies

**Issue**: Tasks not loading
**Fix**: Check console for errors and verify API URL in `.env`

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Create your first task
4. Explore the calendar view
5. Try filtering and sorting options

For detailed documentation, see README.md
