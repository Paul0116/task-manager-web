# Component Hierarchy

## Application Tree

```
App (React Query + Theme Provider)
├── BrowserRouter
│   └── Routes
│       ├── Route: "/" → TasksPage
│       └── Route: "/calendar" → CalendarPage
└── ErrorBoundary

```

## TasksPage Component Tree

```
TasksPage
├── AppBar
│   └── Toolbar
│       ├── Typography ("Task Manager")
│       └── IconButton (Calendar Icon → navigate to /calendar)
├── Container
│   ├── Box (Header)
│   │   ├── Typography ("My Tasks")
│   │   └── Button ("New Task" → opens TaskForm)
│   ├── TaskFilters
│   │   ├── FormControl (Sort By)
│   │   │   └── Select
│   │   │       └── MenuItem (CREATED_AT, PRIORITY, DUE_DATE, CATEGORY)
│   │   ├── DatePicker (Start Date)
│   │   ├── DatePicker (End Date)
│   │   └── Button ("Reset Filters")
│   ├── Typography (Total tasks count)
│   └── TaskList
│       └── Grid
│           └── TaskCard (multiple)
│               ├── CardContent
│               │   ├── Box (Title + Priority Flag)
│               │   ├── Box (Chips)
│               │   │   ├── Chip (Category)
│               │   │   └── Chip (Priority)
│               │   └── Typography (Due date)
│               └── CardActions
│                   ├── IconButton (Edit → opens TaskForm)
│                   └── IconButton (Delete → confirmation)
├── Fab (Floating Action Button - mobile only)
├── TaskForm (Dialog)
└── TaskDrawer (Drawer)
```

## CalendarPage Component Tree

```
CalendarPage
├── AppBar
│   └── Toolbar
│       ├── Typography ("Task Manager")
│       └── IconButton (List Icon → navigate to /)
├── Container
│   ├── Stack (Header)
│   │   ├── Typography ("Calendar View")
│   │   └── Stack (Navigation)
│   │       ├── IconButton (Previous Month)
│   │       ├── Typography (Current Month/Year)
│   │       ├── IconButton (Next Month)
│   │       └── Button ("Today")
│   └── TaskCalendar
│       └── Paper
│           ├── Box (Week day headers)
│           └── Box (Calendar grid)
│               └── Paper (Day cell - multiple)
│                   ├── Typography (Day number)
│                   └── Stack (Tasks)
│                       ├── Badge + Typography (Task title)
│                       └── Typography ("+X more")
├── TaskForm (Dialog)
└── TaskDrawer (Drawer)
```

## TaskForm Component (Dialog)

```
TaskForm
└── Dialog
    ├── DialogTitle ("Create New Task" or "Edit Task")
    ├── form
    │   ├── DialogContent
    │   │   ├── Alert (Error message - if error)
    │   │   ├── TextField (Title)
    │   │   ├── TextField (Category - Select)
    │   │   ├── TextField (Priority - Select)
    │   │   └── DateTimePicker (Due Date)
    │   └── DialogActions
    │       ├── Button ("Cancel")
    │       └── Button ("Create" or "Update")
```

## TaskDrawer Component (Drawer)

```
TaskDrawer
└── Drawer (right-side)
    └── Box
        ├── Box (Header)
        │   ├── Typography ("Task Details")
        │   └── IconButton (Close)
        ├── Divider
        └── Stack (Task Details)
            ├── Box (Title)
            ├── Box (Category)
            │   └── Chip
            ├── Box (Priority)
            │   ├── FlagIcon
            │   └── Chip
            ├── Box (Due Date)
            ├── Divider
            ├── Box (Created At)
            ├── Box (Last Updated)
            └── Box (Task ID)
```

## State Management

### Zustand Store (appStore)

```typescript
AppState {
  // Filters
  filters: {
    sortBy: SortBy
    startDate: Date | null
    endDate: Date | null
    categories: TaskCategory[]
  }
  
  // UI State
  ui: {
    isDrawerOpen: boolean
    selectedTaskId: string | null
    isTaskFormOpen: boolean
    editingTaskId: string | null
  }
  
  // User
  userId: string
  
  // Actions
  setFilters()
  resetFilters()
  setDrawerOpen()
  setSelectedTaskId()
  openTaskForm()
  closeTaskForm()
  setUserId()
}
```

### React Query Cache

```
Query Keys:
- ['tasks'] - Base key
- ['tasks', 'list'] - All lists
- ['tasks', 'list', params] - Specific list with filters
- ['tasks', 'detail'] - All details
- ['tasks', 'detail', id] - Specific task

Mutations:
- createTask
- updateTask
- deleteTask
```

## Data Flow Examples

### Example 1: Creating a Task

```
User Action: Click "New Task" button
    ↓
AppStore: openTaskForm()
    ↓
TaskForm: Opens dialog
    ↓
User: Fills form and clicks "Create"
    ↓
React Hook Form: Validates with Zod
    ↓
useCreateTask: Mutation
    ↓
TaskRepository: createTask(dto)
    ↓
HttpClient: POST /api/tasks (with retry logic)
    ↓
Backend API: Creates task
    ↓
React Query: Updates cache
    ↓
AppStore: closeTaskForm()
    ↓
UI: Shows new task in list
```

### Example 2: Viewing Task Details

```
User Action: Click task card
    ↓
AppStore: setSelectedTaskId(id)
    ↓
TaskDrawer: Opens (isDrawerOpen = true)
    ↓
useTask: Query with task ID
    ↓
React Query: Check cache
    ↓
If cached: Display immediately
If not cached: Fetch from API
    ↓
TaskRepository: getTaskById(id)
    ↓
HttpClient: GET /api/tasks/:id
    ↓
Backend API: Returns task
    ↓
React Query: Cache result
    ↓
TaskDrawer: Displays task details
```

### Example 3: Filtering Tasks

```
User Action: Select "Sort by Priority"
    ↓
AppStore: setFilters({ sortBy: 'PRIORITY' })
    ↓
TasksPage: Rebuilds query params
    ↓
useTasks: New query with params
    ↓
React Query: Check cache for this param combo
    ↓
If not cached: Fetch from API
    ↓
TaskRepository: getTasks({ sortBy: 'PRIORITY' })
    ↓
HttpClient: GET /api/tasks?sortBy=PRIORITY
    ↓
Backend API: Returns sorted tasks
    ↓
React Query: Cache result
    ↓
TaskList: Re-renders with sorted tasks
```

## Component Responsibilities

### Presentational Components
- **TaskCard**: Display task info, handle user interactions
- **TaskList**: Layout task cards in grid
- **TaskCalendar**: Display monthly calendar with tasks
- **TaskFilters**: Show filter controls

### Container Components
- **TasksPage**: Fetch data, manage list view
- **CalendarPage**: Fetch data, manage calendar view

### Smart Components
- **TaskForm**: Form state, validation, submission
- **TaskDrawer**: Fetch and display task details

### Utility Components
- **ErrorBoundary**: Catch and display errors

## Hook Usage

### Custom Hooks
- `useTasks(params)` - Fetch filtered tasks
- `useTask(id)` - Fetch single task
- `useCreateTask()` - Create mutation
- `useUpdateTask()` - Update mutation
- `useDeleteTask()` - Delete mutation
- `useTasksInDateRange(start, end)` - Fetch tasks for date range

### Store Hooks
- `useAppStore(selector)` - Access Zustand state

## Routing

```
/ (Home)
└── TasksPage

/calendar
└── CalendarPage

* (Catch-all)
└── Redirect to /
```

## Dependencies by Layer

### Domain Layer
- zod (validation)

### Data Layer
- axios (HTTP)
- zod (validation)

### Presentation Layer
- react
- react-dom
- react-router-dom
- @mui/material
- @mui/icons-material
- @mui/x-date-pickers
- @tanstack/react-query
- zustand
- react-hook-form
- @hookform/resolvers
- date-fns
