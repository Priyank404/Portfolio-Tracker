import express from 'express';
import authRoutes from './Routes/authRoutes.js';
import transactionRoutes from './Routes/transcationRoutes.js';
import cookieParser from 'cookie-parser';
import cors from "cors";



const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // because you're using cookies
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));







app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);

export default app;
