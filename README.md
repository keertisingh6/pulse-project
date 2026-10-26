# Pulse — Intelligent Student Life & Focus Operating System

**Pulse** is an intelligent productivity and academic planning platform designed to help students manage their academic responsibilities, career goals, and daily tasks in one place. It bridges long-term commitments with daily execution through smart prioritization, time management, and AI-powered assistance.

## 🚀 Features

- **Smart Task Prioritization:** Organizes tasks based on deadlines, importance, and urgency.
- **AI-Powered Companion (Kairo):** Provides personalized guidance, recommendations, and productivity support.
- **Academic Planning:** Helps students manage assignments, projects, exams, and career commitments.
- **Deadline Management:** Keeps track of upcoming deadlines and important responsibilities.
- **Zen Focus Studio:** Includes a stopwatch-based focus tool to support distraction-free study sessions.
- **Commitments Feed:** Provides a centralized view of important tasks and ongoing commitments.
- **Personalized Productivity:** Encourages consistent progress through context-aware assistance and intelligent planning.

## 🎯 Problem Statement

Students often struggle to balance academics, personal responsibilities, projects, and career preparation. Traditional productivity tools primarily focus on task lists without connecting long-term goals to everyday execution.

Pulse addresses this challenge by bringing academic planning, task management, focused work, and AI-powered guidance together in a unified platform.

## 💡 Our Solution

Pulse acts as a personal operating system for student life. It helps users organize their responsibilities, identify priorities, manage deadlines, and take actionable steps toward their goals while maintaining a sustainable and low-pressure productivity experience.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite
- **Backend & Database:** Node.js, Express, Firebase Firestore
- **Styling:** Tailwind CSS
- **AI Integration:** Google Gemini API
- **Languages & Tools:** TypeScript, npm, Git, and GitHub

## 🏗️ Project Architecture

Pulse is designed around the following core modules:

1. **AI Core:** Powers intelligent assistance and personalized recommendations.
2. **Task Management:** Organizes tasks, deadlines, and priorities.
3. **Academic Planning:** Connects academic and career commitments with daily goals.
4. **Focus Studio:** Supports focused work sessions.
5. **User Interface:** Provides a centralized dashboard for managing productivity.

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/keertisingh6/pulse-project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd pulse-project
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and add your Google AI Studio key as `GEMINI_API_KEY`. Keep the key server-side; do not use a `VITE_` variable.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in your terminal.

## 🔐 Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Server-side Google Gemini key for Kairo and other Gemini-backed AI features. Set it in the project root `.env` for local development or in Vercel Project Settings → Environment Variables for deployment. Restart locally or redeploy on Vercel after changing it. |

**Important:** Never commit API keys, passwords, or other secrets to GitHub.

## 🌟 Vision

Our vision is to make productivity more intelligent, personalized, and sustainable by helping students move from planning their goals to consistently achieving them.

## 👩‍💻 Project Information

- **Project Name:** Pulse
- **Full Name:** Intelligent Student Life & Focus Operating System
- **Category:** AI-Powered Productivity and Academic Planning
- **Repository:** [pulse-project](https://github.com/keertisingh6/pulse-project)

---

*Pulse — Plan smarter. Focus better. Make progress.*

## 👩‍💻 Contributors

- **Keerti Singh** — [@keertisingh6](https://github.com/keertisingh6)
- **Samridhi Chourasia** — [@samcodes11](https://github.com/samcodes11)

