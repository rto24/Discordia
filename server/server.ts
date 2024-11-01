import express, { Request, Response } from "express";
import session from 'express-session';
import dotenv from "dotenv";
import cors from "cors";
import passport from "./config/passportConfig";
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import storeRoutes from './routes/storeRoutes';
import { initializeWebSocket } from "./services/websocket";
import http from 'http';
import './config/discord';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
initializeWebSocket(server);

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/store', storeRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).send("This is not the page you are looking for...")
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})