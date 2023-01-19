import express, { json } from "express";
import cors from "cors";
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv';
import Joi from "joi";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db();
} catch (error) {
    console.log("erronoserv")
}

const app = express();

app.use(json());
app.use(cors());

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email })
    if (user && bcrypt.compareSync(password, user.password)) {
        let token;
        const session = await db.collection('sessions').findOne({ userId: user._id });
        if (session) {
            token = session.token;
        }
        else {
            token = uuid();
            await db.collection('sessions').insertOne({
                userId: user._id,
                token
            })
        }
        res.send(token)
    } else {
        res.sendStatus(404)
    }
})

app.post('/cadastro', async (req, res) => {
    const { name, email, password } = req.body;

    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().required(),
        confirmPassword: Joi.ref('password')
    })
    const validation = schema.validate(req.body, { abortEarly: true });
    if (validation.error) { return res.status(422).send(validation.error.details.map(e => e.message)) }
    try {
        if (await db.collection('users').findOne({ email })) {
            res.status(409).send('Email já cadastrado');
        }
        await db.collection('users').insertOne({ name, email, password: bcrypt.hashSync(password, 10) });
        res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    }
})

app.get('/home', (req, res) => {
    res.status(200).send('eae')
})

app.post('/registro', async (req, res) => {
    const { date, description, valor } = req.body;
    const token = req.headers.authorization;
    const schema = Joi.object({
        date: Joi.date().required(),
        description: Joi.string().required(),
        valor: Joi.number().required()
    })
    const validation = schema.validate(req.body, { abortEarly: true });
    if (validation.error) { return res.status(422).send(validation.error.details.map(e => e.message)) }
    try {
        const session = await db.collection('sessions').findOne({ token });
        if (!session) { res.sendStatus(401)}
        await db.collection('balance').insertOne({
            userId: session.userId,
            date,
            description,
            valor
        });
        res.sendStatus(201);
    }
    catch {
        res.sendStatus(406);
    }
})

app.get('/registro',async(req,res)=>{
    const token = req.headers.authorization
    if(!token) return res.sendStatus(401);
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {return res.sendStatus(401);}
    const user = await db.collection("users").findOne({ 
		_id: session.userId
	})
    if(user) {
        const userBalance = await db.collection('balance').find({userId:user._id}).toArray();
        res.send(userBalance.map(b=>{
            return {date: b.date,description: b.description,valor: b.valor}
        })).status(200)
    } else {
        res.sendStatus(401);
      }
})

const PORT = 5000;
app.listen(PORT, () => console.log('servidorestabemobrigado'))