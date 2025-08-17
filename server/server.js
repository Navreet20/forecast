import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes.js';  

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://vercel.com/navreet-kaurs-projects-55b22c56/forecast'  
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);

// connect to mongoDB 
mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log('MongoDB connected'))
 .catch(err => console.log(err));

 //route
 app.get('/', (req,res) => {
    res.send('weather app backend is running');
 });

 const PORT = process.env.PORT || 3001;
 app.listen(PORT, () => console.log(`server running on port${PORT}`));