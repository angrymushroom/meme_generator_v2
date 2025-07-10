## 2. Developer (Dev) Documentation

### Chosen Technology Stack

To ensure simplicity, efficiency, and minimize potential "looping bugs" from complex package imports, we will adopt a modern, lightweight, and serverless-friendly stack.

*   **Frontend:** **React (with TypeScript)** for building a dynamic and responsive user interface. We will prioritize a minimal UI library or custom CSS to keep the bundle size small and avoid heavy dependencies.
*   **Backend:** **Node.js with Express.js (TypeScript)**. This will serve as a lightweight API responsible for handling image uploads, interacting with IPFS, and performing all Solana blockchain operations. This choice is highly suitable for serverless deployment.
*   **Blockchain Interaction:**
    *   `@solana/web3.js`: The foundational library for interacting with the Solana blockchain (connecting to RPC, sending transactions).
    *   `@solana/spl-token`: For programmatic interaction with the SPL Token Program (creating token mints, minting tokens).
    *   `@metaplex-foundation/mpl-token-metadata`: Essential for creating and updating rich metadata for SPL tokens, making them discoverable and visually appealing on explorers.
*   **Image & Metadata Storage:** **Pinata (IPFS Pinning Service)** for reliable, decentralized, and persistent storage of meme images and token metadata JSON files. This abstracts away direct IPFS node management.
*   **Database:** No traditional database for the MVP. All necessary data (e.g., transaction IDs, token addresses) will be returned directly to the user or handled via logging.
*   **Deployment:** **Vercel** for both frontend (static site hosting) and backend (serverless functions). Vercel offers a seamless developer experience for deploying Node.js/React applications with integrated serverless capabilities.

### Environment Setup Guide

Follow these steps to set up your local development environment:

1.  **Install Node.js & npm:** Download and install the latest LTS version of Node.js from [nodejs.org](https://nodejs.org/). npm (Node Package Manager) is included with Node.js.
2.  **Install Solana CLI:**
    ```bash
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)" # Or the latest stable version
    export PATH="/root/.local/share/solana/install/active_release/bin:$PATH" # Add to your shell profile (.bashrc, .zshrc)
    ```
3.  **Configure Solana CLI for Devnet:**
    ```bash
    solana config set --url devnet
    ```
4.  **Generate Service Wallet:** This wallet will be used by your service to pay for Devnet transaction fees.
    ```bash
    solana-keygen new --outfile ~/.config/solana/devnet-service-wallet.json
    ```
    *   **Fund the Wallet:** Obtain Devnet SOL for this wallet from a Solana Devnet Faucet (e.g., `solana airdrop 2`).
5.  **Clone Project & Install Dependencies:**
    ```bash
    git clone <your-repository-url>
    cd meme_generator_v2
    npm install # Installs dependencies for both frontend and backend
    ```
6.  **Environment Variables (`.env`):** Create a `.env` file in the root of your `meme_generator_v2` directory.
    ```
    SOLANA_RPC_URL=https://api.devnet.solana.com
    SERVICE_WALLET_PRIVATE_KEY=<YOUR_SERVICE_WALLET_PRIVATE_KEY_BASE58_ENCODED>
    PINATA_API_KEY=<YOUR_PINATA_API_KEY>
    PINATA_API_SECRET=<YOUR_PINATA_API_SECRET>
    ```
    *   **`SERVICE_WALLET_PRIVATE_KEY`**: This is the base58 encoded private key string from the `devnet-service-wallet.json` file (e.g., `cat ~/.config/solana/devnet-service-wallet.json` and copy the array, then use a tool to base58 encode it, or handle it as a JSON array in your code). **CRITICAL: Never commit this file to version control.** For MVP, this will be managed via `.env` for Devnet testing. For production, secure environment variables (e.g., Vercel secrets) or dedicated secret management services are recommended.
    *   **Pinata Keys**: Obtain your API Key and Secret from your Pinata account dashboard ([pinata.cloud](https://www.pinata.cloud/)).

### Core Logic Breakdown

*   **Frontend (React):**
    *   **User Interface:** A React component (`MemeForm.tsx`) will render the input fields for Name, Symbol, Description, and an image file input.
    *   **Image Preview:** Client-side JavaScript will handle image file selection, displaying a preview of the uploaded image before submission.
    *   **Input Handling & Validation:** React state will manage form inputs, with basic client-side validation to ensure required fields are filled and the image is of an acceptable type/size.
    *   **API Communication:** Upon form submission, the frontend will use `fetch` or `axios` to send a `multipart/form-data` POST request containing the metadata and image file to the backend API endpoint (e.g., `/api/generate-meme-coin`).
    *   **Feedback:** Displays loading indicators, success messages (with token address and explorer link), or error messages based on the backend response.

*   **Image & Metadata Upload (Backend & IPFS):**
    *   **API Endpoint:** The Node.js backend will expose an API endpoint (e.g., `/api/generate-meme-coin`) that accepts the form data.
    *   **Image Processing:** `multer` middleware will parse the incoming `multipart/form-data` to extract the image file.
    *   **IPFS Image Upload:** The backend will use the Pinata API (via `axios` or `node-fetch`) to upload the image file to IPFS. Pinata will return an IPFS Content Identifier (CID) for the image.
    *   **Metadata JSON Creation:** A JSON object conforming to the Metaplex Token Metadata standard will be constructed. This JSON will include the token's name, symbol, description, and the IPFS URL of the uploaded image.
    *   **IPFS Metadata Upload:** This JSON metadata file will also be uploaded to Pinata, yielding a separate IPFS CID for the metadata.

*   **Solana Blockchain Interaction (Backend):**
    *   **Connection:** Establish a connection to the Solana Devnet RPC using `@solana/web3.js` and the `SOLANA_RPC_URL` from environment variables.
    *   **Service Wallet Loading:** The `SERVICE_WALLET_PRIVATE_KEY` will be securely loaded and converted into a `Keypair` object, which will be used to sign all transactions.
    *   **Token Creation:**
        *   A new SPL Token Mint account will be created using `@solana/spl-token`. This defines the new token.
        *   The service wallet will be designated as the mint authority and freeze authority for the token.
    *   **Token Minting:**
        *   An Associated Token Account (ATA) for the new token will be created for the service wallet.
        *   An initial supply of tokens (e.g., 1,000,000,000 tokens with 9 decimal places) will be minted to this ATA.
    *   **Metadata Attachment:**
        *   A new Metadata account will be created using `@metaplex-foundation/mpl-token-metadata`.
        *   This Metadata account will be linked to the newly created token mint and will store the IPFS URL of the metadata JSON, along with the token's name, symbol, and other details.
    *   **Gas Sponsoring Strategy:** All blockchain transactions (creating mint, creating ATA, minting tokens, creating metadata account) will be signed and sent by the `Keypair` derived from `SERVICE_WALLET_PRIVATE_KEY`. The `Connection.sendAndConfirmTransaction` function automatically handles the deduction of transaction fees from this signing wallet, effectively sponsoring the gas for the user.

### Key Libraries & SDKs

*   `@solana/web3.js`: Core library for interacting with the Solana blockchain.
*   `@solana/spl-token`: Solana Program Library for token operations.
*   `@metaplex-foundation/mpl-token-metadata`: For creating and managing rich token metadata.
*   `express`: Fast, unopinionated, minimalist web framework for Node.js (backend API).
*   `multer`: Node.js middleware for handling `multipart/form-data`, primarily for file uploads.
*   `axios` or `node-fetch`: For making HTTP requests to external services like Pinata.
*   `dotenv`: To load environment variables from a `.env` file.
*   `react`: JavaScript library for building user interfaces.
*   `react-dom`: Entry point for React to the DOM.
*   `typescript`: Superset of JavaScript that adds static types, improving code quality and maintainability.

### Initial Project Structure (Conceptual)

```
meme_generator_v2/
├── .env                  # Environment variables (local development)
├── package.json          # Root package.json for monorepo-like setup or shared scripts
├── tsconfig.json         # Root TypeScript configuration
├── README.md             # Project README
├── frontend/
│   ├── public/
│   │   └── index.html    # HTML entry point
│   ├── src/
│   │   ├── App.tsx       # Main React application component
│   │   ├── index.tsx     # React app entry point
│   │   ├── components/
│   │   │   └── MemeForm.tsx # Component for user input form
│   │   └── styles/
│   │       └── App.css   # Basic styling
│   ├── package.json      # Frontend dependencies and scripts
│   └── tsconfig.json     # Frontend TypeScript configuration
└── backend/
    ├── src/
    │   ├── index.ts          # Main server entry point / serverless function handler
    │   ├── routes/
    │   │   └── meme.ts       # API routes related to meme generation
    │   ├── services/
    │   │   ├── solana.ts     # Logic for Solana blockchain interactions
    │   │   └── ipfs.ts       # Logic for IPFS (Pinata) interactions
    │   └── utils/
    │       └── helpers.ts    # General utility functions
    ├── package.json      # Backend dependencies and scripts
    └── tsconfig.json     # Backend TypeScript configuration
```

### Testing Strategy

*   **Unit Tests:** Implement unit tests for isolated functions within `backend/src/services/solana.ts` and `backend/src/services/ipfs.ts` (e.g., `uploadImageToIPFS`, `createTokenMint`). Use a testing framework like Jest.
*   **Integration Tests:** Develop integration tests for the backend API endpoints. These tests will simulate requests to `/api/generate-meme-coin` and verify the correct responses, including checking for on-chain activity on Solana Devnet (e.g., confirming token mint creation and metadata).
*   **Manual Devnet Testing:** After deployment, perform thorough manual testing by interacting with the live web UI on Devnet. Verify that tokens are created correctly, metadata is visible on Solana explorers (e.g., `explorer.solana.com/?cluster=devnet`), and the user experience is smooth.

### Deployment Strategy (MVP)

The simplest and most efficient deployment strategy for the MVP, leveraging the chosen stack, is Vercel.

*   **Frontend Deployment:**
    *   The `frontend/` directory will be configured as a static site project on Vercel.
    *   Vercel will automatically build the React application (e.g., `npm run build` in `frontend/`) and serve the resulting static files.
*   **Backend Deployment:**
    *   The `backend/src/index.ts` (or a specific serverless function file) will be deployed as a serverless function on Vercel.
    *   Vercel automatically detects Node.js projects and deploys them as serverless functions, handling scaling and infrastructure.
    *   **Environment Variables:** Crucially, all sensitive environment variables (`SOLANA_RPC_URL`, `SERVICE_WALLET_PRIVATE_KEY`, `PINATA_API_KEY`, `PINATA_API_SECRET`) must be securely configured within the Vercel project settings, not committed to the repository.

This setup provides a robust, scalable, and easy-to-manage deployment for your MVP.