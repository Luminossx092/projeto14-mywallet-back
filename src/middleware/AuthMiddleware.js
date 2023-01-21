import db from '../config/database.js'

export async function authValidation(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(422).send("Faltou o token meu cria!");

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.status(401).send("Tu não tem autoridade suficiente fi!");

        res.locals.session = session;

        next()

    } catch (error) {
        res.status(500).send(error)
    }
}