import mongoose from 'mongoose';
import { app, server } from './util/app';
import connectDb from './config/databaseConnection';
import { envConfig } from './config/envConfig';

const PORT = envConfig.http.PORT;
const HOST = envConfig.http.HOST;

(async () => {
    try {
        await connectDb();

        server.listen(PORT, () => { // ✅ Use `server.listen` to handle both HTTP & WebSocket
            console.log(`Server is running at http://${HOST}:${PORT}`);
        });
    } catch (error) {
        if (error instanceof mongoose.Error) {
            console.log(`Failed to connect to database: ${error.message}`);
        }
        process.exit(1);
    }
})();

export default server;
