const admin = require('../models/index').admin
const md5 = require('md5')
const jsonwebtoken = require('jsonwebtoken')
const SECRET_KEY = "coffeeshop"

exports.Login = async (request, response) => {
    try {
        const data = { //email password email
            email: request.body.email,
            password: md5(request.body.password)
        }
        console.log(data)
        const findAdmin = await admin.findOne({ where: data }) //buat nyari admin yang sesuai sama yang dimasukin
        if (findAdmin == null) {
            return response.status(400).json({
                message: "Can't Login"
            })
        }
        let tokenPayLoad = { //data dalam token
            id_admin: findAdmin.id,
            name: findAdmin.name,
            email: findAdmin.email,
        }
        tokenPayLoad = JSON.stringify(tokenPayLoad) //dibikin jadi token
        let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY)
        return response.status(200).json({
            status: true,
            message: "Succses! You are logged in",
            data: {
                id_admin: findAdmin.id,
                name: findAdmin.name,
                email: findAdmin.email,
                token: token
            }
        })
    }
    catch (error) {
        console.log(error);
        return response.status(400).json({
            message: error
        })
    }
}