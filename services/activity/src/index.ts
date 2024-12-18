import 'dotenv/config';
import http from 'http';
import app from '@/app';
import connectDB from '@/config/connectDB';

const server = http.createServer(app);
const port = process.env.PORT || 4000;
const serviceName = process.env.SERVICE_NAME || 'Activity-Tracking';

const main = async () => {
  try {
    // database connection
    await connectDB();

    // server connection
    server.listen(port, () => {
      console.log(`🚀 ${serviceName} service is listening at http://localhost:${port}`);
    });
  } catch (err: any) {
    console.error('Database error ->', err.message);
  }
};

main();
