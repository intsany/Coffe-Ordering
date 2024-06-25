const coffee = require('../models/index').coffee
const path = require(`path`)
const Op = require(`sequelize`).Op
const fs = require(`fs`)
const upload = require('./image').single('filename')

exports.addMenu = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        if (!request.file) {
            return response.json({ message: "No file" })
        }

        let newMenu = {
            name: request.body.name,
            size: request.body.size,
            price: request.body.price,
            image: request.file.filename
        }
        console.log(newMenu)
        coffee.create(newMenu)
            .then(result => {
                return response.json({
                    status: true,
                    data: result,
                    message: "Success to add menu"
                })
            })
            .catch(error => {
                return response.json({
                    status: false,
                    message: error.message
                })
            })
    })
}

exports.updateMenu = async (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        let id = request.params.id
        let updatedMenu = {
            name: request.body.name,
            size: request.body.size,
            price: request.body.price,
        }
        if (request.file) {
            const menu = await coffee.findOne({
                where: { id: id }
            })
            const oldphoto = menu.image
            const pathfoto = path.join(__dirname, `../image`, oldphoto)
            if (fs.existsSync(pathfoto)) {
                fs.unlinkSync(pathfoto, error => console.log(error))
            }
            updatedMenu.image = request.file.filename
        }
        coffee.update(updatedMenu, { where: { id: id } })
            .then(result => {
                if (result[0] === 1) {
                    return coffee.findByPk(id)
                        .then(updatedMenu => {
                            return response.json({
                                success: true,
                                data: updatedMenu,
                                message: 'Data coffee has been updated'
                            })
                        })
                        .catch(error => {
                            return response.json({
                                success: false,
                                message: error.message
                            })
                        })
                } else {
                    return response.json({
                        success: false,
                        message: 'Data coffee not found or not updated'
                    })
                }
            })
            .catch(error => {
                return response.json({
                    success: false,
                    message: error.message
                })
            })
    })
}

exports.deleteMenu = async (request, response) => {
    const id = request.params.id
    const menu = await coffee.findOne({ where: { id: id } })
    const oldPhoto = menu.image;
    const pathFoto = path.join(__dirname, '../image', oldPhoto)

    if (fs.existsSync(pathFoto)) {
        fs.unlinkSync(pathFoto, (error) => console.log(error))
    }

    coffee.destroy({ where: { id: id } })
        .then(result => {
            return response.json({
                success: true,
                data: menu,
                message: `Menu has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                status: false,
                message: error.message
            })
        })
}

exports.searchMenu = async (request, response) => {
    let search = request.params.search
    let menu = await coffee.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.substring]: search } },
                { size: { [Op.substring]: search } },
                { price: { [Op.substring]: search } },
            ]
        }
    })
    return response.json({ 
        success: true,
        data: menu,
        message: `All menus have been loaded`
    })
}