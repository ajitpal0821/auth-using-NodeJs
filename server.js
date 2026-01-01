require('dotenv').config()

const express = require('express');
const app = express()

const jwt = require('jsonwebtoken')
app.use(express.json())

app.get('/posts', authToken, (req, res) => {
    res.send('<h1>Welcome</h1>')
})


app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username }
    console.log(username)
    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ access_token: access_token })
})

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403)
        req.user = user;
        next()
    })

}

app.listen(3000, () => {
    console.log("App Listening at port 3000")
})