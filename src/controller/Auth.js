import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import db from '../config/database.js'
import { CadastroSchema } from '../Model/CadastroSchema.js'

export async function signIn(req, res) {
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
}

export async function signUp(req, res) {
    const { name, email, password } = req.body;

    const validation = CadastroSchema.validate(req.body, { abortEarly: true });
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
}