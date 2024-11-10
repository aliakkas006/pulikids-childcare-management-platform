import mongoose from 'mongoose';

let connectionURL = process.env.DB_CONNECTION_URL || '';

const connectDB = async () => {
  await mongoose.connect(connectionURL, { dbName: process.env.DB_NAME });
  console.log('Database Connected!');
};

export default connectDB;