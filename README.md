# Zephyrus: The Ultimate Coding Event Platform

Zephyrus is a modern, timed coding competition platform designed for live events. It provides a clean, distraction-free, and secure environment for participants to solve multiple programming problems using either Python or C. The application is built with Next.js and leverages Genkit for backend code execution.

![Zephyrus Welcome Screen](/images/welcome_screen.png)

## Key Features

- **Timed Challenge**: A 45-minute countdown timer keeps the pressure on.
- **Exit Warning**: The browser warns users if they try to close the tab during the competition, preventing accidental exits.
- **Multi-Problem Format**: Participants navigate through a series of coding challenges.
- **Dual Language Support**: Seamlessly toggle between **Python** and **C** for any problem.
- **Live Code Execution**: Run code against standard input and view the output directly in the app.
- **Syntax Highlighting**: The code editor provides syntax highlighting for both Python and C to improve readability.
- **Secure & Fair Environment**:
    - Problem statements are rendered as images to prevent copy-pasting.
    - Copy/paste and right-clicking are disabled on the review screen to prevent cheating.
    - Code autocompletion is intentionally disabled in the editor to ensure a fair test of skill.
- **Comprehensive Review**: A dedicated screen allows participants to review all their attempted solutions before final submission.
- **Automated Summary with Auto-Save**: On completion or when the timer expires, a `.txt` file summarizing the user's name, chest number, and all submitted code is automatically downloaded. The system automatically saves any unsaved code from the active editor when time runs out, ensuring no work is lost.
- **Simple Authentication with Quiz**: Participants start by entering their name, a unique "Chest Number", and answering a simple question to begin.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI & Code Execution**: [Genkit](https://firebase.google.com/docs/genkit) (with Google's Gemini)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Code Editor**: [CodeMirror](https://codemirror.net/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v20 or later)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/zephyrus.git
    cd zephyrus
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```env
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

4.  **Run the Genkit development server:**
    Genkit powers the code execution. Open a terminal and run:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit server and watch for any changes in the `src/ai` directory.

5.  **Run the Next.js development server:**
    In a separate terminal, run the main application:
    ```bash
    npm run dev
    ```

6.  **Open the application:**
    Navigate to [`http://localhost:9002`](http://localhost:9002) in your browser to see the application.

---

## Project Structure

Here is an overview of the key files and directories in the project:

```
/
├── src/
│   ├── app/                # Main application pages and routes (Next.js App Router)
│   │   ├── page.tsx        # Main component managing game state (welcome, playing, review, finished)
│   │   ├── layout.tsx      # Root layout
│   │   └── actions.ts      # Server Actions for form submissions (e.g., code execution)
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Core UI components from shadcn/ui
│   │   ├── code-panel.tsx  # The interactive code editor and execution panel
│   │   ├── welcome-screen.tsx # The initial screen for user registration
│   │   └── zephyrus.tsx    # The main game interface component
│   ├── ai/                 # Genkit-related files for AI and backend logic
│   │   ├── flows/          # Genkit flows (e.g., execute-code.ts)
│   │   └── genkit.ts       # Genkit configuration
│   └── lib/                # Utility functions and shared libraries
│       ├── problems.ts     # The list of coding problems for the event
│       └── utils.ts        # Shared utility functions (e.g., cn for classnames)
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

---

This project was bootstrapped with Firebase Studio.
# Zephyrus7.0-Coding
