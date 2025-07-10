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

### Bug ID: BUG-003
*   **Status:** Resolved
*   **Severity:** High
*   **Reported By:** User
*   **Date Reported:** 2025-07-10
*   **Description:** Backend failed to start due to `TypeError: Cannot read properties of undefined (reading 'rpcEndpoint')` when initializing Umi, indicating `SOLANA_RPC_ENDPOINT` was not loaded. This was caused by the `.env` file being in the root directory while `dotenv` was configured to look in the `backend` directory, and a mismatch in the environment variable name (`SOLANA_RPC_URL` vs `SOLANA_RPC_ENDPOINT`).
*   **Affected Component(s):** Backend
*   **Environment:** Local Devnet
*   **Resolution:** Corrected the environment variable name in `.env` from `SOLANA_RPC_URL` to `SOLANA_RPC_ENDPOINT`. Instructed user to place `.env` file directly in the `backend` directory for proper loading by `dotenv`.
*   **Date Resolved:** 2025-07-10

### Bug ID: BUG-004
*   **Status:** Resolved
*   **Severity:** Medium
*   **Reported By:** User
*   **Date Reported:** 2025-07-10
*   **Description:** Frontend displayed "Error estimating cost: Unexpected token '<', "<!DOCTYPE "... is not valid JSON" when trying to fetch cost estimation. This occurred because the frontend was making API requests to its own domain (`localhost:3000/api`) while the backend was listening on a different port (`localhost:3001`). The frontend was receiving an HTML error page from its own server instead of JSON from the backend.
*   **Affected Component(s):** Frontend
*   **Environment:** Local Devnet
*   **Resolution:** Added a `proxy` configuration to `frontend/package.json` to redirect `/api` requests to `http://localhost:3001`, ensuring frontend API calls reach the backend server.
*   **Date Resolved:** 2025-07-10

### Bug ID: BUG-005
*   **Status:** Resolved
*   **Severity:** Medium
*   **Reported By:** User
*   **Date Reported:** 2025-07-10
*   **Description:** After successful meme coin creation, the token icon was not visible on Solana Explorer. This was due to the IPFS URIs being returned in the `ipfs://` format, which some platforms (like Solana Explorer's caching) might not reliably resolve for displaying images.
*   **Affected Component(s):** Backend (IPFS service)
*   **Environment:** Local Devnet, Solana Explorer
*   **Resolution:** Modified `backend/src/services/ipfs.ts` to return `https://gateway.pinata.cloud/ipfs/` URLs instead of `ipfs://` URIs for image and metadata, ensuring direct web accessibility for the token's visual assets.
*   **Date Resolved:** 2025-07-10

### Bug ID: BUG-006
*   **Status:** Resolved
*   **Severity:** High
*   **Reported By:** User
*   **Date Reported:** 2025-07-10
*   **Description:** Meme coins were minted with a current supply of 0, making them invisible in user wallets despite being visible on Solana Explorer. This was due to the `createFungible` Umi instruction only creating the token mint, not minting an initial supply.
*   **Affected Component(s):** Backend (Solana service), Frontend (user experience)
*   **Environment:** Devnet, Mainnet
*   **Resolution:** Modified `backend/src/services/solana.ts` to include `mintV1` instruction immediately after token creation, minting a user-specified initial supply to the service wallet's associated token account. Also added a frontend input field for users to define the initial supply.
*   **Date Resolved:** 2025-07-10

### Bug ID: BUG-007
*   **Status:** Resolved
*   **Severity:** High
*   **Reported By:** User
*   **Date Reported:** 2025-07-10
*   **Description:** Encountered `MissingTokenOwnerAccount` error during token minting, indicating that the Associated Token Account (ATA) for the recipient wallet did not exist before attempting to mint tokens into it.
*   **Affected Component(s):** Backend (Solana service)
*   **Environment:** Devnet, Mainnet
*   **Resolution:** Added `createAssociatedToken` instruction to the transaction builder in `backend/src/services/solana.ts` to ensure the ATA is created before tokens are minted into it.
*   **Date Resolved:** 2025-07-10