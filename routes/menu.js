const express = require(`express`)
const app = express()
const auth = require('../auth/auth')
const control = require('../control/coffee')

app.get("/:search", control.searchMenu)
app.post("/", auth.authVerify, control.addMenu)
app.put("/:id", auth.authVerify, control.updateMenu)
app.delete("/:id", auth.authVerify, control.deleteMenu)

module.exports = app