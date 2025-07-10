import React, { useState } from 'react';
import './styles/App.css';
import MemeForm from './components/MemeForm';

interface MemeCoinResult {
  mintAddress: string;
  explorerUrl: string;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MemeCoinResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/generate-meme-coin', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate meme coin.');
      }

      const data: MemeCoinResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana Meme Coin Generator</h1>
        <p>Create your own meme coin on Solana Devnet!</p>
      </header>
      <main>
        <MemeForm onSubmit={handleSubmit} loading={loading} result={result} error={error} />
      </main>
    </div>
  );
}

export default App;
