# ⚡ Task Dashboard SBA

A full-featured task management app built with **React 18 + TypeScript + Vite**.  
Styled with a custom dark theme inspired by [landonorris.com](https://landonorris.com/) — black background, McLaren papaya orange accents.

🔗 **Live Demo:** [https://quasheana226.github.io/task-dashboard-lab/](https://quasheana226.github.io/task-dashboard-lab/)  
📁 **Repository:** [https://github.com/Quasheana226/task-dashboard-lab](https://github.com/Quasheana226/task-dashboard-lab)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Code Examples](#key-code-examples)
- [How to Run Locally](#how-to-run-locally)
- [Screenshots](#screenshots)
- [AI Collaboration](#ai-collaboration)

---

## Overview

This project is a Skills-Based Assessment (SBA) for a React course. The goal was to build a task management dashboard from scratch using core React concepts — no drag-and-drop libraries, no UI component kits. Just React, TypeScript, and inline styles written by hand.

The app was built under a real deadline, which pushed me to make smart decisions about what to build first (state management and types) and what to polish after (styling and UX).

---

## Features

- ✅ Add, edit, and delete tasks
- 🔍 Filter tasks by status, priority, and search text
- 📊 Live stat cards — Total, Pending, In Progress, Completed
- 💾 localStorage persistence — tasks survive page refresh
- ✏️ Edit modal pre-fills with existing task data
- ⚠️ Form validation with inline error messages
- 🎨 Dark theme with McLaren papaya orange (`#FF8000`) accents

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI components and state management |
| TypeScript | Type safety across all components |
| Vite | Fast dev server and build tool |
| localStorage | Data persistence without a backend |
| Inline styles / Tailwind | Component styling |

---

## Project Structure

```
src/
├── types/
│   └── index.ts              # All TypeScript interfaces (Task, TaskStatus, props)
├── components/
│   ├── Dashboard/
│   │   └── Dashboard.tsx     # Brain of the app — holds all state
│   ├── TaskList/
│   │   ├── TaskList.tsx      # Maps tasks to TaskItem cards
│   │   └── TaskItem.tsx      # Single task card with edit/delete
│   ├── TaskFilter/
│   │   └── TaskFilter.tsx    # Search + status + priority filters
│   └── TaskForm/
│       └── TaskForm.tsx      # Add/edit modal with validation
├── App.tsx                   # Root component — wraps Dashboard
└── main.tsx                  # Entry point — mounts React to #root
```

---

## Key Code Examples

### 1. TypeScript interfaces — the shape of every task

Every task in the app follows this exact blueprint. TypeScript shows a red underline anywhere the shape is broken.

```ts
// src/types/index.ts

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}
```

---

### 2. localStorage — save and load tasks with useEffect

Two `useEffect` calls handle persistence. The first loads saved tasks when the page opens. The second saves automatically whenever tasks change.

```tsx
// src/components/Dashboard/Dashboard.tsx

// LOAD — runs once when the app first mounts
useEffect(() => {
  async function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const saved = JSON.parse(raw) as Task[];
      setTasks(saved);
    }
  }
  loadTasks();
}, []); // [] = run only once

// SAVE — runs every time tasks changes
useEffect(() => {
  async function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
  saveTasks();
}, [tasks]); // [tasks] = re-run when tasks changes
```

---

### 3. Filtering logic — computed directly from state

No extra useState needed. The filtered list is recalculated every render from `tasks` and `filters`.

```tsx
// src/components/Dashboard/Dashboard.tsx

let filteredTasks = [...tasks];

if (filters.status) {
  filteredTasks = filteredTasks.filter((t) => t.status === filters.status);
}

if (filters.priority) {
  filteredTasks = filteredTasks.filter((t) => t.priority === filters.priority);
}

if (filters.search && filters.search.trim() !== '') {
  const query = filters.search.toLowerCase();
  filteredTasks = filteredTasks.filter((t) =>
    t.title.toLowerCase().includes(query) ||
    t.description.toLowerCase().includes(query)
  );
}
```

---

### 4. Form validation — validateForm() returns a boolean

Validation runs on submit. Each field is checked with if/else and error state is set separately.

```tsx
// src/components/TaskForm/TaskForm.tsx

function validateForm(): boolean {
  let isValid = true;

  if (!title.trim()) {
    setTitleError('Title is required');
    isValid = false;
  } else if (title.trim().length < 3) {
    setTitleError('Title must be at least 3 characters');
    isValid = false;
  } else {
    setTitleError('');
  }

  return isValid;
}
```

---

### 5. Props down, callbacks up — how TaskItem talks to Dashboard

TaskItem never touches the task array directly. It calls a function that was passed down from Dashboard.

```tsx
// src/components/TaskList/TaskItem.tsx

const handleDelete = () => {
  const confirmed = window.confirm("Hold Up Are You Sure You Want To Delete This Task?");

  if (confirmed) {
    onDelete(task.id); // tells Dashboard to remove this task
  }
};
```

```tsx
// src/components/Dashboard/Dashboard.tsx

const handleDeleteTask = (taskId: string) => {
  setTasks((prev) => prev.filter((t) => t.id !== taskId));
};
```

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/Quasheana226/task-dashboard-lab.git

# 2. Move into the project folder
cd task-dashboard-lab

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev

# 5. Open in browser
# http://localhost:5173
```

---

## Screenshots

> _Add screenshots here once the app is running_

| Dashboard View | Add Task Modal | Filters Active |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## AI Collaboration

This project was completed under a tight deadline. I used **Claude (by Anthropic)** as a coding collaborator throughout the build.

Claude helped me in the following ways:

- **Architecture decisions** — talking through which component should own which piece of state before writing any code
- **Debugging TypeScript errors** — fixing interface mismatches and prop type issues
- **Code style consistency** — keeping all components in the same pattern (inline styles, `if/else`, individual `useState` per field)
- **CSS theming** — translating the Lando Norris site's dark aesthetic into React inline styles and Tailwind classes
- **Git commit messages** — writing clean, descriptive commits as features were completed

All logic, component structure, and final implementation decisions were made by me. Claude acted as a pair programmer — answering questions, explaining concepts, and helping me move faster without getting stuck.

> "Using AI as a tool — not a shortcut — is how modern developers work."

---

_Built by Quasheana · React 18 · TypeScript · Vite_
