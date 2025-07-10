import dotenv from 'dotenv';

dotenv.config();
dotenv.config();
import express from 'express';
import memeRoutes from './routes/meme';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/api', memeRoutes); // Use the meme routes under /api prefix

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
