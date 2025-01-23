import app from './presentation/server';
import connectDb from './setup/databaseConnection';

(async()=> {
    try {
        await connectDb()
        app.listen(5000,()=>{
            console.log('server is running')
        })
    } catch (error) {
        console.log('error')
    }
})
