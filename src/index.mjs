import express from "express";
import cors from 'cors';
import {createServer, get} from 'http'
import {dirname, join} from 'path';
import { fileURLToPath } from "url";
import morgan from "morgan";
import { expressjwt } from "express-jwt";
import cookieParser from "cookie-parser";
import {config} from 'dotenv';
import {schedule} from 'node-cron'

import { router as registerRouter } from "./routes/registerRoute.mjs";
import { router as loginRouter } from "./routes/loginRoute.mjs";
import { router as infoRouter } from "./routes/routes.mjs";
import { router as stripeRoute } from "./routes/stripe.webhook.Route.mjs";
import { router as authRoute } from "./routes/auth.routes.mjs";
import { router as stripeConnect } from "./routes/stripe.routes.mjs";
import { router as driverRoute } from "./routes/driver.routes.mjs";
import { router as userRoute} from "./routes/user.routes.mjs";
import { route as tripRoute } from "./routes/trip.router.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";
import { updateExpiredTrips } from "./models/updateExpiredTrips.mjs";
import { expireBookings } from "./models/user.models.mjs";
import { refundTripNotCancelled } from "./services/refundTripNotCancelled.mjs";

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

schedule("0 0 * * *", async() =>{
    console.log("Revizando viajes vencidos")
    await refundTripNotCancelled(); //creamos refund de viajes que tengan status 1
    await updateExpiredTrips(); // actualizamos el status de los viajes a 0
})

schedule("*/1 * * * *", async() =>{ //este schedule es por si quieres un asiento pero no lo pagaste, reviza estatus y cada cierto tiempo libera el asiento
    expireBookings();
    console.log("Reservaciones Expirados")
})
// app.use(express.urlencoded({extended: false}));
// app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), '/images')));

app.use('/api/stripe/webhook', express.raw({type: "application/json"}),stripeRoute) /*este muddleware es especifico
 solo para obtener la respuesta de stripe por webhook, para permitir webhook se necesita express.raw, este no es compatible con express.json()
 por eso lo ponemos detras de el, las demas rutas siguen igual*/

app.use(express.json());

app.use('/register', registerRouter);

app.use('/login', loginRouter);

app.use('/auth', expressjwt({secret: 'secret', algorithms: ['HS256'], getToken: (req) => req.cookies.travelToken}), authRoute)

app.use('/user', expressjwt({secret: 'secret', algorithms: ['HS256'], getToken: (req) => req.cookies.travelToken}), userRoute)

app.use('/driver', expressjwt({secret: 'secret', algorithms: ["HS256"], getToken: (req) => req.cookies.travelToken}), driverRoute)

app.use('/stripe', expressjwt({secret: 'secret', algorithms: ['HS256'], getToken: (req) => req.cookies.travelToken}) , stripeConnect)

app.use('/trip', expressjwt({secret: 'secret', algorithms: ['HS256'], getToken: (req) => req.cookies.travelToken}), tripRoute)

app.use('/v1/travel',expressjwt({secret: 'secret', algorithms: ['HS256'], getToken: (req) => req.cookies.travelToken}), infoRouter)


app.use(errorHandler)

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