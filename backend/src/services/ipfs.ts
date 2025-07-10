import axios from 'axios';
import FormData from 'form-data';

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;

export const uploadImageToIPFS = async (imageBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename: fileName });

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: Infinity, // This is important to prevent errors with large files
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataApiSecret,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    throw new Error("Failed to upload image to IPFS.");
  }
};

export const uploadJsonToIPFS = async (jsonContent: any, fileName: string): Promise<string> => {
  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", jsonContent, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataApiSecret,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw new Error("Failed to upload JSON to IPFS.");
  }
};
