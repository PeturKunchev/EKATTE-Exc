import 'dotenv/config';
import {Client} from  'pg';

console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_USER:', process.env.DB_USER);

const client = new Client({
  user: process.env.DB_USER,  
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT,
});

client.connect().then(()=>console.log('Connected to PostgreSQL database')).catch(err => console.error('Connection error', err.stack));

export default client;