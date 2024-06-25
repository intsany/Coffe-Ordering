const detail = require('../models/index').order_detail
const order = require('../models/index').order_list

exports.order = async (request, response) => {
    let dataOrder = { //yang di depan nama kolom, yang belakang buat di postman
        customer_name: request.body.customer_name,
        order_type: request.body.order_type,
        order_date: request.body.order_date,
        createdAt: new Date(),
        updatedAt: new Date()
    }
    order.create(dataOrder)
        .then(result => {
            let order_id = result.id
            let order_detail = request.body.order_detail
            let total = 0

            for (let i = 0; i < order_detail.length; i++) {
                order_detail[i].order_id= order_id
                order_detail[i].price = order_detail[i].quantity * order_detail[i].price;
                total += order_detail[i].price;
                if(order_detail[i].quantity<0) {
                    return response.json({
                        message: 'There are to few'
                    })
                }
            }
            detail.bulkCreate(order_detail)
                .then(result => {
                    return response.json({
                        success: true,
                        data: result,
                        message: 'Order list has created'
                    })
                })
                .catch(error => {
                    return response.json({
                        success: false,
                        message: error.message
                    })
                })
        })
}

exports.orderHistory = async (req, res) => {
    try {
        let data = await order.findAll({
            include:
                [
                    {
                        model: detail,
                        as: 'order_detail'
                    }
                ]
        })
        return res.status(200).json({
            status: true,
            data: data,
            message: "Order list has been loaded"
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
}