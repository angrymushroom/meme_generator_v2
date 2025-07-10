import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
  PublicKey,
} from '@metaplex-foundation/umi';
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';
import * as web3 from '@solana/web3.js';
import bs58 from 'bs58'; // Corrected import
import dotenv from 'dotenv';

dotenv.config();

// Define a service for Solana interactions
export class SolanaService {
  private umi: any;
  private serviceKeypair: web3.Keypair;

  constructor() {
    // Initialize Umi with your cluster API and the MPL Token Metadata plugin
    this.umi = createUmi(process.env.SOLANA_RPC_ENDPOINT!).use(mplTokenMetadata());

    // Load the service keypair from the environment variable
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Missing PRIVATE_KEY environment variable');
    }
    this.serviceKeypair = web3.Keypair.fromSecretKey(bs58.decode(privateKey));

    // Convert the web3.js keypair to a Umi signer and set it as the identity
    const umiSigner = createSignerFromKeypair(
      this.umi,
      fromWeb3JsKeypair(this.serviceKeypair)
    );
    this.umi.use(signerIdentity(umiSigner));
  }

  /**
   * Creates a new meme coin with metadata and mints the initial supply.
   * @param name The name of the token.
   * @param symbol The symbol of the token.
   * @param uri The URI for the token's metadata JSON.
   * @returns A promise that resolves with the new token's public key (mint address).
   */
  async createMemeCoin(
    name: string,
    symbol: string,
    uri: string
  ): Promise<PublicKey> {
    try {
      // Generate a new keypair for the mint account.
      const mint = generateSigner(this.umi);
      console.log('New token mint address:', mint.publicKey);

      // Use the Umi builder to create the token and metadata in one transaction
      const tx = await createFungible(this.umi, {
        mint,
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: percentAmount(0), // No royalties
        decimals: 9, // Standard for SPL tokens
      }).sendAndConfirm(this.umi);

      console.log('Successfully created token.', bs58.encode(tx.signature));

      return mint.publicKey;
    } catch (error) {
      console.error('Error creating meme coin:', error);
      throw new Error('Could not create meme coin');
    }
  }

  /**
   * Estimates the cost of minting a new token.
   * @returns A promise that resolves to the estimated cost in SOL.
   */
  async estimateMintCost(): Promise<number> {
    // This is a simplified estimation. A more accurate one would calculate the
    // rent-exempt reserve for the mint and metadata accounts.
    const estimatedCost = 0.05; // Example cost in SOL
    return estimatedCost;
  }
}