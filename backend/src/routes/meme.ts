import { Router } from 'express';
import multer from 'multer';
import { uploadImageToIPFS, uploadJsonToIPFS } from '../services/ipfs';
import { SolanaService } from '../services/solana';

const solanaService = new SolanaService();

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 500 * 1024 } }); // 500KB limit

router.get('/estimate-cost', async (req, res) => {
  try {
    const cost = await solanaService.estimateMintCost();
    res.status(200).json({ cost });
  } catch (error: any) {
    console.error('Error estimating cost:', error);
    res.status(500).json({ error: error.message || 'Failed to estimate cost.' });
  }
});

router.post('/generate-meme-coin', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required.' });
  }

  const { name, symbol, description, supply } = req.body;

  if (!name || !symbol || !description || !supply) {
    return res.status(400).json({ error: 'Name, symbol, and description are required.' });
  }

  try {
    // 1. Upload image to IPFS
    const imageUri = await uploadImageToIPFS(req.file.buffer, req.file.originalname);
    console.log('Image uploaded to IPFS:', imageUri);

    // 2. Create metadata JSON
    const metadata = {
      name,
      symbol,
      description,
      image: imageUri, // IPFS URI for the image
      properties: {
        files: [
          {
            uri: imageUri,
            type: req.file.mimetype,
          },
        ],
        category: 'image',
      },
    };

    // 3. Upload metadata JSON to IPFS
    const metadataUri = await uploadJsonToIPFS(metadata, `${name.replace(/\s/g, '_')}_metadata.json`);
    console.log('Metadata uploaded to IPFS:', metadataUri);

    // 4. Create meme coin on Solana
    const mintAddress = await solanaService.createMemeCoin(name, symbol, metadataUri, supply);
    console.log('Meme coin created on Solana:', mintAddress);

    res.status(200).json({
      message: 'Meme coin generated successfully!',
      mintAddress,
      explorerUrl: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error('Error generating meme coin:', error);
    res.status(500).json({ error: error.message || 'Failed to generate meme coin.' });
  }
});

export default router;
