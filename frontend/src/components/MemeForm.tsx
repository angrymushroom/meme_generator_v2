import React, { useState } from 'react';
import '../styles/App.css'; // Assuming App.css will contain general styles

interface MemeFormProps {
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  result: { mintAddress: string; explorerUrl: string } | null;
  error: string | null;
}

const MemeForm: React.FC<MemeFormProps> = ({ onSubmit, loading, result, error }) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 500 * 1024) { // 500KB limit
        alert('Image size exceeds 500KB. Please choose a smaller image.');
        setImage(null);
        setImagePreview(null);
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !description || !image) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('symbol', symbol);
    formData.append('description', description);
    formData.append('image', image);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="meme-form">
      <div className="form-group">
        <label htmlFor="name">Meme Coin Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="symbol">Symbol (e.g., DOGE2):</label>
        <input
          type="text"
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          maxLength={10} // Common symbol length limit
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="image">Meme Image (Max 500KB):</label>
        <input
          type="file"
          id="image"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleImageChange}
          required
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Image Preview" />
          </div>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Meme Coin'}
      </button>

      {error && <p className="error-message">Error: {error}</p>}

      {result && (
        <div className="success-message">
          <p>Meme Coin Generated Successfully!</p>
          <p>Mint Address: <code>{result.mintAddress}</code></p>
          <p>
            View on Explorer: <a href={result.explorerUrl} target="_blank" rel="noopener noreferrer">{result.explorerUrl}</a>
          </p>
        </div>
      )}
    </form>
  );
};

export default MemeForm;
