# Pulse — Intelligent Student Life & Focus Operating System

> **Core Philosophy:** High Agency, Low Guilt.  
> Pulse connects academic coursework, career roadmaps, and personal habits into a realistic daily execution plan, powered by **Kairo**, a context-aware AI companion.

---

## 🌟 Key Features

### 1. Home Dashboard ("What should I focus on right now?")
- **Hero Banner:** Welcoming student illustration, current date, encouraging subtitle, and a single primary action button to jump directly into your next task.
- **Four Pastel Stat Cards:** Focus time today (sky blue), tasks completed (mint), active goals (butter yellow), and consistency (soft lavender) with real data calculation and zero shame metrics.
- **Visually Dominant Next-Action Card:** Prominently answers the single question college students face every day. Computes urgency, estimated duration, due dates, and offers a 1-click "Start Focus" button.
- **Today's Schedule Strip:** Honest view of planned time blocks vs. free margin.
- **Academic Deadlines & Exams:** Compact list with due dates, subject tags, and circular progress rings.
- **Kairo AI Companion Panel:** Inline suggestion prompts and quick chat input.
- **Curriculum Mastery:** Real-time syllabus topic progress bars by subject.

### 2. Task Management
- Full CRUD operations with instant persistence in browser storage.
- Priority levels: `urgent`, `high`, `medium`, `low`.
- Multi-view tabs: `Today`, `Upcoming`, `Overdue`, `Completed`, `All Tasks`.
- Live search filtering, subject filtering, and sorting by due date, priority, or duration.
- 1-click complete with soft pentatonic chime audio feedback.
- 1-click quick reschedule to tomorrow.
- Direct link to launch a Pomodoro focus block on any task.

### 3. Smart Planner
- **Daily & Weekly Views:** Flexible timeboards from 8:00 AM to 9:00 PM.
- **Honest Workload Meter:** Dynamically computes total planned hours and compares against available hours, advising when a day is healthy or overloaded.
- **Unscheduled Tasks Sidebar:** View tasks that haven't been slotted yet and click "+ Slot into Day" to automatically place them into open schedule gaps.
- **1-Tap Reschedule Unfinished Blocks:** Moves unfinished tasks to tomorrow with a single click.

### 4. Academics Management
- **Subjects & Syllabus:** Track enrolled courses (e.g., *Data Structures & Algorithms*, *Operating Systems*, *Web Architecture*, *Linear Algebra*). Units and topics with interactive completion checkboxes and progress rings.
- **Assignments:** Track submission drafts, weightage, and deadlines. Automatically synchronizes with the task manager so there are no duplicate silos.
- **Exams & Revision:** Countdown timers, location, and high-yield topic checklists.

### 5. Growth, Projects & Career Roadmaps
- **Goals & Roadmaps:** Break semester goals (e.g. *Achieve GPA >= 3.85*, *Master 75 LeetCode Mediums*) into visual milestone nodes. Progress percentage is dynamically derived from completed milestones.
- **Projects & Hackathons:** Track sprint progress, demo links, GitHub repositories, and tech stack tags.
- **Certifications:** Track cloud and industry credentials (e.g., *AWS Certified Cloud Practitioner*).

### 6. Focus Studio
- Distraction-minimizing zen workspace with fullscreen toggle.
- Modes: **Pomodoro (25m)**, **Deep Sprint (50m)**, and **Flow Stopwatch**.
- Task selector: link focus blocks directly to active coursework tasks.
- **Synthesized Ambient Soundscapes (Web Audio API):**
  - Cozy rainfall (filtered pink/brown noise)
  - 432Hz Theta binaural hum (6Hz frequency beat for deep focus)
  - White noise
  - Soft chime bell at session completion
- Logged focus session history with duration and timestamp.

### 7. Habits & Consistency
- Low-guilt daily check-in routines (e.g. *Morning Deep Focus*, *Review Notes Same Day*, *Hydrate*).
- 7-day consistency dot map with positive reinforcement (no punitive streak mechanics).

### 8. Growth Insights
- 100% data-driven metrics calculated strictly from real state:
  - All-time focus hours and session counts
  - Task completion velocity
  - Subject focus distribution bars
  - Habit check-in consistency

### 9. Kairo AI Companion
- Context-aware intelligence receiving task summaries, pending urgencies, deadlines, and focus stats.
- **Dual Engine Architecture:**
  - **Live Google Gemini API:** Uses `gemini-1.5-flash` or `gemini-1.5-pro` via secure backend route.
  - **Intelligent Local Engine:** Built-in high-agency fallback that works 100% offline without requiring an API key.
- **Action Proposal Pipeline:**
  1. Understands request (e.g., "Break down my DAA assignment").
  2. Generates structured proposal card.
  3. User confirms with 1-click **"Apply Proposed Action"**.
  4. Directly updates the application's tasks and schedule.

### 10. Settings & Workspace Management
- Configure student profile, semester, and daily focus goals.
- Enter and verify Google Gemini API key with real-time test connection.
- Export full workspace backup as JSON.
- Reset to realistic sample data or wipe for a fresh blank slate anytime.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React
- **Design System:** Soft lavender (`#7C5CFC`), plum text (`#1E1B4B`), warm off-white (`#F8F7FB`), pastel cards (lavender, blush, butter yellow, sky blue, mint)
- **Audio:** Web Audio API (ambient noise synthesis & pentatonic chime)
- **Build Tool:** Vite 5 with embedded API middleware
- **Backend / AI Proxy:** Vite configureServer middleware handling `/api/kairo` with secure server-side Google Gemini API integration

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; developed on Node v24)
- npm or pnpm

### Quick Start
```bash
# Navigate to the project directory
cd C:\Users\dell\.gemini\antigravity\scratch\pulse

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔑 AI Configuration (Optional)

Pulse works completely out of the box with its built-in **Intelligent Local Engine**.

To connect Kairo to Google Gemini:
1. Set the environment variable before starting:
   ```bash
   $env:GEMINI_API_KEY="your-gemini-api-key"
   npm run dev
   ```
2. Or open **Settings** inside Pulse, enter your Gemini API key in the field, click **Test Key**, and save. The key is stored locally in your browser and used only by your local server proxy.
