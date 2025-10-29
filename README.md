# AI Resume Parser

AI Resume Parser is a full-stack application that allows users to upload PDF resumes and automatically extract structured candidate information using AI. This eliminates manual data entry for HR teams and recruitment platforms.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [How to use AI Resure Parser?](#how-to-use-the-ai-resume-parser)

---

![Demo GIF](video_ai.mp4)

---
## Features

- Drag-and-drop PDF resume upload
- Automatic extraction of candidate data:
    - Name, Email, Phone
    - Skills
    - Work Experience
    - Education
- Structured, easy-to-read results with UI components
- Responsive design for mobile and desktop
- Supabase Edge Functions for serverless AI processing

---

## Technologies

### Frontend
- **React + TypeScript** (`.tsx` files for components with JSX)
- **Vite** – Fast development and build tool
- **Tailwind CSS** – Utility-first styling framework
- **clsx + tailwind-merge** – Dynamic class name handling

### Backend
- **Supabase Edge Functions** – Serverless functions using Deno
- **Supabase** – Hosted Postgres database, authentication, and API
- **OpenAI API** – AI-powered resume parsing

### Utilities / Libraries
- **pdfjs-dist** – Extract text from PDF files in browser
- **Lucide React** – Icon components
- **Custom Hooks** – `useIsMobile` for responsive behavior
- **UI Components** – Cards, badges, buttons, etc., built with Tailwind

---

### How to use the AI Resume Parser?

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

# Step 5: Open the app on the web.
http://localhost:PORT/
```
# ai-resume-parser
