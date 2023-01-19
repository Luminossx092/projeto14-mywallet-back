import express, { json } from "express";
import cors from "cors";
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv';


dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db;

try{
    await mongoClient.connect();
    db = mongoClient.db();
} catch(error){
    console.log("erronoserv")
}

const app = express();

app.use(json());
app.use(cors());

app.post('/')

app.post('/registry')

app.get('/home',(req,res)=>{
    res.status(200).send('eae')
})

app.post('/entrada')

const PORT = 5000;
app.listen(PORT,()=>console.log('servidorestabemobrigado'))