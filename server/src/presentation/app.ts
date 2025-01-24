import express,{ Request, Response } from 'express';
import cors from 'cors';
import { envConfig } from '../setup/envConfig';
import cookieParser from 'cookie-parser';

const app = express()

const corseOptions ={
    origin: String(envConfig.http.ORIGIN),
    methods: 'GET, HEAD, PUT, POST, PATCH, DELETE',
    Credential:true,
}
app.get('/api/data', (Request, Response) => {
    Response.json({ message: 'Hello from server!' });
  });
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors(corseOptions))
export default app