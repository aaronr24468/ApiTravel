import express from "express";
import cors from 'cors';
import {createServer} from 'http'
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import { router as registerRouter } from "./routes/registerRoute.mjs";
import { router as loginRouter } from "./routes/loginRoute.mjs";
import { router as infoRouter } from "./routes/routes.mjs";
import morgan from "morgan";
import { expressjwt } from "express-jwt";
import cookieParser from "cookie-parser";
import {config} from 'dotenv';
config();

const port = process.env.PORT

const app = express();
const server = createServer(app)

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(morgan('dev'))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), '/images')));

app.use('/register', registerRouter);
app.use('/login', loginRouter);

app.use('/v1/travel',expressjwt({secret: 'secret', algorithms: ['HS256'], getToken: (req) => req.cookies.travelToken}), infoRouter)

// app.get('/', (request, response) =>{
//     response.redirect('/v1/travel')
// });

app.use((err, request, response, next) =>{
    if(err.name === "UnauthorizedError"){
        response.status(401).json('Unauthorized')
    }else{
        next();
    }
})

server.listen(8080, () =>{
    console.log(`Listening to the http://localhost:${port}`)
})