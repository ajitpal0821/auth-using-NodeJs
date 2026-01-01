require('dotenv').config()

const express = require('express');
const app = express()

const jwt = require('jsonwebtoken')
app.use(express.json())
let refresh_tokens = []

app.delete('/logout',(req,res)=>{
    const token=refresh_tokens.filter(token=>token!==req.body.refresh_token)
    res.sendStatus(204)
})

app.post('/token', (req, res) => {
    //to refresh access we need refresh token
    const refresh_token = req.body.refresh_token;
    if (!refresh_token)
        return res.sendStatus(401);

    if (!refresh_tokens.includes(refresh_token))
        return res.sendStatus(403);

    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        const access_token = generateAccessToken({ name: user.name })
        res.json({ access_token: access_token })
    })
})
app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };

//one first login we create access and refresh
    const access_token = generateAccessToken(user);
    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

    refresh_tokens.push(refresh_token);
    res.json({ access_token: access_token, refresh_token: refresh_token })
})
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.listen(4000, () => {
    console.log("Auth Server Listening at port 4000")
})