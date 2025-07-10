# Bug Tracker

This document serves as a simple bug tracker for the Solana Meme Coin Generator project. For each bug, please include the following information:

## Bug Template:

### Bug ID: [Unique Identifier, e.g., BUG-001]
*   **Status:** [Open/In Progress/Resolved/Closed]
*   **Severity:** [Critical/High/Medium/Low]
*   **Reported By:** [Your Name/User]
*   **Date Reported:** [YYYY-MM-DD]
*   **Description:**
    *   A clear and concise description of the bug.
    *   Steps to reproduce the bug.
    *   Expected behavior.
    *   Actual behavior.
*   **Affected Component(s):** [Frontend/Backend/Solana Interaction/IPFS Integration/Documentation]
*   **Environment:** [e.g., Local Devnet, Vercel Deployment]
*   **Screenshots/Logs (if applicable):** [Link to image or paste relevant logs]
*   **Resolution:**
    *   Description of the fix implemented.
    *   Date Resolved: [YYYY-MM-DD]

---

## Recorded Bugs:

### Example Bug: BUG-001
*   **Status:** Resolved
*   **Severity:** Medium
*   **Reported By:** Gemini CLI
*   **Date Reported:** 2025-07-10
*   **Description:**
    *   The image upload functionality on the frontend does not display a preview for images larger than 2MB, even though the backend limit is 500KB.
    *   Steps to reproduce:
        1.  Go to the meme coin creation page.
        2.  Select an image file larger than 2MB.
        3.  Observe that no preview is shown.
    *   Expected behavior: A preview should be shown for images within the 500KB limit, and a clear error message for images exceeding it.
    *   Actual behavior: No preview, no error message for large files.
*   **Affected Component(s):** Frontend
*   **Environment:** Local Devnet
*   **Screenshots/Logs (if applicable):** N/A
*   **Resolution:** Implemented client-side image size validation and preview logic. Previews are now shown for images up to 2MB, with a warning for images exceeding 500KB (backend limit).
    *   Date Resolved: 2025-07-10

### Bug ID: BUG-002
*   **Status:** Resolved
*   **Severity:** Critical
*   **Reported By:** User
*   **Date Reported:** 2025-07-10
*   **Description:**
    *   The backend project fails to build due to TypeScript errors, specifically related to incorrect import paths (leading spaces) and type mismatches when interacting with the Umi and Metaplex token metadata libraries. This prevents the backend server from starting.
    *   The frontend then receives an HTML error page instead of JSON data when trying to fetch the estimated cost, leading to "Error estimating cost: Unexpected token '<', "<!DOCTYPE "... is not valid JSON".
    *   Steps to reproduce:
        1.  Run `npm start` in the root directory.
        2.  Observe the backend build failure in the terminal.
        3.  Open the frontend in a browser (http://localhost:3000).
        4.  Observe the "Error estimating cost: Unexpected token '<', "<!DOCTYPE "... is not valid JSON" message.
*   **Affected Component(s):** Backend, Frontend (due to backend failure)
*   **Environment:** Local Devnet
*   **Screenshots/Logs (if applicable):** See npm terminal logs provided by user.
*   **Resolution:** Rewrote Solana token creation logic in `backend/src/services/solana.ts` to exclusively use the Umi framework, resolving TypeScript errors and ensuring proper backend build and functionality. Updated `backend/src/routes/meme.ts` to reflect the new `createMemeCoin` function signature.
    *   Date Resolved: 2025-07-10