import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
const app = express();
app.use(express.json());;
const corsOptions = {
    credentials: true,
    origin: process.env.CORS_ORIGIN, // Replace with your client app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
  };
app.use(cors(corsOptions))
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

import authRouter from './routes/auth.route.js'
import dbRouter from './routes/db.routes.js'

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/db', dbRouter)


export {app}