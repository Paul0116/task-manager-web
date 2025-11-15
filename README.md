# Task Manager Frontend

A modern, clean, and responsive personal task manager application built with React, TypeScript, Material-UI, and Clean Architecture principles.

## Features

### Core Features
- **Create, Read, Update, Delete (CRUD) Tasks**
- **Calendar View** - Visualize tasks in a monthly calendar
- **List View** - View tasks in a detailed list format
- **Advanced Filtering & Sorting**
  - Sort by: Priority, Due Date, Category, Created Date
  - Filter by date range
-  **Task Categories** - Organize tasks into: Work, Personal, Health, Education, Shopping
-  **Priority Levels** - Set priorities from 1 (lowest) to 5 (highest)
-  **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Technical Features
-  **Automatic Retry Logic** - Handles API failures gracefully with exponential backoff
-  **Optimistic Updates** - Fast, responsive UI with React Query
-  **State Persistence** - Filters and preferences saved locally
-  **Material-UI Design** - Clean, modern, and accessible interface
-  **Type Safety** - Full TypeScript coverage with Zod validation
-  **Clean Architecture** - Separated layers for maintainability

## Architecture

This project follows **Clean Architecture** principles:

```
src/
├── domain/              # Business logic & entities
│   ├── entities/        # Domain models and Zod schemas
│   └── repositories/    # Repository interfaces
├── data/                # Data access layer
│   ├── api/            # HTTP client with retry logic
│   ├── config/         # Configuration
│   └── repositories/   # Repository implementations
└── presentation/        # UI layer
    ├── components/     # React components
    ├── hooks/          # React Query hooks
    ├── pages/          # Page components
    ├── store/          # Zustand state management
    ├── theme/          # Material-UI theme
    └── utils/          # Helper functions
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Query** - Server state management
- **Zustand** - Client state management
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **React Router** - Routing
- **Axios** - HTTP client
- **date-fns** - Date utilities

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8080`

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd task-manager-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update the values if needed:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_USER_ID=Argaop01
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to `http://localhost:3000`

## Usage

### Creating a Task

1. Click the **"New Task"** button or the floating **"+"** button (mobile)
2. Fill in the task details:
   - **Title**: Task name
   - **Category**: Work, Personal, Health, Education, or Shopping
   - **Priority**: 1 (lowest) to 5 (highest)
   - **Due Date**: Date and time when the task is due
3. Click **"Create"**

### Viewing Tasks

#### List View (Default)
- View all tasks in a card-based grid layout
- Each card shows:
  - Task title
  - Category chip (colored)
  - Priority chip (colored)
  - Due date (with overdue indicator)
  - Edit and Delete buttons

#### Calendar View
- Click the calendar icon in the header
- View tasks on a monthly calendar
- Navigate between months using arrow buttons
- Click on a task to view details
- Color-coded by category

### Filtering & Sorting

Use the filter controls at the top of the list view:
- **Sort By**: Choose how tasks are ordered
- **Start Date**: Filter tasks starting from this date
- **End Date**: Filter tasks up to this date
- **Reset Filters**: Clear all filters

### Editing a Task

1. Click the **edit icon** on a task card
2. Modify the desired fields
3. Click **"Update"**

### Deleting a Task

1. Click the **delete icon** on a task card
2. Confirm the deletion in the popup dialog

### Viewing Task Details

- Click on any task card to open the details drawer
- View all task information including:
  - Full title and description
  - Category and priority
  - Due date (with overdue status)
  - Created and updated timestamps
  - Task ID

## API Integration

The app integrates with the backend API at `/api/tasks`:

- **GET** `/api/tasks` - Fetch all tasks (with query params)
- **GET** `/api/tasks/:id` - Fetch single task
- **POST** `/api/tasks` - Create task
- **PUT** `/api/tasks/:id` - Update task
- **DELETE** `/api/tasks/:id` - Delete task

### Query Parameters
- `sortBy`: CREATED_AT | PRIORITY | DUE_DATE | CATEGORY
- `startDate`: ISO 8601 date string
- `endDate`: ISO 8601 date string

### Error Handling

The app handles various error scenarios:
- **Network errors**: Automatic retry with exponential backoff
- **Rate limiting (429)**: Automatic retry after delay
- **Server errors (5xx)**: Automatic retry with backoff
- **Validation errors (400)**: Display error messages to user
- **Authorization errors (403)**: Display access denied message
- **Not found errors (404)**: Display not found message

## Project Structure

```
task-manager-frontend/
├── public/              # Static assets
├── src/
│   ├── domain/         # Domain layer (entities, interfaces)
│   ├── data/           # Data layer (API, repositories)
│   ├── presentation/   # Presentation layer (components, pages)
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── vite-env.d.ts   # Vite type definitions
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── README.md           # This file
```

## Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Build
npm run build        # Build for production

# Preview
npm run preview      # Preview production build

# Lint
npm run lint         # Run ESLint
```

## Customization

### Change Theme Colors

Edit `src/presentation/theme/theme.ts`:
```typescript
primary: {
  main: '#1976d2',  // Change primary color
},
```

### Change Category Colors

Edit `src/presentation/utils/helpers.ts`:
```typescript
export const getCategoryColor = (category: TaskCategory): string => {
  const colors: Record<TaskCategory, string> = {
    WORK: '#1976d2',      // Blue
    PERSONAL: '#9c27b0',  // Purple
    HEALTH: '#2e7d32',    // Green
    EDUCATION: '#ed6c02', // Orange
    SHOPPING: '#0288d1',  // Light Blue
  };
  return colors[category] || '#757575';
};
```

### Add New Categories

1. Update the enum in `src/domain/entities/Task.ts`
2. Add color mapping in `src/presentation/utils/helpers.ts`
3. Backend must also support the new category

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- **Code Splitting**: Routes are lazy-loaded
- **Query Caching**: React Query caches responses for 30 seconds
- **Optimistic Updates**: UI updates immediately before API confirmation
- **Retry Logic**: Failed requests retry automatically
- **Debouncing**: Search and filters are debounced

## Troubleshooting

### API Connection Issues

**Problem**: Can't connect to backend API

**Solution**: 
- Ensure backend is running on `http://localhost:8080`
- Check `.env` file has correct `VITE_API_BASE_URL`
- Verify CORS is enabled on backend

### Tasks Not Showing

**Problem**: Tasks list is empty

**Solution**:
- Check browser console for errors
- Verify `X-User-Id` header is set correctly
- Create a task to test API connection

### Date/Time Issues

**Problem**: Dates showing incorrectly

**Solution**:
- Ensure dates are in ISO 8601 format
- Check browser timezone settings
- Verify date-fns is properly installed

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request
