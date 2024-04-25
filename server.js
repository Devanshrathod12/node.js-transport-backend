// server.js
import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config.js';
import authRoutes from './Server/routes/authRoute.js';
import cors from 'cors';

const app = express();
const PORT = config.port || 3000;

app.use(cors());

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
