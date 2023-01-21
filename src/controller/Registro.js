import db from '../config/database.js'

export async function CreateNewRegistry(req, res){
    const { date, description, valor } = req.body;
    const session = res.locals.session;
    try {
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
    const session = res.locals.session;
    try{
        const userBalance = await db.collection('balance').find({userId:session.userId}).toArray();
        res.send(userBalance.map(b=>{
            return {date: b.date,description: b.description,valor: b.valor, id:b._id}
        })).status(200)
    } 
    catch {
        res.sendStatus(401);
      }
}