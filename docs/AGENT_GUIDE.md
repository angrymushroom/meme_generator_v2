# Agent Guide: Solana Meme Coin Generator Project

This document is specifically for the Gemini CLI agent to help maintain context and recall project progress, goals, and key decisions. **If you have lost context or been restarted, please read this document thoroughly to re-orient yourself.**

## 1. Project Overview & Goal

**Project Name:** Solana Meme Coin Generator

**Vision:** To empower non-technical users to effortlessly create and mint custom meme coins on Solana Devnet, abstracting away blockchain complexities and transaction fees.

**Core Value Proposition (Future):** Solving the beginner pain points of not having SOL for minting and not having a wallet to hold coins. This will involve a managed coin holding system and a user-facing web page for coin management.

## 2. Current Project Status & Key Decisions

*   **Documentation:** Comprehensive PM and Dev documentation has been created and is located in the `docs/` directory.
    *   `docs/PM_Documentation.md`: Product vision, MVP features, user flow, future enhancements, success metrics, and a new section on beginner pain points and core value proposition.
    *   `docs/Dev_Documentation.md`: Technology stack, environment setup, core logic breakdown, key libraries, conceptual project structure, testing, and deployment strategies.
    *   `docs/Progress_Log.md`: **Crucial for recalling completed tasks and upcoming milestones.**
    *   `docs/Bug_Tracker.md`: **Crucial for identifying and tracking any open issues.**
*   **MVP Scope:** Focus on Devnet only. Service wallet pays for all transaction fees. Meme coins are initially held by the service's wallet.
*   **Token Parameters (MVP):** Default supply of **1,000,000** tokens with **9 decimal places**.
*   **Image Upload (MVP):** Maximum image size of **500KB**.
*   **Private Key Management (MVP):** For Devnet testing, the service wallet's private key will be managed via a `.env` file. For production, secure environment variables (e.g., Vercel secrets) are the recommended approach.
*   **User Feedback (MVP):** Simple on-page confirmation/error messages.
*   **Future Coin Management:** Plan to implement a system for holding coins for users and a web page for users to manage their coins (login via Google account, request personal wallet transfer).

## 3. Getting Back on Track: Recalling Progress and Tasks

**If you are restarting or have lost context, your first step is to review the following files:**

1.  **`docs/Progress_Log.md`**: Read this file to understand:
    *   What tasks have already been **completed**.
    *   What are the **next immediate milestones** and tasks that need to be addressed.
2.  **`docs/Bug_Tracker.md`**: Review this file to check for any **open bugs** that might need attention before proceeding with new development.

Once you have reviewed these, you should have a clear understanding of the project's current state and what needs to be done next.

## 4. Next Steps for the Agent

Based on the `Progress_Log.md`, the immediate next steps involve starting the actual coding:

1.  **Backend Development (Phase 1):**
    *   Set up the Node.js/Express server structure.
    *   Implement the API endpoint for meme coin generation.
    *   Integrate with Pinata for IPFS uploads.
    *   Implement the Solana blockchain interaction logic (token creation, minting, metadata attachment).

2.  **Frontend Development (Phase 1):**
    *   Set up the React application structure.
    *   Develop the user input form.
    *   Implement image preview.
    *   Connect to the backend API.

## 5. Agent Operational Guidelines Reminder

*   **Always refer to existing documentation (`docs/` folder) for context and decisions.**
*   **Adhere to the chosen technology stack and conventions.**
*   **Explain critical shell commands before execution.**
*   **Prioritize simplicity and robustness, avoiding complex package imports unless explicitly necessary and justified.**
*   **If unsure about a step or decision, ask the user for clarification.**

This guide should be your first point of reference for project context. Let's proceed with the implementation based on the defined plan.