const express = require(`express`)
const app = express()
// const auth = require('../auth/auth')
const control = require('../control/admin')

app.use(express.json())

app.post("/auth", control.Login)

module.exports = app