import db from '../config/database.js'
import {RegistroSchema} from '../Model/RegistroSchema.js'

export async function CreateNewRegistry(req, res){
    const { date, description, valor } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    const validation = RegistroSchema.validate(req.body, { abortEarly: true });
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
    catch (e){
        res.status(406).send(e);
    }
}

export async function ListUserBalance(req,res){
    const token = req.headers.authorization?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {return res.sendStatus(401);}
    const user = await db.collection("users").findOne({ 
		_id: session.userId
	})
    if(user) {
        const userBalance = await db.collection('balance').find({userId:user._id}).toArray();
        res.send(userBalance.map(b=>{
            return {date: b.date,description: b.description,valor: b.valor, id:b._id}
        })).status(200)
    } else {
        res.sendStatus(401);
      }
}