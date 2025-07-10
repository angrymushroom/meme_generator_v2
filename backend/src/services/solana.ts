import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';

const solanaRpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const serviceWalletPrivateKey = process.env.SERVICE_WALLET_PRIVATE_KEY;

const connection = new Connection(solanaRpcUrl, 'confirmed');

const getServiceWallet = (): Keypair => {
  if (!serviceWalletPrivateKey) {
    throw new Error("SERVICE_WALLET_PRIVATE_KEY is not set in environment variables.");
  }
  // Assuming the private key is a base58 encoded string
  const decoded = Buffer.from(serviceWalletPrivateKey, 'base64');
  return Keypair.fromSecretKey(decoded);
};

export const createMemeCoin = async (
  name: string,
  symbol: string,
  description: string,
  imageUri: string,
  metadataUri: string
): Promise<string> => {
  const serviceWallet = getServiceWallet();

  // 1. Create new token mint
  const mint = await createMint(
    connection,
    serviceWallet, // Payer
    serviceWallet.publicKey, // Mint Authority
    serviceWallet.publicKey, // Freeze Authority
    9 // Decimals
  );

  console.log(`Created new token mint: ${mint.toBase58()}`);

  // 2. Get or create associated token account for the service wallet
  const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    serviceWallet, // Payer
    mint,
    serviceWallet.publicKey // Owner
  );

  console.log(`Created associated token account: ${associatedTokenAccount.address.toBase58()}`);

  // 3. Mint initial supply to the associated token account
  const totalTokens = 1_000_000_000; // 1,000,000 tokens with 9 decimals
  await mintTo(
    connection,
    serviceWallet, // Payer
    mint,
    associatedTokenAccount.address,
    serviceWallet.publicKey, // Mint Authority
    totalTokens
  );

  console.log(`Minted ${totalTokens} tokens to ${associatedTokenAccount.address.toBase58()}`);

  // 4. Create metadata account
  const metadataPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];

  const transaction = new Transaction().add(
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: mint,
        mintAuthority: serviceWallet.publicKey,
        payer: serviceWallet.publicKey,
        updateAuthority: serviceWallet.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: name,
            symbol: symbol,
            uri: metadataUri,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
          },
          isMutable: true,
          collectionDetails: null,
        },
      }
    )
  );

  await sendAndConfirmTransaction(connection, transaction, [serviceWallet]);

  console.log(`Created metadata account for token: ${mint.toBase58()}`);

  return mint.toBase58(); // Return the mint address
};
