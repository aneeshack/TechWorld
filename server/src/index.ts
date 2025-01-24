import mongoose from 'mongoose';
import app from './presentation/app';
import connectDb from './setup/databaseConnection';
import { envConfig } from './setup/envConfig';

const PORT = envConfig.http.PORT;
const HOST = envConfig.http.HOST;

(async()=> {
    try {
        await connectDb()
        app.listen(PORT,()=>{
            console.log(`server is running http://${HOST}:${PORT}`)
        })
    } catch (error) {
      if(error instanceof mongoose.Error){
        console.log(`failed to connect database ${error.message}`)
      }
      process.exit(1)
    }
})()
