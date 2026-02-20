import express, {Request, Response, NextFunction, Express } from 'express';
import cors from 'cors'; 
import morgan from 'morgan'; 
import helmet from 'helmet'; 
import userRouter from './routers/userRouter';
import authRouter from './routers/authRouter';

const app: Express = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(","); 

app.use(morgan('tiny'));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow callback

      if (allowedOrigins!.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, 
    credentials: true
  })
);

app.use(helmet());
app.use(express.json());

app.use('/api/users/', userRouter);
app.use('/api/auth/', authRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(200);
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(error.message);
})


export default app;