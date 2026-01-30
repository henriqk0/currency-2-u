import express, {Request, Response, NextFunction, Express } from 'express';
import cors from 'cors'; 
import morgan from 'morgan'; 
import helmet from 'helmet'; 
import userRouter from './routers/userRouter';
import moneyRouter from './routers/moneyRouter';

const app: Express = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/users/', userRouter);
app.use('/money/', moneyRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(200);
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(error.message);
})


export default app;