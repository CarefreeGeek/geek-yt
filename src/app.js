import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
));


app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(express.static('public'));
app.use(cookieParser());


// routes import
// http://localhost:8000/api/v1/users

import router from './routes/user.routes.js';

// routes declaration
app.use('/api/v1/users', router);





export {app};