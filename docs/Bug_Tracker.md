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
*   **Status:** Open
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
*   **Resolution:** N/A

